
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaPenSquare, FaTimes } from "react-icons/fa";
import api from '../services/api';

// --- Styled Components (no changes) ---
const ConversationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 350px;
  border-right: 1px solid ${props => props.theme.palette.divider};
  background-color: ${props => props.theme.palette.background.paper};
  color: ${props => props.theme.palette.text.primary};
`;

const ConversationListHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.palette.divider};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const NewMessageButton = styled(FaPenSquare)`
  cursor: pointer;
  font-size: 1.5rem;
  &:hover {
    color: ${props => props.theme.palette.primary.main};
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
  background-color: ${props => props.active ? props.theme.palette.action.selected : 'transparent'};

  &:hover {
    background-color: ${props => props.theme.palette.action.hover};
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
  color: ${props => props.theme.palette.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.palette.text.secondary};
`;

const UnreadBadge = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.theme.palette.primary.main};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

// --- Modal Components ---
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
  background-color: ${props => props.theme.palette.background.paper};
  padding: 2rem;
  border-radius: 8px;
  width: 450px;
  max-width: 90%;
  color: ${props => props.theme.palette.text.primary};
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
  border: 1px solid ${props => props.theme.palette.divider};
  background-color: ${props => props.theme.palette.background.default};
  color: ${props => props.theme.palette.text.primary};
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
    background-color: ${props => props.theme.palette.action.hover};
  }
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.palette.divider};
  background-color: ${props => props.theme.palette.background.default};
  color: ${props => props.theme.palette.text.primary};
  margin-bottom: 1rem;
  min-height: 120px;
  resize: vertical;
`;

const SendButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: none;
  background-color: ${props => props.theme.palette.primary.main};
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background-color: ${props => props.theme.palette.primary.dark};
  }
`;

// --- New Message Modal Component (Corrected) ---
const NewMessageModal = ({ isOpen, onClose, onCreateConversation, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
        setLoading(true);
        try {
            const { data } = await api.get(`/users/search?q=${term}`);
            setSearchResults(data.filter(u => u.id !== currentUserId));
        } catch (error) {
            console.error("Failed to search for users", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    } else {
      setSearchResults([]);
    }
  }, [currentUserId]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.username); // Show the selected user's name
    setSearchResults([]);
  };
  
  const handleCreate = () => {
    if(selectedUser && message) {
        onCreateConversation(selectedUser.id, message);
        // Reset state and close modal
        setSelectedUser(null);
        setSearchTerm('');
        setMessage('');
        onClose();
    }
  }

  useEffect(() => {
    // Reset state when modal is opened/closed
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
      setSelectedUser(null);
      setMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
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
        {loading && <p>Loading...</p>}
        {searchResults.length > 0 && (
            <UserList>
            {searchResults.map(user => (
                <UserListItem key={user.id} onClick={() => handleSelectUser(user)}>
                <Avatar src={user.avatar || 'https://i.pravatar.cc/150'} alt={user.username} />
                <span>{user.username}</span>
                </UserListItem>
            ))}
            </UserList>
        )}
        
        {selectedUser && (
            <>
            <MessageTextarea
                placeholder={`Your message to ${selectedUser.username}...`}
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
const ConversationList = ({ conversations, selectedConversation, onConversationSelect, onCreateConversation, currentUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoize the create conversation handler
  const handleCreateConversation = useCallback((recipientId, initialMessage) => {
      onCreateConversation(recipientId, initialMessage);
      setIsModalOpen(false); // Close the modal on creation
  }, [onCreateConversation]);

  const getRecipient = (participants) => {
      return participants.find(p => p.id !== currentUserId);
  };

  return (
    <ConversationListContainer>
      <ConversationListHeader>
        <h3>Messages</h3>
        <NewMessageButton onClick={() => setIsModalOpen(true)} />
      </ConversationListHeader>
      <List>
        {conversations.map(convo => {
            const recipient = getRecipient(convo.users);
            if (!recipient) return null; // Or some placeholder for group chats etc.

            return (
                <ConversationItem 
                    key={convo.id} 
                    active={selectedConversation?.id === convo.id} 
                    onClick={() => onConversationSelect(convo)}
                >
                <Avatar src={recipient.avatar || 'https://i.pravatar.cc/150'} alt={recipient.username} />
                <ConversationInfo>
                    <ConversationName>{recipient.username}</ConversationName>
                    <LastMessage>{convo.lastMessage?.text || 'No messages yet'}</LastMessage>
                </ConversationInfo>
                {convo.lastMessage && <Timestamp>{new Date(convo.lastMessage.createdAt).toLocaleTimeString()}</Timestamp>}
                {/* Unread badge logic needs to be implemented on the backend */}
                </ConversationItem>
            )
        })}
      </List>
      <NewMessageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreateConversation={handleCreateConversation}
        currentUserId={currentUserId}
      />
    </ConversationListContainer>
  );
};

export default ConversationList;
