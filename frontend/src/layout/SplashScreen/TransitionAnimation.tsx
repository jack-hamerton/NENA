import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
`;

const TransitionContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.theme.background};
  animation: ${slideUp} 1s ease-in-out forwards;
`;

const TransitionAnimation = () => {
  return <TransitionContainer />;
};

export default TransitionAnimation;
