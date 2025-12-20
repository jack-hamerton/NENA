import React, { useState } from 'react';
import styled from 'styled-components';
import ViewOnceMessage from './ViewOnceMessage';
import DisappearingMessage from './DisappearingMessage';

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  justify-content: ${props => props.isSender ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  background-color: ${props => props.isSender ? '#dcf8c6' : '#fff'};
  padding: ${props => props.isMedia ? '0' : '0'};
  border-radius: 10px;
  max-width: 60%;
  position: relative;
  overflow: visible; // Changed to allow options menu to show

  &:hover .options-button {
    opacity: 1;
  }
`;

const MessageText = styled.p`
  margin: 0;
  padding: 0.8rem;
`;

const Media = styled.img`
    max-width: 100%;
    height: auto;
`;

const Timestamp = styled.span`
  font-size: 0.7rem;
  color: #888;
  display: block;
  text-align: right;
  margin-top: 0.5rem;
  padding: 0 0.5rem 0.5rem;
`;

const ReadReceipt = styled.span`
    font-size: 0.7rem;
    color: ${props => props.read ? '#4fc3f7' : '#888'};
    margin-left: 0.3rem;
`;

const Reactions = styled.div`
    position: absolute;
    bottom: 5px;
    right: 10px;
    background-color: #fff;
    border-radius: 10px;
    padding: 2px 5px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const OptionsButton = styled.button`
    opacity: 0;
    position: absolute;
    top: -10px;
    right: ${props => props.isSender ? 'auto' : '-35px'};
    left: ${props => props.isSender ? '-35px' : 'auto'};
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-weight: bold;
    transition: opacity 0.2s;
`;

const OptionsMenu = styled.div`
    position: absolute;
    top: 25px;
    right: ${props => props.isSender ? 'auto' : '-85px'};
    left: ${props => props.isSender ? '-85px' : 'auto'};
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 10;
    width: 80px;

    button {
        display: block;
        width: 100%;
        padding: 0.5rem;
        border: none;
        background: none;
        cursor: pointer;
        text-align: left;

        &:hover {
            background: #f5f5f5;
        }
    }
`;

const EditInput = styled.input`
    width: calc(100% - 2rem);
    padding: 0.8rem;
    margin: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
`;

const Message = ({ message, onUpdate, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);

  const isSender = message.sender === 'me';
  const isMedia = message.type === 'image';
  const isViewOnce = message.viewOnce;
  const isDisappearing = message.disappearingTimer > 0;

  const handleSave = () => {
      onUpdate(message.id, editedText);
      setIsEditing(false);
      setShowOptions(false);
  }

  const renderContent = () => {
      if (isEditing) {
          return (
            <div>
                <EditInput value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )
      }
      if (isViewOnce) {
          return <ViewOnceMessage mediaUrl={message.mediaUrl} />
      }
      if (isMedia) {
          return <Media src={message.mediaUrl} />
      }
      return <MessageText>{message.text}</MessageText>
  }

  const content = (
    <MessageBubble isSender={isSender} isMedia={isMedia || isViewOnce || isEditing}>
        {renderContent()}
        {!isEditing && (
            <Timestamp>
                {message.timestamp}
                {isSender && <ReadReceipt read={message.read}>✓✓</ReadReceipt>}
            </Timestamp>
        )}
        {message.reactions && !isEditing && <Reactions>{message.reactions.join(' ')}</Reactions>}
        {isSender && !isMedia && !isViewOnce && <OptionsButton className="options-button" isSender={isSender} onClick={() => setShowOptions(!showOptions)}>...</OptionsButton>}
        {showOptions && (
            <OptionsMenu isSender={isSender}>
                <button onClick={() => { setIsEditing(true); }}>Edit</button>
                <button onClick={() => onDelete(message.id)}>Delete</button>
            </OptionsMenu>
        )}
    </MessageBubble>
  )

  return (
    <MessageContainer isSender={isSender}>
        {isDisappearing ? <DisappearingMessage message={message}>{content}</DisappearingMessage> : content}
    </MessageContainer>
  );
};

export default Message;
