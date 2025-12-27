import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom';
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
import Podcasts from '../pages/Podcasts';
import PodcastPlayer from '../components/podcast/PodcastPlayer';
import { theme } from '../theme/theme';
import '../styles/screenshot-blocker.css';
import '../styles/global.css';
import ScreenshotBlocker from './ScreenshotBlocker';
import Footer from './Footer';
import GlobalPinLock from '../components/GlobalPinLock'; 
import SettingsPage from '../pages/SettingsPage'; 
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import StudyPage from '../pages/StudyPage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import { useAuth } from '../contexts/AuthContext';
import { AIProvider } from '../hooks/useAI';
import AIAssistant from '../components/AIAssistant';

const CalendarPage = () => <div>Calendar Page</div>;
const CreatePodcastPage = () => <div>Create Podcast Page</div>;
const PrivacySettingsPage = () => <div>Privacy Settings Page</div>;

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
  padding-left: 100px; 
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

const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const { isBiometricAvailable, authenticate } = useBiometricAuth();

  const handleUnlock = useCallback(() => {
    setIsLocked(false);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await new Promise(resolve => setTimeout(resolve, 4000));
      setIsLoading(false);

      const storedPin = localStorage.getItem('app_pin');
      if (storedPin) {
        if (isBiometricAvailable) {
          try {
            const success = await authenticate();
            if (success) {
              handleUnlock();
            } else {
              setIsLocked(true); 
            }
          } catch (error) {
            console.error("Biometric auth failed", error);
            setIsLocked(true);
          }
        } else {
          setIsLocked(true);
        }
      } 
    };

    initialize();
  }, [isBiometricAvailable, authenticate, handleUnlock]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isLocked) {
    return <GlobalPinLock key={Date.now()} onUnlock={handleUnlock} />;
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const blurClass = !user && !isAuthPage ? 'blur-effect' : '';

  return (
    <ThemeProvider theme={theme}>
      <ScreenshotBlocker />
      <div className={blurClass}>
        <AppContainer>
          {user && <FloatingNav />}
          <MainContent>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/room" element={<RoomsPage />} />
              <Route path="/room/:id" element={<RoomsPage />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/player" element={<PodcastPlayer />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/study/:id" element={<StudyPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/user/:id/followers" element={<FollowerList />} />
              <Route path="/user/:id/following" element={<FollowingList />} />
              <Route path="/user/:id/settings" element={<SettingsPage />} />
              <Route path="/podcast/create" element={<CreatePodcastPage />} />
              <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </MainContent>
          {user && <AIAssistant />}
          {user && <Footer />}
        </AppContainer>
      </div>
      {!user && !isAuthPage && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LoginPage />
        </div>
      )}
    </ThemeProvider>
  );
}

const MainLayout = () => (
  <Router>
    <AIProvider>
      <AppLayout />
    </AIProvider>
  </Router>
);

export default MainLayout;
