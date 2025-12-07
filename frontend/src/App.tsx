import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import DiscoverPage from './discover/DiscoverPage';
import UserProfile from './profile/UserProfile';
import FeedPage from './feed/FeedPage';
import MessagesPage from './messages/MessagesPage';
import RoomsPage from './rooms/RoomsPage';
import StudyPage from './study/StudyPage';
import MusicPodcastPage from './pages/MusicPodcastPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DiscoverPage />} />
        <Route path="profile/:userId" element={<UserProfile />} />
        <Route path="feed" element={<FeedPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="study" element={<StudyPage />} />
        <Route path="music" element={<MusicPodcastPage />} />
      </Route>
    </Routes>
  );
}

export default App;
