
import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CircularProgress, Box, Typography } from '@mui/material';
import { RoomVideoGrid } from '../rooms/RoomVideoGrid';
import { Chat } from '../rooms/Chat';
import { Polls } from '../rooms/Polls';
import { Reactions } from '../rooms/Reactions';
import { ControlsBar } from '../rooms/ControlsBar';
import { Document } from '../components/collaboration/Document';
import { theme } from '../theme/theme';
import { 
    RoomContainer, MainContent, VideoContainer, Sidebar, 
    TabContainer, TabButton, SidebarContent, ToggleSidebarButton 
} from './RoomPage.styled';

// --- MOCK API & WebSocket Simulation ---
const mockUsers = {
    1: { id: 1, name: 'You', isHost: true, avatar: 'https://i.pravatar.cc/150?u=you' },
    2: { id: 2, name: 'Sarah', isHost: false, avatar: 'https://i.pravatar.cc/150?u=sarah' },
    3: { id: 3, name: 'David', isHost: false, avatar: 'https://i.pravatar.cc/150?u=david' },
    4: { id: 4, name: 'Chen', isHost: false, avatar: 'https://i.pravatar.cc/150?u=chen' },
};

const roomApi = {
    getRoomDetails: async (roomId) => {
        console.log(`Fetching details for room: ${roomId}`);
        await new Promise(res => setTimeout(res, 1000));
        if (roomId === 'kibera-safe-passage-123') {
            return {
                name: "Kibera Safe Passage - Weekly Sync",
                participants: [mockUsers[1], mockUsers[2], mockUsers[3]],
                chatHistory: [{ id: 1, userId: 2, text: "Hey everyone, glad you could make it!" }],
                polls: [{ id: 'poll1', question: "Confirm attendance for next week?", options: { Yes: [2], No: [3] }, createdBy: 2 }],
                documentContent: "## Agenda\n1. Review petition signatures\n2. Plan for town hall meeting"
            };
        }
        throw new Error("Room not found.");
    },
    sendMessage: async (roomId, text) => {
        await new Promise(res => setTimeout(res, 200));
        return { id: Date.now(), userId: 1, text }; // Return the sent message
    },
    createPoll: async (roomId, question) => {
        await new Promise(res => setTimeout(res, 200));
        return { id: `poll-${Date.now()}`, question, options: {}, createdBy: 1 };
    },
    castVote: async (roomId, pollId, option) => {
        await new Promise(res => setTimeout(res, 200));
        return { pollId, option, userId: 1 };
    }
};

const createMockRoomSocket = (roomId, dispatch) => {
    const events = [
        () => dispatch({ type: 'USER_JOINED', payload: mockUsers[4] }),
        () => dispatch({ type: 'NEW_MESSAGE', payload: { id: Date.now(), userId: 3, text: "I have an update on the petition drive." } }),
        () => dispatch({ type: 'NEW_REACTION', payload: { id: Date.now(), emoji: '👍' } }),
        () => dispatch({ type: 'USER_LEFT', payload: { userId: 2 } }),
        () => dispatch({ type: 'POLL_VOTED', payload: { pollId: 'poll1', option: 'Yes', userId: 4 } }),
    ];
    let eventIndex = 0;
    const interval = setInterval(() => {
        if (eventIndex < events.length) {
            events[eventIndex]();
            eventIndex++;
        }
    }, 8000);

    return { close: () => clearInterval(interval) };
};

