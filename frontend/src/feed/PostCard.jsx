
import React from 'react';
import UserAvatar from '../components/UserAvatar';

export const PostCard = ({ post, onReportPost }) => {
  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <UserAvatar user={post.author} />
      <p>{post.text}</p>
      <button onClick={() => onReportPost(post.id)}>Report</button>
    </div>
  );
};