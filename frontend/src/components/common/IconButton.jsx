import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const IconButton = ({ children, onClick }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};