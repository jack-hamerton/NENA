
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import FloatingNav from './FloatingNav';
import SplashScreen from './SplashScreen/SplashScreen';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import FollowList from '../components/FollowList'; 
import * as userService from '../services/user.service';
import DiscoverPage from '../discover/DiscoverPage';
import MessagesPage from '../messages/MessagesPage';
import RoomsPage from '../rooms/RoomsPage';
import { Room } from '../rooms/Room';
import Podcasts from '../pages/Podcasts';
import PodcastPlayer from '../components/podcast/PodcastPlayer';
import { theme } from '../theme/theme';
import '../styles/screenshot-blocker.css';
import ScreenshotBlocker from './ScreenshotBlocker';
import Footer from './Footer';
import GlobalPinLock from '../components/GlobalPinLock'; 
import SettingsPage from '../settings/SettingsPage'; 
import { useBiometricAuth } from '../hooks/useBiometricAuth'; // Import the new hook
import StudyPage from '../study/StudyPage';
import StudyBuilder from '../study/StudyBuilder';
import CreatorStudio from '../study/CreatorStudio';
import ParticipantGate from '../study/ParticipantGate';
import StudyParticipantView from '../study/StudyParticipantView';


// --- Placeholder Pages ---
const CalendarPage = () => <div>Calendar Page</div>;
const CreatePodcastPage = () => <div>Create Podcast Page</div>;
const PrivacySettingsPage = () => <div>Privacy Settings Page</div>;

// ... (styled components and other components remain the same)
const AppContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding-left: 100px; /* Space for the floating nav */
  padding-right: 2rem;
  width: 100%;
`;

const FollowerList = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const userRes = await userService.getFollowers(id);
        setUsers(userRes.data.map(f => f.follower));
      } catch (error) {
        console.error("Failed to fetch followers:", error);
      }
    };

    fetchFollowers();
  }, [id]);

  return <FollowList title="Followers" users={users} />;
};

const FollowingList = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const userRes = await userService.getUserById(id);
        setUsers(userRes.data.following.map(f => f.followed)); 
      } catch (error) {
        console.error("Failed to fetch following:", error);
      }
    };

    fetchFollowing();
  }, [id]);

  return <FollowList title="Following" users={users} />;
};

const MainLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const { isBiometricAvailable, authenticate } = useBiometricAuth();

  const handleUnlock = useCallback(() => {
    setIsLocked(false);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await new Promise(resolve => setTimeout(resolve, 4000)); // Splash screen timer
      setIsLoading(false);

      const storedPin = localStorage.getItem('app_pin');
      if (storedPin) {
        if (isBiometricAvailable) {
          try {
            const success = await authenticate();
            if (success) {
              handleUnlock(); // Unlock if biometric succeeds
            } else {
              // If user cancels or it fails, fall back to PIN
              setIsLocked(true); 
            }
          } catch (error) {
            // If an error occurs during authentication, show PIN lock
            console.error("Biometric auth failed", error);
            setIsLocked(true);
          }
        } else {
          // If no biometrics, just show PIN lock
          setIsLocked(true);
        }
      } 
    };

    initialize();
  }, [isBiometricAvailable, authenticate, handleUnlock]);

  if (isLoading) {
    return <SplashScreen />;
  }

  // Pass a specific key to GlobalPinLock to force re-mount if it needs to appear again
  if (isLocked) {
    return <GlobalPinLock key={Date.now()} onUnlock={handleUnlock} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ScreenshotBlocker />
        <AppContainer>
          <FloatingNav />
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/room" element={<RoomsPage />} />
              <Route path="/room/:id" element={<Room />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/player" element={<PodcastPlayer />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/study/new" element={<StudyBuilder />} />
              <Route path="/study/access" element={<ParticipantGate />} />
              <Route path="/study/participant/:id" element={<StudyParticipantView />} />
              <Route path="/study/:id" element={<CreatorStudio />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/user/:id/followers" element={<FollowerList />} />
              <Route path="/user/:id/following" element={<FollowingList />} />
              <Route path="/podcast/create" element={<CreatePodcastPage />} />
              <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </MainContent>
          <Footer />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default MainLayout;
