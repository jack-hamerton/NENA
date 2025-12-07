import styled from 'styled-components';
import { LogoCentered } from './LogoCentered';
import { TaglineFadeIn } from './TaglineFadeIn';
import { TransitionAnimation } from './TransitionAnimation';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;

export const SplashScreen = () => {
  const [showTagline, setShowTagline] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 1000);

    const transitionTimer = setTimeout(() => {
      setShowTransition(true);
    }, 2500);

    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 3500);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(transitionTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <SplashScreenContainer>
      <LogoCentered />
      {showTagline && <TaglineFadeIn />}
      {showTransition && <TransitionAnimation />}
    </SplashScreenContainer>
  );
};
