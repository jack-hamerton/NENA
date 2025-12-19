
import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { 
  TextField, Button, Modal, Box, List, ListItem, ListItemText, IconButton, Typography, Badge, Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import calendarService from '../services/calendar.service.js';
import userService from '../services/userService';
import { format, isSameDay } from 'date-fns';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [participants, setParticipants] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    calendarService.getEvents().then(response => setEvents(response.data));
    userService.getAllUsers().then(response => setUsers(response.data));
    // In a real app, you'd fetch invitations for the current user
    // For now, we'll just mock some invitations
    // setInvitations(mockInvitations);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEventTitle('');
    setEditingEvent(null);
    setStartTime(new Date());
    setEndTime(new Date());
    setParticipants([]);
  };

  const handleCreateEvent = () => {
    if (eventTitle) {
      const newEvent = { 
        title: eventTitle, 
        start_time: startTime.toISOString(), 
        end_time: endTime.toISOString() 
      };
      if (editingEvent) {
        calendarService.updateEvent(editingEvent.id, newEvent).then(response => {
          setEvents(events.map(event => event.id === editingEvent.id ? response.data : event));
          handleClose();
        });
      } else {
        calendarService.createEvent(newEvent, participants).then(response => {
          setEvents([...events, response.data]);
          handleClose();
        });
      }
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setStartTime(new Date(event.start_time));
    setEndTime(new Date(event.end_time));
    setParticipants(event.participants.map(p => p.user_id));
    setOpen(true);
  };

  const handleDeleteEvent = (id) => {
    calendarService.deleteEvent(id).then(() => {
      setEvents(events.filter(event => event.id !== id));
    });
  };

  const handleRespond = (invitationId, status) => {
    calendarService.respondToInvitation(invitationId, status).then(response => {
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    });
  };

  const dailyEvents = events.filter(event => isSameDay(new Date(event.start_time), selectedDate));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Typography variant="h4" gutterBottom>Calendar</Typography>
      <Button variant="contained" onClick={handleOpen}>Create Event</Button>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <StaticDatePicker
          orientation="landscape"
          openTo="day"
          value={selectedDate}
          onChange={(newValue) => {
            setSelectedDate(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
          renderDay={(day, _value, DayComponentProps) => {
            const isSelected = !DayComponentProps.outsideCurrentMonth && events.some(event => isSameDay(new Date(event.start_time), day));
            return (
              <Badge
                key={day.toString()}
                overlap="circular"
                badgeContent={isSelected ? '❗️' : undefined}
              >
                <PickersDay {...DayComponentProps} />
              </Badge>
            );
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">Events for {format(selectedDate, 'MMMM do, yyyy')}</Typography>
          <List>
            {dailyEvents.length > 0 ? dailyEvents.map((event) => (
              <ListItem key={event.id} secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditEvent(event)}>
                    <Typography>Edit</Typography>
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEvent(event.id)}>
                    <Typography>Delete</Typography>
                  </IconButton>
                </>
              }>
                <ListItemText 
                  primary={event.title} 
                  secondary={
                    <>
                      <span>{`${format(new Date(event.start_time), 'p')} - ${format(new Date(event.end_time), 'p')}`}</span>
                      <br />
                      <span>Participants: {event.participants.map(p => p.user.email).join(', ')}</span>
                    </>
                  }
                />
              </ListItem>
            )) : <Typography>No events for this day.</Typography>}
          </List>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editingEvent ? 'Edit Event' : 'Create Event'}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="eventTitle"
            label="Event Title"
            name="eventTitle"
            autoFocus
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="participants-label">Participants</InputLabel>
            <Select
              labelId="participants-label"
              id="participants"
              multiple
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              renderValue={(selected) => selected.map(id => users.find(u => u.id === id)?.email).join(', ')}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleCreateEvent} variant="contained" sx={{ mt: 2 }}>
            {editingEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </Box>
      </Modal>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Invitations</Typography>
        <List>
          {invitations.map((invitation) => (
            <ListItem key={invitation.id}>
              <ListItemText 
                primary={invitation.event.title}
                secondary={`From ${invitation.event.owner.email}`}
              />
              <Button onClick={() => handleRespond(invitation.id, 'accepted')}>Accept</Button>
              <Button onClick={() => handleRespond(invitation.id, 'declined')}>Decline</Button>
            </ListItem>
          ))}
        </List>
      </Box>

    </LocalizationProvider>
  );
};

export default Calendar;
