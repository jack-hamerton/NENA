import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Comment } from './Comment';

export const Post = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const postRes = await api.get(`/posts/${postId}`, {});
      setPost(postRes.data);
      const commentsRes = await api.get(`/posts/${postId}/comments`, {});
      setComments(commentsRes.data);
    };
    fetchPost();
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <div>
        <h3>Comments</h3>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};
