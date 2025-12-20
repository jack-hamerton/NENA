import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Title = styled.h4`
    margin-bottom: 1rem;
`;

const InsightItem = styled.li`
    margin-bottom: 0.5rem;
`;

const InsightList = ({ insights }) => {
  return (
    <ListContainer>
      <Title>Key Insights</Title>
      <ul>
        {insights.map((insight, index) => (
          <InsightItem key={index}>{insight}</InsightItem>
        ))}
      </ul>
    </ListContainer>
  );
};

export { InsightList };
