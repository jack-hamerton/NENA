import styled, { keyframes } from 'styled-components';

const scaleUp = keyframes`
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const LogoContainer = styled.div`
  animation: ${scaleUp} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: ${(props) => props.theme.text};
  font-size: 3rem;
  font-weight: bold;
`;

const LogoAnimation = () => {
  return <LogoContainer>Connect</LogoContainer>;
};

export default LogoAnimation;
