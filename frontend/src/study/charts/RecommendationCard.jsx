import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const CardTitle = styled.h4`
    margin-bottom: 1rem;
`;

const RecommendationCard = ({ recommendation }) => {
  return (
    <CardContainer>
      <CardTitle>{recommendation.title}</CardTitle>
      <p>{recommendation.description}</p>
    </CardContainer>
  );
};

export { RecommendationCard };
