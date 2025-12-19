
import React, { useState } from 'react';
import ProfileHeader from '../profile/ProfileHeader';
import { SpiderWeb3D } from '../profile/SpiderWeb3D';
import CreatePodcast from '../components/podcast/CreatePodcast';

const ProfilePage = () => {
    const [showCreatePodcast, setShowCreatePodcast] = useState(false);

    return (
        <div className="profile-page">
            <ProfileHeader />
            <SpiderWeb3D />
            <button onClick={() => setShowCreatePodcast(!showCreatePodcast)}>
                {showCreatePodcast ? 'Close Podcast Creator' : 'Create Podcast'}
            </button>
            {showCreatePodcast && <CreatePodcast />}
            {/* Other profile sections will be added here */}
        </div>
    );
};

export default ProfilePage;
