import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  useEffect(() => {
    if (showTransition) {
      const navigateTimer = setTimeout(() => {
        navigate('/app');
      }, 1000); // Delay for the transition animation

      return () => clearTimeout(navigateTimer);
    }
  }, [showTransition, navigate]);

  return (
    <SplashScreenContainer>
      <LogoCentered />
      {showTagline && <TaglineFadeIn />}
      {showTransition && <TransitionAnimation />}
    </SplashScreenContainer>
  );
};

export default SplashScreen;
