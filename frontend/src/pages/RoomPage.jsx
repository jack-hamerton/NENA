
import React, { useState, useEffect, useReducer, useCallback, useContext } from 'react';
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
import { roomService } from '../services/roomService';
import { AuthContext } from '../contexts/AuthContext';
import { realtimeService } from '../services/realtimeService';

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
                        Object.keys(newOptions).forEach(opt => {
                            newOptions[opt] = newOptions[opt].filter(uid => uid !== action.payload.userId);
                        });
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
    const { user } = useContext(AuthContext);
    
    const [state, dispatch] = useReducer(roomReducer, { participants: [], chatHistory: [], polls: [], reactions: [], documentContent: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarTab, setSidebarTab] = useState('chat');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!roomId || !user) return;

        const joinRoom = async () => {
            try {
                setLoading(true);
                const details = await roomService.getRoom(roomId);
                dispatch({ type: 'SET_INITIAL_STATE', payload: details });
                roomService.joinRoom(roomId, user.id);
            } catch (err) {
                setError(err.message);
                navigate('/rooms');
            } finally {
                setLoading(false);
            }
        };

        joinRoom();

        const onUserJoined = (data) => dispatch({ type: 'USER_JOINED', payload: data.user });
        const onUserLeft = (data) => dispatch({ type: 'USER_LEFT', payload: { userId: data.userId } });
        const onNewMessage = (data) => dispatch({ type: 'NEW_MESSAGE', payload: data.message });
        const onNewPoll = (data) => dispatch({ type: 'ADD_POLL', payload: data.poll });
        const onPollVoted = (data) => dispatch({ type: 'POLL_VOTED', payload: data.vote });
        const onNewReaction = (data) => dispatch({ type: 'NEW_REACTION', payload: data.reaction });

        realtimeService.on('user-joined', onUserJoined);
        realtimeService.on('user-left', onUserLeft);
        realtimeService.on('new-message', onNewMessage);
        realtimeService.on('new-poll', onNewPoll);
        realtimeService.on('poll-voted', onPollVoted);
        realtimeService.on('new-reaction', onNewReaction);

        return () => {
            roomService.leaveRoom(roomId, user.id);
            realtimeService.off('user-joined', onUserJoined);
            realtimeService.off('user-left', onUserLeft);
            realtimeService.off('new-message', onNewMessage);
            realtimeService.off('new-poll', onNewPoll);
            realtimeService.off('poll-voted', onPollVoted);
            realtimeService.off('new-reaction', onNewReaction);
        };
    }, [roomId, user, navigate]);

    const handleSendMessage = useCallback((text) => {
        realtimeService.send({ type: 'send-message', text });
    }, []);

    const handleCreatePoll = useCallback((question) => {
        realtimeService.send({ type: 'create-poll', question });
    }, []);

    const handleVote = useCallback((pollId, option) => {
        realtimeService.send({ type: 'cast-vote', pollId, option });
    }, []);
    
    const handleSendReaction = (emoji) => {
        realtimeService.send({ type: 'send-reaction', emoji });
    };
    
    const leaveRoom = () => {
        navigate('/rooms');
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>Error: {error}</Typography>;

    const currentUser = state.participants.find(p => p.id === user.id) || { id: user.id, isHost: false };

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
                        {sidebarTab === 'chat' && <Chat messages={state.chatHistory} onSendMessage={handleSendMessage} users={Object.fromEntries(state.participants.map(p => [p.id, p]))} />}
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
