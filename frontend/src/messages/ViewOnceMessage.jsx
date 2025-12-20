import React, { useState } from 'react';
import styled from 'styled-components';

const ViewOnceWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 10px;
  background-color: #f0f2f5;
  border: 1px solid #ddd;
  color: #555;
`;

const Media = styled.img`
    max-width: 100%;
    height: auto;
    border-radius: 10px;
`;

const ViewOnceMessage = ({ mediaUrl }) => {
  const [viewed, setViewed] = useState(false);

  const handleClick = () => {
    if (!viewed) {
      setViewed(true);
    }
  };

  if (viewed) {
    return (
        <ViewOnceWrapper>
            Opened
        </ViewOnceWrapper>
    );
  }

  return (
    <div onClick={handleClick}>
        <ViewOnceWrapper>
            Tap to view photo
        </ViewOnceWrapper>
    </div>
  );
};

export default ViewOnceMessage;
