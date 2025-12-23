
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const runningBullet = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  20% {
    transform: translateX(0);
    opacity: 1;
  }
  80% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 15px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.palette.dark};
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AnimatedText = styled.div`
  font-family: ${(props) => props.theme.font};
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.text.primary};
  white-space: nowrap;
  animation: ${(props) => props.animation} 4s linear;
  animation-fill-mode: forwards;
`;

const Tagline = styled.div`
  font-family: ${(props) => props.theme.font};
  font-size: 1.2rem;
  color: ${(props) => props.theme.text.primary};
  animation: ${fadeIn} 2s ease-in;
  animation-fill-mode: forwards;
  opacity: 0;
`;

const Footer = () => {
  const [showTagline, setShowTagline] = useState(false);
  const [showBullet, setShowBullet] = useState(true);

  useEffect(() => {
    const bulletAnimation = setTimeout(() => {
      setShowBullet(false);
      setShowTagline(true);
    }, 4000); // 4s for bullet animation

    const taglineAnimation = setTimeout(() => {
      setShowTagline(false);
    }, 7000); // 2s for fade-in + 1s hold

    const loop = setInterval(() => {
      setShowBullet(true);
      setShowTagline(false);
       const bulletAnimation2 = setTimeout(() => {
        setShowBullet(false);
        setShowTagline(true);
      }, 4000);
      const taglineAnimation2 = setTimeout(() => {
        setShowTagline(false);
      }, 7000);
      //
    }, 8000);

    return () => {
      clearTimeout(bulletAnimation);
      clearTimeout(taglineAnimation);
      // clearTimeout(bulletAnimation2);
      // clearTimeout(taglineAnimation2);
      clearInterval(loop);
    };
  }, []);

  return (
    <FooterContainer>
      {showBullet && (
        <AnimatedText animation={runningBullet}>
          Network "Encrypted Naratives & Advocay"
        </AnimatedText>
      )}
      {showTagline && <Tagline>Dialogue spark change</Tagline>}
    </FooterContainer>
  );
};

export default Footer;
