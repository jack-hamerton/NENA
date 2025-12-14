import { useNotifications } from '../context/NotificationContext';
import { Badge, IconButton, Menu, MenuItem, Tooltip, Typography, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from 'react';

const NotificationBar = () => {
  const { notifications, clearReadNotifications, markAsRead } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={unreadNotifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
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
            <Button onClick={clearReadNotifications} sx={{ m: 2 }}>Clear Read</Button>
          </>
        )}
        {notifications.length === 0 && (
          <MenuItem>No new notifications</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationBar;
