
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import FloatingNav from './layout/FloatingNav';
import SplashScreen from './layout/SplashScreen/SplashScreen'; // Import the Splash Screen
import HomePage from './pages/HomePage'; // Corrected HomePage import
import { UserProfile } from './components/user/UserProfile';
import { PodcastArtistProfile } from './components/podcast/PodcastArtistProfile';
import { ListenersPage } from './components/podcast/ListenersPage';

// --- Placeholder Pages (keeping for routes that are not yet built) ---
const DiscoverPage = () => <div>Discover Page</div>;
const MessagesPage = () => <div>Messages Page</div>;
const RoomPage = () => <div>Room Page</div>;
const StudyPage = () => <div>Study Page</div>;
const CalendarPage = () => <div>Calendar Page</div>;
const CreatePodcastPage = () => <div>Create Podcast Page</div>;
const PrivacySettingsPage = () => <div>Privacy Settings Page</div>;

const AppContainer = styled.div`
  display: flex;
  background-color: #121212;
  color: #ffffff;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding-left: 100px; /* Space for the floating nav */
  padding-right: 2rem;
`;

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the splash screen animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 seconds, adjust as needed

    return () => clearTimeout(timer);
  }, []);

  // If the app is loading, show the splash screen, otherwise show the app
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <AppContainer>
        <FloatingNav />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/room" element={<RoomPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/podcast/create" element={<CreatePodcastPage />} />
            <Route path="/podcast/:artistId" element={<PodcastArtistProfile />} />
            <Route path="/podcast/:artistId/listeners" element={<ListenersPage />} />
            <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

export default App;
