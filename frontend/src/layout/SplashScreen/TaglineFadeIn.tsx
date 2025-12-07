import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Tagline = styled.h2`
  font-size: 1.5em;
  color: ${props => props.theme.primary};
  animation: ${fadeIn} 1.5s ease-in;
`;

const TaglineFadeIn = () => {
  return <Tagline>Connecting people, ideas, and knowledge</Tagline>;
};

export default TaglineFadeIn;
