
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 15px;
  border-radius: 20px;
  background-color: transparent;
  z-index: 1000;
  animation: ${float} 3s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.div`
  font-family: ${(props) => props.theme.font};
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.text};
`;

const CustomN = styled.span`
  color: ${(props) => props.theme.secondary};
`;

const Footer = () => {
  return (
    <FooterContainer>
      <LogoText>
        <CustomN>N</CustomN>ENA
      </LogoText>
    </FooterContainer>
  );
};

export default Footer;
