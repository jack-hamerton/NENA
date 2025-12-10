import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { api } from '../../utils/api';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useNotifications } from '../../context/NotificationContext';

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
      collaborator_id: ''
  });
  const { notifications } = useNotifications();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const eventInvitation = notifications.find(n => n.type === 'event_invitation');
    if (eventInvitation) {
      fetchEvents();
    }
  }, [notifications]);

  const fetchEvents = async () => {
    const response = await api.get('/calendar/events', {}, {});
    setEvents(response.data.map(event => ({
      ...event,
      start: new Date(event.start_time),
      end: new Date(event.end_time)
    })));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setConflict(null);
    setFormData({ title: '', description: '', start_time: '', end_time: '', collaborator_id: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
        await api.post('/calendar/', {
            ...formData,
            start_time: new Date(formData.start_time).toISOString(),
            end_time: new Date(formData.end_time).toISOString()
        }, { params: { collaborator_id: formData.collaborator_id } });
        fetchEvents();
        handleClose();
    } catch (error) {
        if (error.response && error.response.status === 409) {
            setConflict(error.response.data.detail);
        } else {
            console.error("Error creating event:", error);
        }
    }
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
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Event</DialogTitle>
        <DialogContent>
            {conflict && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {conflict.message}
                    {conflict.available_slots && (
                        <ul>
                            {conflict.available_slots.map(slot => (
                                <li key={slot.start}>{moment(slot.start).format('LT')} - {moment(slot.end).format('LT')}</li>
                            ))}
                        </ul>
                    )}
                </Typography>
            )}
            <TextField name="title" label="Title" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
            <TextField name="description" label="Description" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
            <TextField name="start_time" label="Start Time" type="datetime-local" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} onChange={handleChange} />
            <TextField name="end_time" label="End Time" type="datetime-local" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} onChange={handleChange} />
            <TextField name="collaborator_id" label="Collaborator User ID" fullWidth onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
