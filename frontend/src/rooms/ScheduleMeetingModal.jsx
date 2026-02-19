
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ScheduleMeetingModal = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [agenda, setAgenda] = useState([]);
  const [newAgendaItem, setNewAgendaItem] = useState('');

  const handleAddAgendaItem = () => {
    if (newAgendaItem.trim()) {
      setAgenda([...agenda, newAgendaItem.trim()]);
      setNewAgendaItem('');
    }
  };

  const handleDeleteAgendaItem = (index) => {
    const newAgenda = agenda.filter((_, i) => i !== index);
    setAgenda(newAgenda);
  };

  const handleSubmit = () => {
    if (title.trim() && dateTime) {
      onSubmit({ title, dateTime, agenda });
      // Reset form
      setTitle('');
      setDateTime('');
      setAgenda([]);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">Schedule a New Meeting</Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          type="datetime-local"
          label="Date and Time"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>Agenda</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="New Agenda Item"
            value={newAgendaItem}
            onChange={(e) => setNewAgendaItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddAgendaItem()}
          />
          <IconButton onClick={handleAddAgendaItem} color="primary">
            <Add />
          </IconButton>
        </Box>
        <List dense>
          {agenda.map((item, index) => (
            <ListItem key={index} secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => handleDeleteAgendaItem(index)}><Delete /></IconButton>}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }}>
          Save & Generate Code
        </Button>
      </Box>
    </Modal>
  );
};

export default ScheduleMeetingModal;
