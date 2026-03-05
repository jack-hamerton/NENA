
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CircularProgress, Box, Typography, Paper } from '@mui/material';
import { RoomVideoGrid } from '../rooms/RoomVideoGrid';
import { Chat } from '../rooms/Chat';
import { Polls } from '../rooms/Polls';
import { ControlsBar } from '../rooms/ControlsBar';
import { theme } from '../theme/theme';
import { 
    RoomContainer, MainContent, VideoContainer, Sidebar, 
    TabContainer, TabButton, SidebarContent, ToggleSidebarButton 
} from './RoomPage.styled';
import { meetingService } from '../services/meetingService';
import { useAuth } from '../hooks/useAuth';
import { realtimeService } from '../services/realtimeService';

const RoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [meeting, setMeeting] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarTab, setSidebarTab] = useState('chat');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!roomId || !user) return;

        const joinMeeting = async () => {
            try {
                setLoading(true);
                const meetingDetails = await meetingService.getMeeting(roomId);
                setMeeting(meetingDetails);

                // Here, you would initialize your WebRTC connection and get the list of participants
                // For now, we'll mock the participants
                const mockParticipants = meetingDetails.participants.map(pId => ({ id: pId, name: `User-${pId.substring(0,4)}`, stream: null }));
                setParticipants(mockParticipants);
                
                await meetingService.joinMeeting(roomId, user.id);

            } catch (err) {
                setError(err.message);
                setTimeout(() => navigate('/rooms'), 3000);
            } finally {
                setLoading(false);
            }
        };

        joinMeeting();

        const onUserJoined = (data) => {
            console.log('A user joined:', data);
            // Add new participant to the list
            setParticipants(prev => [...prev, { id: data.userId, name: `User-${data.userId.substring(0,4)}`, stream: null }]);
        };
        
        const onUserLeft = (data) => {
            console.log('A user left:', data);
            setParticipants(prev => prev.filter(p => p.id !== data.userId));
        };

        // You would also listen for other real-time events like chat messages, polls, etc.

        realtimeService.on('user-joined', onUserJoined);
        realtimeService.on('user-left', onUserLeft);

        return () => {
            realtimeService.off('user-joined', onUserJoined);
            realtimeService.off('user-left', onUserLeft);
            // You would also leave the WebRTC session here
        };
    }, [roomId, user, navigate]);

    const leaveRoom = () => {
        navigate('/rooms');
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>Error: {error}. Redirecting...</Typography>;

    return (
        <ThemeProvider theme={theme}>
            <RoomContainer>
                <MainContent>
                    {meeting && <Typography variant="h5" sx={{ p: 2 }}>{meeting.title}</Typography>}
                    <VideoContainer>
                        <RoomVideoGrid participants={participants} />
                        {/* Reactions would be here */}
                    </VideoContainer>
                    <ControlsBar onLeave={leaveRoom} onSendReaction={() => {}} localStream={null} />
                </MainContent>
                <Sidebar className={isSidebarOpen ? 'open' : ''}>
                    <TabContainer>
                        <TabButton active={sidebarTab === 'chat'} onClick={() => setSidebarTab('chat')}>Chat</TabButton>
                        <TabButton active={sidebarTab === 'polls'} onClick={() => setSidebarTab('polls')}>Polls</TabButton>
                        <TabButton active={sidebarTab === 'agenda'} onClick={() => setSidebarTab('agenda')}>Agenda</TabButton>
                    </TabContainer>
                    <SidebarContent>
                        {sidebarTab === 'chat' && <Chat roomId={roomId} />}
                        {sidebarTab === 'polls' && <Polls polls={[]} onVote={() => {}} onCreatePoll={() => {}} />}
                        {sidebarTab === 'agenda' && meeting && (
                            <Paper sx={{p: 2}}>
                                <Typography variant="h6">Agenda</Typography>
                                {meeting.agenda.length > 0 ? (
                                    <ul>
                                        {meeting.agenda.map((item, index) => <li key={index}>{item}</li>)}
                                    </ul>
                                ) : (
                                    <p>No agenda for this meeting.</p>
                                )}
                            </Paper>
                        )}
                    </SidebarContent>
                </Sidebar>
                <ToggleSidebarButton onClick={() => setSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? 'Close' : 'Open'}</ToggleSidebarButton>
            </RoomContainer>
        </ThemeProvider>
    );
};

export default RoomPage;
