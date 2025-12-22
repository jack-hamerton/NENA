
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  align-self: ${props => props.isMe ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isMe ? props.theme.palette.secondary : props.theme.palette.primary };
  color: ${props => props.theme.text.primary};
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  max-width: 60%;
`;

const Message = ({ message, e2eeManager, sessionId }) => {
  const [displayText, setDisplayText] = useState('');
  const isMe = message.sender === 'me';

  useEffect(() => {
    const processMessage = async () => {
      // For my own messages, the raw text is already available for a seamless UX.
      if (isMe) {
        setDisplayText(message.text);
        return;
      }

      // For incoming messages, decryption is required.
      setDisplayText('Decrypting...');

      if (!e2eeManager) {
        setDisplayText('[E2EE not available]');
        return;
      }
      
      try {
        // Decrypt the entire message payload.
        const decryptedText = await e2eeManager.decryptMessage(sessionId, message.iv, message.ciphertext);
        const payload = JSON.parse(decryptedText);

        // Only display messages that are of type 'chat'. 
        // Signaling messages are handled by the ChatWindow.
        if (payload.type === 'chat') {
          setDisplayText(payload.content);
        } else {
          // This component does not display system messages.
          setDisplayText(null);
        }
      } catch (error) {
        console.error("DECRYPTION FAILED:", error);
        e2eeManager.fallbackToServer(message);
        setDisplayText('[This message could not be decrypted. It has been stored for audit.]');
      }
    };

    // Do not process messages that are not meant to be displayed
    if (message.type === 'system') {
        setDisplayText(null);
        return;
    }

    processMessage();
  }, [message, e2eeManager, sessionId, isMe]);

  // Render nothing if there is no text to display (e.g., for a system message)
  if (displayText === null) {
    return null;
  }

  return (
    <MessageContainer isMe={isMe}>
      <strong>{isMe ? 'You' : message.sender}: </strong>
      {displayText}
    </MessageContainer>
  );
};

export default Message;
