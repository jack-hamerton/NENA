import React, { useState, useEffect } from 'react';
import postService from '../services/post.service';
import socket from '../services/socket';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    // Fetch initial posts
    postService.getPosts().then(response => setPosts(response.data));

    // Listen for new posts
    socket.on('new post', (post) => {
      setPosts(prevPosts => [post, ...prevPosts]);
    });

    return () => socket.off('new post');
  }, []);

  const handleCreatePost = () => {
    postService.createPost({ content: newPost }).then(response => {
      // Post will be added via WebSocket
      setNewPost('');
    });
  };

  return (
    <div>
      <h2>Community Forum</h2>
      <textarea 
        value={newPost} 
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="What's on your mind?"
      />
      <button onClick={handleCreatePost}>Post</button>
      <div>
        {posts.map(post => (
          <div key={post._id}>
            <p>{post.content}</p>
            {/* Add comments section here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
