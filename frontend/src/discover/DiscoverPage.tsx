import React from 'react';
import styled from 'styled-components';

const DiscoverContainer = styled.div`
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const DiscoverPage = () => {
  return (
    <DiscoverContainer>
      <h1>Discover</h1>
      <p>Discover new content and connect with people.</p>
    </DiscoverContainer>
  );
};

export default DiscoverPage;
