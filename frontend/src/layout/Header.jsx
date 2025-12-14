
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="app-header">
            <nav>
                <Link to="/">Activity Feed</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/room">Room</Link>
                {/* Navigation Links will be added here */}
            </nav>
        </header>
    );
};

export default Header;
