import React from 'react';

export const Document = ({ document }: any) => {
  return (
    <div>
      <h3>{document.title}</h3>
      <p>{document.content}</p>
    </div>
  );
};
