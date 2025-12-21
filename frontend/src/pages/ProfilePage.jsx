import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileHeader from '../profile/ProfileHeader';
import ContentGrid from '../profile/ContentGrid';
import SpiderWeb from '../components/SpiderWeb';
import Highlights from '../components/Highlights';
import DragAndDropInterface from '../components/profile/DragAndDropInterface';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div>
      <ProfileHeader />
      <Highlights />
      <DragAndDropInterface />
      <div className="tabs">
        <button onClick={() => setActiveTab('posts')}>Posts</button>
        <button onClick={() => setActiveTab('spiderweb')}>Spider Web</button>
        <Link to="/podcast-profile">
          <button>Podcast</button>
        </Link>
      </div>
      {activeTab === 'posts' && <ContentGrid />}
      {activeTab === 'spiderweb' && <SpiderWeb />}
    </div>
  );
};

export default ProfilePage;
