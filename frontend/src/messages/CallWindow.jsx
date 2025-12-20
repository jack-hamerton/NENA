import React from 'react';
import styled from 'styled-components';

const CallWindowContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 400px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  z-index: 100;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CallHeader = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
`;

const CallBody = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CallFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;

  button {
    background: #f44336;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

const CallWindow = ({ call, onEndCall }) => {
  return (
    <CallWindowContainer>
      <CallHeader>{call.type === 'voice' ? 'Voice Call' : 'Video Call'}</CallHeader>
      <CallBody>
        <p>Calling...</p>
      </CallBody>
      <CallFooter>
        <button onClick={onEndCall}>×</button>
      </CallFooter>
    </CallWindowContainer>
  );
};

export default CallWindow;
