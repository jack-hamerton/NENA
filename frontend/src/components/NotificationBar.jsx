
import { useNotifications } from '../contexts/NotificationContext';
import { Menu, MenuItem, Typography, Button } from '@mui/material';
import { useState } from 'react';
import styled, { useTheme } from 'styled-components';

const NotificationText = styled.div`
  color: ${props => props.theme.text.primary};
  cursor: pointer;
  font-weight: 500;
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background-color: ${props => props.theme.palette.primary} !important;
    color: ${props => props.theme.text.primary} !important;
  }
`;

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.palette.secondary} !important;
  color: ${props => props.theme.text.primary} !important;
  margin: 16px !important;
`;

const NotificationBar = () => {
  const { notifications, clearReadNotifications, markAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    // Mark notifications as read when the menu is opened
    notifications.forEach(n => !n.read && markAsRead(n.id));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const readNotifications = notifications.filter(n => n.read);
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <>
      <NotificationText theme={theme} onClick={handleOpen}>
        Notifications
      </NotificationText>
      <StyledMenu
        theme={theme}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Typography variant="h6" sx={{ p: 2 }}>Notifications</Typography>
        {unreadNotifications.length > 0 && (
          <Typography variant="subtitle2" sx={{ p: 2 }}>Unread</Typography>
        )}
        {unreadNotifications.map(n => (
          <MenuItem key={n.id}>{n.payload.message}</MenuItem>
        ))}
        {readNotifications.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ p: 2 }}>Read</Typography>
            {readNotifications.map(n => (
              <MenuItem key={n.id}>{n.payload.message}</MenuItem>
            ))}
            <StyledButton theme={theme} onClick={clearReadNotifications}>Clear Read</StyledButton>
          </>
        )}
        {notifications.length === 0 && (
          <MenuItem>No new notifications</MenuItem>
        )}
      </StyledMenu>
    </>
  );
};

export default NotificationBar;
