
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText, useMediaQuery, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import UserAvatar from '../UserAvatar';
import NotificationMenu from './NotificationMenu';

// Import icons
import SearchIcon from '@mui/icons-material/Search';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SchoolIcon from '@mui/icons-material/School';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import LogoutIcon from '@mui/icons-material/Logout';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: ${props => props.theme.palette.background.paper};
  border-bottom: 1px solid ${props => props.theme.palette.divider};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 100;

  @media (min-width: ${props => props.theme.breakpoints.values.sm}px) {
    padding: 0 24px;
  }
`;

const Logo = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: ${props => props.theme.breakpoints.values.sm}px) {
    gap: 16px;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.palette.text.secondary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px; 

  &:hover {
    color: ${props => props.theme.palette.primary.main};
  }

  & .nav-text {
    display: none;
    @media (min-width: ${props => props.theme.breakpoints.values.md}px) {
      display: inline;
    }
  }
`;

const Header = ({ onSearchClick, onAICompanionClick }) => {
    const { user, logout } = useAuth();
    const { notifications, markAsRead } = useNotifications();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMoreClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMoreClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    if (!user) {
        return null;
    }

    return (
        <HeaderContainer theme={theme}>
            <Logo to="/home">
                <img src="/nena-log.png" alt="NenaSpace Logo" style={{ height: isMobile ? '35px' : '40px' }} />
            </Logo>
            <Nav theme={theme}>
                <IconButton onClick={onSearchClick} sx={{ color: 'text.secondary' }}>
                    <SearchIcon />
                </IconButton>
                <NavLink to="/messages" theme={theme}>
                    <MailOutlineIcon />
                    <span className="nav-text">Messages</span>
                </NavLink>
                <IconButton
                    id="more-button"
                    aria-controls={open ? 'more-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleMoreClick}
                    sx={{ color: 'text.secondary' }}
                >
                    {isMobile ? <MoreVertIcon /> : <MoreHorizIcon />}
                </IconButton>
                <Menu
                    id="more-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMoreClose}
                    MenuListProps={{
                        'aria-labelledby': 'more-button',
                    }}
                >
                    <MenuItem onClick={() => { onAICompanionClick(); handleMoreClose(); }}>
                        <ListItemIcon>
                            <SmartToyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>AI Companion</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleMoreClose} component={Link} to="/rooms">
                        <ListItemIcon>
                            <MeetingRoomIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Rooms</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleMoreClose} component={Link} to="/study">
                         <ListItemIcon>
                            <SchoolIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Study</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleMoreClose} component={Link} to="/podcasts">
                         <ListItemIcon>
                            <PodcastsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Podcast</ListItemText>
                    </MenuItem>
                    {isMobile && (
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </MenuItem>
                    )}
                </Menu>
                <NotificationMenu notifications={notifications} onMarkAsRead={markAsRead} />
                <NavLink to={`/profile/${user.id}`} theme={theme}>
                    <UserAvatar user={user} size="small" />
                </NavLink>
                {!isMobile && (
                    <Button variant="outlined" onClick={handleLogout} startIcon={<LogoutIcon />}>Logout</Button>
                )}
            </Nav>
        </HeaderContainer>
    );
}

export default Header;
