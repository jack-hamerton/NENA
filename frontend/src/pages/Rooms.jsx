
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Button, TextField, IconButton } from '@mui/material';
import { roomService } from '../services/roomService';
import { useAuth } from '../hooks/useAuth';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [addUserUsername, setAddUserUsername] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      // This will be updated to fetch only user's rooms
      const userRooms = await roomService.getMyRooms(); 
      setRooms(userRooms);
    }
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    if (newRoomName.trim()) {
      const newRoom = await roomService.createRoom({ name: newRoomName, creatorId: user.id });
      setRooms(prevRooms => [...prevRooms, newRoom]);
      setNewRoomName('');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    await roomService.deleteRoom(roomId);
    setRooms(prevRooms => prevRooms.filter(r => r.id !== roomId));
  };

  const handleLeaveRoom = async (roomId) => {
    await roomService.leaveRoom(roomId);
    setRooms(prevRooms => prevRooms.filter(r => r.id !== roomId));
  };

  const handleAddUserToRoom = async (roomId) => {
    if(addUserUsername.trim()) {
      await roomService.addUserToRoom(roomId, addUserUsername);
      setAddUserUsername('');
      // Maybe show a success message
    }
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>Your Rooms</Typography>
      <Box sx={{ mb: 2 }}>
        <TextField 
          label="New Room Name"
          variant="outlined"
          value={newRoomName}
          onChange={e => setNewRoomName(e.target.value)}
          sx={{ input: { color: 'white' }, label: { color: 'white' }, fieldset: { borderColor: 'white' } }}
        />
        <Button onClick={handleCreateRoom} variant="contained" sx={{ ml: 2, mt: 1 }}>Create Room</Button>
      </Box>
      <List>
        {rooms.map((room) => (
          <ListItem key={room.id} sx={{ backgroundColor: '#2c2c2c', mb: 1, borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <ListItemText primary={room.name} />
              <Box>
                <Link to={`/room/${room.id}`}>
                  <Button variant="contained">Join</Button>
                </Link>
                {room.creatorId === user.id ? (
                  <IconButton onClick={() => handleDeleteRoom(room.id)} sx={{ ml: 1}}>
                    <Typography>Delete</Typography>
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleLeaveRoom(room.id)} sx={{ ml: 1}}>
                    <Typography>Leave</Typography>
                  </IconButton>
                )}
              </Box>
            </Box>
            {room.creatorId === user.id && (
              <Box sx={{ mt: 2, width: '100%' }}>
                <TextField 
                  label="Add user by username"
                  variant="outlined"
                  size="small"
                  onChange={e => setAddUserUsername(e.target.value)}
                  sx={{ input: { color: 'white' }, label: { color: 'white' }, fieldset: { borderColor: 'white' }, width: 'calc(100% - 120px)' } }
                />
                <Button onClick={() => handleAddUserToRoom(room.id)} variant="contained" sx={{ ml: 1, mt: 0.5 }}>Add User</Button>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Rooms;
