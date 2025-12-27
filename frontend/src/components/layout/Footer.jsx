import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 20px;
  background-color: ${props => props.theme.background};
  border-top: 1px solid ${props => props.theme.borderColor};
  text-align: center;
`;

export const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2026 Nena. All rights reserved.</p>
    </FooterContainer>
  );
};
