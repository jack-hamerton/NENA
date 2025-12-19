
import { NavLink } from 'react-router-dom';
import { Box, List, ListItem, ListItemText } from '@mui/material';

const navItems = [
  { path: '/discover', text: 'Discover' },
  { path: '/profile/me', text: 'Profile' },
  { path: '/messages', text: 'Messages' },
  { path: '/rooms', text: 'Rooms' },
  { path: '/study', text: 'Study' },
  { path: '/podcasts', text: 'Podcasts' },
  { path: '/analytics', text: 'Analytics' },
  { path: '/calendar', text: 'Calendar' },
];

const FloatingNav = () => {
  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        top: '50%', 
        left: 20, 
        transform: 'translateY(-50%)', 
        bgcolor: 'transparent', 
        zIndex: 1000 
      }}
    >
      <List>
        {navItems.map((item) => (
          <NavLink to={item.path} key={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold',
                  color: 'white'
                }} 
              />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Box>
  );
};

export default FloatingNav;
