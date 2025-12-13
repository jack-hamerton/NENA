import React from 'react';

interface DocumentProps {
  document: {
    title: string;
    content: string;
  };
}

export const Document: React.FC<DocumentProps> = ({ document }) => {
  return (
    <div>
      <h3>{document.title}</h3>
      <p>{document.content}</p>
    </div>
  );
};