// Reducer to manage the complex state of the room
function roomReducer(state, action) {
    switch (action.type) {
        case 'SET_INITIAL_STATE': return { ...state, ...action.payload };
        case 'USER_JOINED': return { ...state, participants: [...state.participants, action.payload] };
        case 'USER_LEFT': return { ...state, participants: state.participants.filter(p => p.id !== action.payload.userId) };
        case 'NEW_MESSAGE': return { ...state, chatHistory: [...state.chatHistory, action.payload] };
        case 'NEW_REACTION': return { ...state, reactions: [...state.reactions, action.payload] };
        case 'ADD_POLL': return { ...state, polls: [...state.polls, action.payload] };
        case 'POLL_VOTED':
            return {
                ...state,
                polls: state.polls.map(poll => {
                    if (poll.id === action.payload.pollId) {
                        const newOptions = { ...poll.options };
                        // Remove previous vote if any
                        Object.keys(newOptions).forEach(opt => {
                            newOptions[opt] = newOptions[opt].filter(uid => uid !== action.payload.userId);
                        });
                        // Add new vote
                        if (!newOptions[action.payload.option]) newOptions[action.payload.option] = [];
                        newOptions[action.payload.option].push(action.payload.userId);
                        return { ...poll, options: newOptions };
                    }
                    return poll;
                })
            };
        default: return state;
    }
}

const RoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    
    const [state, dispatch] = useReducer(roomReducer, { participants: [], chatHistory: [], polls: [], reactions: [], documentContent: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarTab, setSidebarTab] = useState('chat');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!roomId) {
            setError("No Room ID provided.");
            setLoading(false);
            return;
        }

        const joinRoom = async () => {
            try {
                setLoading(true);
                const details = await roomApi.getRoomDetails(roomId);
                dispatch({ type: 'SET_INITIAL_STATE', payload: details });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        joinRoom();

        const socket = createMockRoomSocket(roomId, dispatch);
        return () => socket.close();
    }, [roomId]);

    const handleSendMessage = useCallback(async (text) => {
        const message = await roomApi.sendMessage(roomId, text);
        dispatch({ type: 'NEW_MESSAGE', payload: message });
    }, [roomId]);

    const handleCreatePoll = useCallback(async (question) => {
        const poll = await roomApi.createPoll(roomId, question);
        dispatch({ type: 'ADD_POLL', payload: poll });
    }, [roomId]);

    const handleVote = useCallback(async (pollId, option) => {
        const vote = await roomApi.castVote(roomId, pollId, option);
        dispatch({ type: 'POLL_VOTED', payload: vote });
    }, [roomId]);
    
    const handleSendReaction = (emoji) => dispatch({ type: 'NEW_REACTION', payload: { id: Date.now(), emoji } });
    const leaveRoom = () => navigate('/home');

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>Error: {error}</Typography>;

    const currentUser = state.participants.find(p => p.id === 1) || { id: 1, isHost: false };

    return (
        <ThemeProvider theme={theme}>
            <RoomContainer>
                <MainContent>
                    <VideoContainer>
                        <RoomVideoGrid participants={state.participants} />
                        <Reactions reactions={state.reactions} />
                    </VideoContainer>
                    <ControlsBar onSendReaction={handleSendReaction} onLeave={leaveRoom} />
                </MainContent>
                <Sidebar className={isSidebarOpen ? 'open' : ''}>
                    <TabContainer>
                        <TabButton active={sidebarTab === 'chat'} onClick={() => setSidebarTab('chat')}>Chat</TabButton>
                        <TabButton active={sidebarTab === 'polls'} onClick={() => setSidebarTab('polls')}>Polls</TabButton>
                        <TabButton active={sidebarTab === 'collaborate'} onClick={() => setSidebarTab('collaborate')}>Collaborate</TabButton>
                    </TabContainer>
                    <SidebarContent>
                        {sidebarTab === 'chat' && <Chat messages={state.chatHistory} onSendMessage={handleSendMessage} users={mockUsers} />}
                        {sidebarTab === 'polls' && <Polls polls={state.polls} onVote={handleVote} onCreatePoll={handleCreatePoll} currentUserId={currentUser.id} isHost={currentUser.isHost} />}
                        {sidebarTab === 'collaborate' && <Document document={{ id: `doc-${roomId}`, content: state.documentContent }} />}
                    </SidebarContent>
                </Sidebar>
                <ToggleSidebarButton onClick={() => setSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? 'Close' : 'Open'}</ToggleSidebarButton>
            </RoomContainer>
        </ThemeProvider>
    );
};

export default RoomPage;
