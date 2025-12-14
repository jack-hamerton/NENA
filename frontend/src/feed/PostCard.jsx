import React from 'react';

export const PostCard = ({ post, onReportPost }) => {
  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <p>{post.text}</p>
      <button onClick={() => onReportPost(post.id)}>Report</button>
    </div>
  );
};