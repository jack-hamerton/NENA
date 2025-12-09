
import React, { useState, useEffect } from 'react';
import { PostCard } from '../feed/PostCard';
import { usePosts } from '../hooks/usePosts';

export const ActivityFeed: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const { getPosts, reportPost } = usePosts();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [getPosts]);

  const handleReportPost = async (postId: number) => {
    try {
      await reportPost(postId);
      // You might want to update the UI to indicate the post has been reported
    } catch (error) {
      console.error('Error reporting post:', error);
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onReportPost={handleReportPost} />
      ))}
    </div>
  );
};
