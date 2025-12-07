import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const drawerWidth = 240;

const LeftNav: React.FC = () => {
  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/feed' },
    { text: 'Discover', icon: <SearchIcon />, path: '/' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile/me' },
    { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
    { text: 'Rooms', icon: <GroupIcon />, path: '/rooms' },
    { text: 'Study', icon: <SchoolIcon />, path: '/study' },
    { text: 'Music', icon: <MusicNoteIcon />, path: '/music' },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#427973',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItem button component={Link} to={item.path} key={item.text}>
            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default LeftNav;
