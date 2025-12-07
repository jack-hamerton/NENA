
import React, { useState, useEffect } from 'react';
import Post, { PostData } from '../components/Post';
import { postService } from '../services/postService';

const ActivityFeed = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await postService.getPosts();
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  const handleReport = async (postId: string) => {
    const updatedPost = await postService.reportPost(postId);
    if (updatedPost) {
      setPosts(posts.map((p) => (p.id === postId ? updatedPost : p)));
    }
  };

  return (
    <div className="activity-feed">
      {posts.map((post) => (
        <Post key={post.id} post={post} onReport={handleReport} />
      ))}
    </div>
  );
};

export default ActivityFeed;
