
import React from 'react';
import styled from 'styled-components';

const MetricsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #222;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const Metric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: #aaa;
`;

const Topics = styled.div`
    margin-top: 1rem;
    text-align: center;
`;

const TopicTag = styled.span`
    background-color: #444;
    color: #fff;
    padding: 0.3rem 0.6rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    margin: 0 0.3rem;
`;

const ProfileMetrics = ({ metrics }) => {
  return (
    <MetricsContainer>
      <Metric>
        <MetricValue>{metrics.supporters}</MetricValue>
        <MetricLabel>Supporters</MetricLabel>
      </Metric>
      <Metric>
        <MetricValue>{metrics.amplifiers}</MetricValue>
        <MetricLabel>Amplifiers</MetricLabel>
      </Metric>
      <Metric>
        <MetricValue>{metrics.learners}</MetricValue>
        <MetricLabel>Learners</MetricLabel>
      </Metric>
      <Topics>
        <MetricLabel>Topics Engaged</MetricLabel>
        <div>
            {metrics.topics.map(topic => <TopicTag key={topic}>{topic}</TopicTag>)}
        </div>
      </Topics>
    </MetricsContainer>
  );
};

export default ProfileMetrics;
