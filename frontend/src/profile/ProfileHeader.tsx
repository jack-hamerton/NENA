
import React from 'react';
import './ProfileHeader.css';

const ProfileHeader = () => {
    return (
        <div className="profile-header">
            <div className="profile-picture">
                <img src="https://via.placeholder.com/150" alt="Profile" />
            </div>
            <div className="profile-info">
                <h2>User Name</h2>
                <p>User Bio</p>
            </div>
        </div>
    );
};

export default ProfileHeader;
