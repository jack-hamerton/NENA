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

const MethodologyPanel = () => {
  return (
    <PanelContainer>
      <Title>Methodology</Title>
      <p>This is where the methodology of the study will be detailed.</p>
      {/* You can add more detailed methodology components here */}
    </PanelContainer>
  );
};

export { MethodologyPanel };
