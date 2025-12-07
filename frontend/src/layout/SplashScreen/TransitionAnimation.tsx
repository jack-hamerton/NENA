import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import LogoCentered from './LogoCentered';
import TaglineFadeIn from './TaglineFadeIn';

const slideUp = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
`;

const SplashScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${slideUp} 0.5s ease-in-out 3s forwards;
`;

const TransitionAnimation = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <SplashScreenContainer>
        <LogoCentered />
        <TaglineFadeIn />
      </SplashScreenContainer>
    </div>
  );
};

export default TransitionAnimation;
