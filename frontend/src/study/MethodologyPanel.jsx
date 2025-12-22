
import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.palette.primary};
  border: 1px solid ${({ theme }) => theme.palette.highlight};
  border-radius: 8px;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text.primary};
`;

const MethodologyPanel = ({ kiiCount, surveyCount }) => {
  return (
    <PanelContainer>
      <Title>Methodology</Title>
      <p>This study is based on {kiiCount} Key Informant Interviews and {surveyCount} surveys.</p>
    </PanelContainer>
  );
};

export default MethodologyPanel;
