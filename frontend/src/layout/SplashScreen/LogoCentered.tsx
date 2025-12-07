import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Logo = styled.img`
  animation: ${fadeIn} 1s ease-in-out;
  width: 150px;
  height: 150px;
`;

const LogoCentered = () => {
  return <Logo src="/assets/logo.svg" alt="Nena Logo" />;
};

export default LogoCentered;
