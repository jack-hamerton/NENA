
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { ThreadedCommentSection } from '../../comments/ThreadedCommentSection';

export const Post = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRes = await api.get(`/posts/${postId}`, {});
        setPost(postRes.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsRes = await api.get(`/posts/${postId}/comments`, {});
        setComments(commentsRes.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    
    fetchPost();
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (commentData) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, commentData);
      if (response.status === 201) { // 201 Created
        // Add the new comment to the state for an instant UI update
        setComments(prevComments => [...prevComments, response.data]);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <ThreadedCommentSection 
        postId={postId}
        comments={comments} 
        onCommentSubmitted={handleCommentSubmit} 
      />
    </div>
  );
};
