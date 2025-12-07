import styled from 'styled-components';

const HeaderContainer = styled.header`
  padding: 20px;
  background-color: ${props => props.theme.background};
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

export const Header = () => {
  return (
    <HeaderContainer>
      <h1>Nena</h1>
    </HeaderContainer>
  );
};
