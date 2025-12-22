
import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.palette.primary};
  border: 1px solid ${({ theme }) => theme.palette.highlight};
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const FindingsPanel = ({ children }) => {
  return (
    <PanelContainer>
      {children}
    </PanelContainer>
  );
};

export default FindingsPanel;
