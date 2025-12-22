import React, { useState } from 'react';
import { mockUser } from '../mock/user'; // Assuming mock data is stored here
import './ProfileHeader.css';

const ProfileHeader = () => {
  const [showIntentOptions, setShowIntentOptions] = useState(false);

  const handleFollowClick = () => {
    setShowIntentOptions(!showIntentOptions);
  };

  const handleIntentSelect = (intent) => {
    // Here you would implement the logic to follow with the selected intent
    console.log(`Following with intent: ${intent}`);
    setShowIntentOptions(false);
  };

  return (
    <div className="profile-header">
      <div className="profile-picture">
        <img src={mockUser.avatar} alt={mockUser.name} />
        <span className="role-badge">{mockUser.role}</span>
      </div>
      <div className="profile-info">
        <h2>{mockUser.name}</h2>
        <p className="handle">{mockUser.handle}</p>
        <p className="tagline">{mockUser.tagline}</p>
        <div className="follow-section">
          <button onClick={handleFollowClick}>Follow</button>
          {showIntentOptions && (
            <div className="intent-options">
              <button onClick={() => handleIntentSelect('Supporter')}>Supporter</button>
              <button onClick={() => handleIntentSelect('Amplifier')}>Amplifier</button>
              <button onClick={() => handleIntentSelect('Learner')}>Learner</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
