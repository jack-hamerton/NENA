import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  padding: 2rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const FindingsPanel = () => {
  return (
    <PanelContainer>
      <Title>Findings</Title>
      <p>This is where the key findings of the study will be presented.</p>
      {/* You can add more detailed findings components here */}
    </PanelContainer>
  );
};

export { FindingsPanel };
