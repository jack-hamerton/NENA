import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid ${props => props.theme.palette.secondary};
  border-radius: 5px;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};

  &::placeholder {
    color: ${props => props.theme.text.secondary};
  }
`;

export const Input = (props) => {
  return <StyledInput {...props} />;
};
