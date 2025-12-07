import styled from 'styled-components';

const LogoContainer = styled.div`
  font-family: ${(props) => props.theme.font};
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.text};
  margin-bottom: 40px;
`;

const CustomN = styled.span`
  color: ${(props) => props.theme.secondary};
`;

const NavLogo = () => {
  return (
    <LogoContainer>
      <CustomN>N</CustomN>ENA
    </LogoContainer>
  );
};

export default NavLogo;
