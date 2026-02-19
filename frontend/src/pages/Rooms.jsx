
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Button, TextField, Paper } from '@mui/material';
import { meetingService } from '../services/meetingService';
import { useAuth } from '../hooks/useAuth';
import ScheduleMeetingModal from '../rooms/ScheduleMeetingModal';
import { notificationService } from '../services/notificationService';

const Rooms = () => {
  const [meetings, setMeetings] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      if (user) {
        const userMeetings = await meetingService.getUserMeetings(user.id);
        setMeetings(userMeetings);
      }
    };
    fetchMeetings();
  }, [user]);

  const handleCreateMeeting = async (meetingDetails) => {
    try {
      const { meetingCode, meeting } = await meetingService.createMeeting({ ...meetingDetails, createdBy: user.id });
      notificationService.addNotification({
        message: `Meeting created! Share this code: ${meetingCode}`,
        type: 'success',
      });
      setMeetings(prevMeetings => [...prevMeetings, meeting]);
      navigate(`/room/${meetingCode}`);
    } catch (error) {
        console.error("Failed to create meeting:", error);
        notificationService.addNotification({ message: 'Failed to create meeting.', type: 'error' });
    }
    setModalOpen(false);
  };

  const handleJoinWithCode = () => {
    if (joinCode.trim()) {
      meetingService.getMeeting(joinCode.trim()).then(() => {
        navigate(`/room/${joinCode.trim()}`);
      }).catch(() => {
        alert('Invalid meeting code.');
      });
    }
  };

  return (
    <Paper sx={{ p: 4, margin: 4 }}>
      <Typography variant="h4" gutterBottom>Your Meetings</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          Schedule a Meeting
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField 
            label="Enter 8-digit code"
            variant="outlined"
            size="small"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <Button onClick={handleJoinWithCode} variant="contained" sx={{ ml: 1 }}>
            Join
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>Upcoming Meetings</Typography>
      <List>
        {meetings.length > 0 ? meetings.map((meeting) => (
          <ListItem key={meeting.id} secondaryAction={
            <Button variant="outlined" onClick={() => navigate(`/room/${meeting.id}`)}>Join</Button>
          }>
            <ListItemText 
              primary={meeting.title} 
              secondary={`Scheduled for: ${new Date(meeting.dateTime).toLocaleString()}`}
            />
          </ListItem>
        )) : (
          <Typography>You have no upcoming meetings.</Typography>
        )}
      </List>

      <ScheduleMeetingModal 
        open={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleCreateMeeting} 
      />
    </Paper>
  );
};

export default Rooms;
