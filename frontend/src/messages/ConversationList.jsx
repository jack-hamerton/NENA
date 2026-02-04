
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPenSquare, FaTimes } from "react-icons/fa";

// --- Styled Components ---
const ConversationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid ${props => props.theme.borderColor || '#333'};
  background-color: ${props => props.theme.surface || '#4a5969'};
  color: ${props => props.theme.text.primary || '#ffffff'};
`;

const ConversationListHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.borderColor || '#333'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const NewMessageButton = styled(FaPenSquare)`
  cursor: pointer;
  font-size: 1.5rem;
  &:hover {
    color: ${props => props.theme.accent || '#73beb0'};
  }
`;

const List = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`;

const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  background-color: ${props => props.active ? (props.theme.accentHover || '#427973') : 'transparent'};

  &:hover {
    background-color: ${props => props.theme.accentHover || '#427973'};
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const ConversationInfo = styled.div`
  flex-grow: 1;
  overflow: hidden;
`;

const ConversationName = styled.h4`
  margin: 0;
  white-space: nowrap;
`;

const LastMessage = styled.p`
  margin: 0;
  color: ${props => props.theme.text.secondary || '#a0a0a0'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.text.secondary || '#a0a0a0'};
`;

const UnreadBadge = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.theme.accent || '#73beb0'};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

// --- Modal Components (Integrated) ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.surface || '#4a5969'};
  padding: 2rem;
  border-radius: 8px;
  width: 450px;
  max-width: 90%;
  color: ${props => props.theme.text.primary || '#ffffff'};
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CloseButton = styled(FaTimes)`
  cursor: pointer;
  font-size: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor || '#333'};
  background-color: ${props => props.theme.background || '#35424c'};
  color: ${props => props.theme.text.primary || '#ffffff'};
  margin-bottom: 1rem;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
`;

const UserListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: ${props => props.theme.accentHover || '#427973'};
  }
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor || '#333'};
  background-color: ${props => props.theme.background || '#35424c'};
  color: ${props => props.theme.text.primary || '#ffffff'};
  margin-bottom: 1rem;
  min-height: 120px;
  resize: vertical;
`;

const SendButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: none;
  background-color: ${props => props.theme.accent || '#73beb0'};
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background-color: ${props => props.theme.accentHover || '#427973'};
  }
`;

// --- New Message Modal Component ---
const NewMessageModal = ({ isOpen, onClose, onCreateConversation, currentUserId, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  // In a real app, you'd fetch this user list from your API.
  useEffect(() => {
    const mockUsers = [
        { id: '2', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
        { id: '3', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=jane' },
        { id: '4', name: 'Peter Jones', avatar: 'https://i.pravatar.cc/150?u=peter' },
    ];
    setUsers(mockUsers.filter(u => u.id !== currentUserId));
  }, [currentUserId]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      setSearchResults(users.filter(user => user.name.toLowerCase().includes(term.toLowerCase())));
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.name);
    setSearchResults([]);
  };
  
  const handleCreate = () => {
    if(selectedUser && message) {
        onCreateConversation(selectedUser, message);
        // Reset state and close modal
        setSelectedUser(null);
        setSearchTerm('');
        setMessage('');
        onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent theme={theme}>
        <ModalHeader>
          <h3>New Message</h3>
          <CloseButton onClick={onClose} />
        </ModalHeader>
        
        <SearchInput
          type="text"
          placeholder="Search for a user..."
          value={searchTerm}
          onChange={handleSearch}
          disabled={!!selectedUser}
        />
        {searchResults.length > 0 && (
            <UserList>
            {searchResults.map(user => (
                <UserListItem key={user.id} onClick={() => handleSelectUser(user)}>
                <Avatar src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
                </UserListItem>
            ))}
            </UserList>
        )}
        
        {selectedUser && (
            <>
            <MessageTextarea
                placeholder={`Your message to ${selectedUser.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <SendButton onClick={handleCreate}>Send Message</SendButton>
            </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};


// --- Main ConversationList Component ---
const ConversationList = ({ conversations, selectedConversation, onSelectConversation, onCreateConversation, currentUserId, theme }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ConversationListContainer>
      <ConversationListHeader>
        <h3>Messages</h3>
        <NewMessageButton onClick={() => setIsModalOpen(true)} />
      </ConversationListHeader>
      <List>
        {conversations.map(convo => {
            const recipient = convo.participants.find(p => p.id !== currentUserId) || {};
            return (
                <ConversationItem 
                    key={convo.id} 
                    active={selectedConversation && selectedConversation.id === convo.id} 
                    onClick={() => onSelectConversation(convo)}
                >
                <Avatar src={recipient.avatar} alt={recipient.name} />
                <ConversationInfo>
                    <ConversationName>{recipient.name}</ConversationName>
                    <LastMessage>{convo.lastMessage}</LastMessage>
                </ConversationInfo>
                <Timestamp>{convo.timestamp}</Timestamp>
                {convo.unread > 0 && <UnreadBadge>{convo.unread}</UnreadBadge>}
                </ConversationItem>
            )
        })}
      </List>
      <NewMessageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreateConversation={onCreateConversation}
        currentUserId={currentUserId}
        theme={theme}
      />
    </ConversationListContainer>
  );
};

export default ConversationList;
