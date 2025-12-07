
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="app-header">
            <nav>
                <Link to="/profile">Profile</Link>
                {/* Navigation Links will be added here */}
            </nav>
        </header>
    );
};

export default Header;
