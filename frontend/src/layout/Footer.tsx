import styled from 'styled-components';
import { xiaoGenshin } from '../theme/xiaoGenshin';

const FooterContainer = styled.footer`
  background-color: ${xiaoGenshin.background};
  padding: 1rem;
  text-align: center;
  border-top: 1px solid ${xiaoGenshin.accent1};
  color: ${xiaoGenshin.text};
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 NENA. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
