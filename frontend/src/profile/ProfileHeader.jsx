
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import './ProfileHeader.css';

const ProfileHeader = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="profile-header">
      <div className="profile-picture">
        <img src="https://via.placeholder.com/150" alt="Profile" />
      </div>
      <div className="profile-info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button>Edit Profile</button>
      </div>
    </div>
  );
};

export default ProfileHeader;
