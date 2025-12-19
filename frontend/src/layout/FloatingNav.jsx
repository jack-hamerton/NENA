
import { NavLink } from 'react-router-dom';
import { Avatar, Box, List, ListItem, ListItemText, useTheme } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

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
  const { user } = useAuth();
  const theme = useTheme();

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
        {navItems.map((item) => {
          if (item.text === 'Profile') {
            return (
              <NavLink to={item.path} key={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItem button>
                  <Avatar
                    alt={user?.name}
                    src={user?.profilePicture}
                    sx={{
                      width: 50,
                      height: 50,
                      border: `2px solid ${theme.palette.primary.main}`,
                    }}
                  />
                </ListItem>
              </NavLink>
            );
          }
          return (
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
          );
        })}
      </List>
    </Box>
  );
};

export default FloatingNav;
