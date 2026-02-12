import React from 'react';
import styled from 'styled-components';
import { Badge, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationItem = styled(MenuItem)`
    white-space: normal;
`;

const NotificationMenu = ({ notifications, onMarkAsRead }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div>
            <IconButton
                aria-label="show new notifications"
                color="inherit"
                onClick={handleClick}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <NotificationItem
                            key={notification.id}
                            onClick={() => {
                                onMarkAsRead(notification.id);
                                handleClose();
                            }}
                        >
                            <Typography variant="body2">{notification.message}</Typography>
                        </NotificationItem>
                    ))
                ) : (
                    <MenuItem disabled>
                        <Typography variant="body2">No new notifications</Typography>
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};

export default NotificationMenu;
