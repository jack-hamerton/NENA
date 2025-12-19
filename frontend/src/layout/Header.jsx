
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Corrected path

const Header = () => {
    const { logout } = useAuth(); // Assuming useAuth provides a logout function

    return (
        <header className="app-header">
            <nav>
                <Link to="/">Activity Feed</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/room">Room</Link>
                <Link to="/podcasts">Podcasts</Link>
            </nav>
            <button onClick={logout}>Logout</button>
        </header>
    );
};

export default Header;
