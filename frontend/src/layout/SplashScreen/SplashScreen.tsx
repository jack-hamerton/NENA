import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LogoCentered from './LogoCentered';
import TaglineFadeIn from './TaglineFadeIn';
import TransitionAnimation from './TransitionAnimation';

const SplashScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${props => props.theme.background};
`;

const SplashScreen = () => {
  const [showTagline, setShowTagline] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 1500);

    const transitionTimer = setTimeout(() => {
      setShowTransition(true);
    }, 3500);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(transitionTimer);
    };
  }, []);

  return (
    <SplashScreenContainer>
      <LogoCentered />
      {showTagline && <TaglineFadeIn />}
      {showTransition && <TransitionAnimation />}
    </SplashScreenContainer>
  );
};

export default SplashScreen;
