import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: ${props => props.theme.palette.accent};
  color: ${props => props.theme.text.primary};
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: ${props => props.theme.palette.secondary};
  }
`;

export const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};
