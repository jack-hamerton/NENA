"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Post {
  id: str;
  authorId: str;
  title: str;
  content: str;
  likesCount: number;
  dislikesCount: number;
  commentCount: number;
  createdAt: string;
  imageUrl?: string;
}

interface Comment {
  id: str;
  postId: str;
  authorId: str;
  content: str;
  createdAt: string;
}

interface PostContextType {
  posts: Post[];
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
  createPost: (title: string, content: string, imageUrl?: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  getComments: (postId: string) => Promise<Comment[]>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/posts/');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPost = async (title: string, content: string, imageUrl?: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/posts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: 'current_user', title, content, imageUrl }),
      });
      const newPost = await response.json();
      setPosts((prev) => [newPost, ...prev]);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const likePost = async (postId: string) => {
    try {
      await fetch(`http://localhost:5001/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current_user' }),
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p))
      );
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const getComments = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}/comments`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchPosts();
    
    // Simulating Firebase real-time listener
    const timer = setInterval(() => {
      // Logic for real-time polling or websocket updates would go here
    }, 10000);
    
    return () => clearInterval(timer);
  }, [fetchPosts]);

  return (
    <PostContext.Provider value={{ posts, isLoading, fetchPosts, createPost, likePost, getComments }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within a PostProvider');
  return context;
};
