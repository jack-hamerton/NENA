import React from 'react';
import styled from 'styled-components';

const StripContainer = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const StatContainer = styled.div`
  text-align: center;
`;

const StatTitle = styled.h4`
    margin: 0;
    color: #666;
`;

const StatValue = styled.p`
    margin: 0;
    font-size: 24px;
    font-weight: bold;
`;

const KPIStatStrip = ({ stats }) => {
  return (
    <StripContainer>
      {stats.map((stat, index) => (
        <StatContainer key={index}>
          <StatTitle>{stat.title}</StatTitle>
          <StatValue>{stat.value}</StatValue>
        </StatContainer>
      ))}
    </StripContainer>
  );
};

export { KPIStatStrip };
