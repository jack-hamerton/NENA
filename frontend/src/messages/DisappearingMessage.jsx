import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DisappearingWrapper = styled.div`
  position: relative;
  padding: 0.8rem;
`;

const Timer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 0.7rem;
  color: #888;
`;

const DisappearingMessage = ({ message, children }) => {
  const [timeLeft, setTimeLeft] = useState(message.disappearingTimer);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Here you would typically call a function to delete the message
          // from your data store. For now, we'll just return 0.
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (timeLeft === 0) {
    return null; // Or some indication that the message has disappeared
  }

  return (
    <DisappearingWrapper>
      {children}
      <Timer>{timeLeft}s</Timer>
    </DisappearingWrapper>
  );
};

export default DisappearingMessage;
