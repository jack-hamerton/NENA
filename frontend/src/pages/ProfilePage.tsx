
import React from 'react';
import ProfileHeader from '../profile/ProfileHeader';
import { SpiderWeb3D } from '../profile/SpiderWeb3D';

const ProfilePage = () => {
    return (
        <div className="profile-page">
            <ProfileHeader />
            <SpiderWeb3D />
            {/* Other profile sections will be added here */}
        </div>
    );
};

export default ProfilePage;
