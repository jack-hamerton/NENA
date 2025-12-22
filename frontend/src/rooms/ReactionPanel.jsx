import React from 'react';
import styled from 'styled-components';

const ReactionPanelContainer = styled.div`
  position: absolute;
  bottom: 50px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.theme.palette.secondary};
  border-radius: 5px;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '👏'];

export const ReactionPanel = ({ onSelect }) => {
  return (
    <ReactionPanelContainer>
      {EMOJIS.map(emoji => (
        <EmojiButton key={emoji} onClick={() => onSelect(emoji)}>
          {emoji}
        </EmojiButton>
      ))}
    </ReactionPanelContainer>
  );
};
