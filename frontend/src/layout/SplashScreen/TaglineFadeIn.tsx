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
  animation: ${fadeIn} 1s ease-in-out;
  color: ${(props) => props.theme.text};
  font-size: 1.5rem;
  margin-top: 20px;
`;

const TaglineFadeIn = () => {
  return <Tagline>Connecting Minds, Building Futures</Tagline>;
};

export default TaglineFadeIn;
