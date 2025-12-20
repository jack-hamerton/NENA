import React from 'react';
import styled from 'styled-components';

const CallButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  background: none;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.5rem;

  &:hover {
    background: #f5f5f5;
  }
`;

const CallButton = ({ onStartCall }) => {
  return (
    <CallButtonContainer>
      <Button onClick={() => onStartCall('voice')}>📞</Button>
      <Button onClick={() => onStartCall('video')}>📹</Button>
    </CallButtonContainer>
  );
};

export default CallButton;
