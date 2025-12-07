import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const LogoContainer = styled.div`
  animation: ${pulse} 2s infinite;
`;

const Logo = styled.img`
  width: 150px;
  height: 150px;
`;

const LogoCentered = () => {
  return (
    <LogoContainer>
      <Logo src="/logo.svg" alt="Nena Logo" />
    </LogoContainer>
  );
};

export default LogoCentered;
