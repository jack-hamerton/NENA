import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.background};
  padding: 1rem;
  text-align: center;
  border-top: 1px solid ${props => props.theme.accent};
  color: ${props => props.theme.text};
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 NENA. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
