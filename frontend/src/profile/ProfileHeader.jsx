
import React, { useState } from 'react';
import { mockUser } from '../mock/user'; // Assuming mock data is stored here
import {
    ProfileHeaderContainer,
    ProfilePicture,
    RoleBadge,
    ProfileInfo,
    FollowSection
} from './ProfileHeader.styled';

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
    <ProfileHeaderContainer>
      <ProfilePicture>
        <img src={mockUser.avatar} alt={mockUser.name} />
        <RoleBadge>{mockUser.role}</RoleBadge>
      </ProfilePicture>
      <ProfileInfo>
        <h2>{mockUser.name}</h2>
        <p className="handle">{mockUser.handle}</p>
        <p className="tagline">{mockUser.tagline}</p>
        <FollowSection>
          <button onClick={handleFollowClick}>Follow</button>
          {showIntentOptions && (
            <div className="intent-options">
              <button onClick={() => handleIntentSelect('Supporter')}>Supporter</button>
              <button onClick={() => handleIntentSelect('Amplifier')}>Amplifier</button>
              <button onClick={() => handleIntentSelect('Learner')}>Learner</button>
            </div>
          )}
        </FollowSection>
      </ProfileInfo>
    </ProfileHeaderContainer>
  );
};

export default ProfileHeader;
