
import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../services/api';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useNotifications } from '../../contexts/NotificationContext';
import { meetingService } from '../../services/meetingService'; // Import meeting service
import { useAuth } from '../../contexts/AuthContext';

const localizer = momentLocalizer(moment);

export const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [conflict, setConflict] = useState(null);
  const [formData, setFormData] = useState({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      collaborator_ids: ''
  });
  const { notifications } = useNotifications();
  const { user } = useAuth(); // Get the current user

  const fetchEventsAndMeetings = async () => {
    // Fetch calendar events
    const eventResponse = await api.get('/calendar/', {});
    const calendarEvents = eventResponse.data.map(event => ({
      ...event,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      isMeeting: false
    }));

    // Fetch meetings
    if (user) {
        const userMeetings = await meetingService.getUserMeetings(user.id);
        const meetingEvents = userMeetings.map(meeting => ({
            title: meeting.title,
            start: new Date(meeting.dateTime),
            end: new Date(new Date(meeting.dateTime).getTime() + 60 * 60 * 1000), // Assuming 1-hour meetings
            isMeeting: true
        }));
        setEvents([...calendarEvents, ...meetingEvents]);
    }
  };

  useEffect(() => {
    fetchEventsAndMeetings();
  }, [user]);

  useEffect(() => {
    const eventInvitation = notifications.find(n => n.type === 'event_invitation');
    if (eventInvitation) {
      fetchEventsAndMeetings();
    }
  }, [notifications]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setConflict(null);
    setFormData({ title: '', description: '', start_time: '', end_time: '', collaborator_ids: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
        const collaborator_ids = formData.collaborator_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        await api.post('/calendar/', {
            ...formData,
            collaborator_ids,
            start_time: new Date(formData.start_time).toISOString(),
            end_time: new Date(formData.end_time).toISOString()
        });
        fetchEventsAndMeetings();
        handleClose();
    } catch (error) {
        if (error.response && error.response.status === 409) {
            setConflict(error.response.data.detail);
        } else {
            console.error("Error creating event:", error);
        }
    }
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.isMeeting ? '#3174ad' : '#3a87ad',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>Create Event</Button>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Event</DialogTitle>
        <DialogContent>
            {conflict && (
                <div>
                    <Typography color="error" sx={{ mb: 1 }}>
                        {conflict.message}
                    </Typography>
                    {conflict.available_slots && conflict.available_slots.length > 0 && (
                        <div>
                            <Typography variant="subtitle2">Available slots:</Typography>
                            <ul>
                                {conflict.available_slots.map((slot, index) => (
                                    <li key={index}>{moment(slot.start).format('LT')} - {moment(slot.end).format('LT')}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            <TextField name="title" label="Title" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
            <TextField name="description" label="Description" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
            <TextField name="start_time" label="Start Time" type="datetime-local" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} onChange={handleChange} />
            <TextField name="end_time" label="End Time" type="datetime-local" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} onChange={handleChange} />
            <TextField name="collaborator_ids" label="Collaborator User IDs (comma-separated)" fullWidth onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
