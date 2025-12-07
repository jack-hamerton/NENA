import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
`;

export const Input = (props) => {
  return <StyledInput {...props} />;
};
