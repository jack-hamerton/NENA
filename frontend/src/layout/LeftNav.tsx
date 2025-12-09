import { NavLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const navItems = [
  { path: '/', icon: <HomeIcon />, text: 'Feed' },
  { path: '/discover', icon: <SearchIcon />, text: 'Discover' },
  { path: '/profile/me', icon: <PersonIcon />, text: 'Profile' },
  { path: '/messages', icon: <MessageIcon />, text: 'Messages' },
  { path: '/rooms', icon: <GroupIcon />, text: 'Rooms' },
  { path: '/study', icon: <SchoolIcon />, text: 'Study' },
  { path: '/music', icon: <MusicNoteIcon />, text: 'Music' },
  { path: '/analytics', icon: <AnalyticsIcon />, text: 'Analytics' },
];

const LeftNav = () => {
  return (
    <Box sx={{ width: 240, flexShrink: 0, bgcolor: 'background.paper' }}>
      <List>
        {navItems.map((item) => (
          <NavLink to={item.path} key={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button>
              <ListItemIcon sx={{ color: 'text.primary' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Box>
  );
};

export default LeftNav;
