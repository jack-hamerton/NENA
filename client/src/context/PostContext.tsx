"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Post as PostType, Comment } from '@/types';

interface PostContextType {
  posts: PostType[];
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
  createPost: (title: string, content: string, imageUrl?: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  getComments: (postId: string) => Promise<Comment[]>;
  addComment: (postId: string, content: string, parentId?: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
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
        body: JSON.stringify({ authorId: 'user_1', title, content, mediaUrl: imageUrl }),
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
        body: JSON.stringify({ userId: 'user_1' }),
      });
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount: p.likesCount + 1, isLiked: true } : p))
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

  const addComment = async (postId: string, content: string, parentId?: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: 'user_1', content, parentId }),
      });
      const newComment = await response.json();
      // Since comments are fetched per post via getComments(), 
      // we don't necessarily need to update a global comments state here 
      // unless we want to cache them.
      return newComment;
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      await fetch(`http://localhost:5001/api/posts/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user_1' }),
      });
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <PostContext.Provider value={{ posts, isLoading, fetchPosts, createPost, likePost, getComments, addComment, likeComment }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within a PostProvider');
  return context;
};
