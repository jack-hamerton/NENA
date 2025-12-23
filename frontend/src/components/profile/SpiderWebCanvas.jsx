
import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const SpiderWebCanvas = ({ currentUser, follows, followersOfFollowers, followerIntentMetrics }) => {
  const onElementClick = (event, element) => {
    if (element.id === 'user') {
      alert(
        `Username: ${currentUser.username}\n` +
        `Followers by Intent:\n` +
        `  Supporters: ${followerIntentMetrics.supporters}\n` +
        `  Amplifiers: ${followerIntentMetrics.amplifiers}\n` +
        `  Learners: ${followerIntentMetrics.learners}`
      );
    } else {
      alert(`Username: ${element.data.label}`);
    }
  };

  const elements = useMemo(() => {
    const initialElements = [
      {
        id: 'user',
        data: { label: currentUser.username },
        position: { x: 250, y: 250 },
        style: { backgroundColor: '#8bc34a', color: 'white' },
      },
    ];

    if (follows) {
      follows.forEach((follow, index) => {
        initialElements.push({
          id: `follow-${index}`,
          data: { label: follow.username },
          position: { x: 250 + (index % 2 === 0 ? -1 : 1) * (100 + (index * 20)), y: 250 + (index % 3 === 0 ? -1 : 1) * (100 + (index * 20)) },
        });
        initialElements.push({
          id: `edge-${index}`,
          source: 'user',
          target: `follow-${index}`,
          label: follow.intent,
        });
      });
    }

    if (followersOfFollowers) {
      followersOfFollowers.forEach((followers, index) => {
        followers.forEach((follower, subIndex) => {
          initialElements.push({
            id: `follow-${index}-${subIndex}`,
            data: { label: follower.username },
            position: { x: 250 + (index % 2 === 0 ? -1 : 1) * (200 + (subIndex * 20)), y: 250 + (index % 3 === 0 ? -1 : 1) * (200 + (subIndex * 20)) },
          });
          initialElements.push({
            id: `edge-${index}-${subIndex}`,
            source: `follow-${index}`,
            target: `follow-${index}-${subIndex}`,
            label: follower.intent,
          });
        });
      });
    }

    return initialElements;
  }, [currentUser, follows, followersOfFollowers]);

  return (
    <CanvasContainer>
      <ReactFlow elements={elements} onElementClick={onElementClick}>
        <Background />
        <Controls />
      </ReactFlow>
    </CanvasContainer>
  );
};

export default SpiderWebCanvas;
