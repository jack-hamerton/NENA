
import React from 'react';
import ProfileHeader from '../profile/ProfileHeader';
import SpiderWeb from '../components/SpiderWeb';

const ProfilePage = () => {
    return (
        <div className="profile-page">
            <ProfileHeader />
            <SpiderWeb />
            {/* Other profile sections will be added here */}
        </div>
    );
};

export default ProfilePage;
