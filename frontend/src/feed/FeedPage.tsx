import React from 'react';
import styled from 'styled-components';

const FeedContainer = styled.div`
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const FeedPage = () => {
  return (
    <FeedContainer>
      <h1>Feed</h1>
      <p>Welcome to your feed!</p>
    </FeedContainer>
  );
};

export default FeedPage;
