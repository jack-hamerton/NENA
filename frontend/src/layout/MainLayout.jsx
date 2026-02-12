
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import StudyPage from '../pages/StudyPage';
import PodcastPage from '../pages/PodcastPage';
import ProfilePage from '../pages/ProfilePage';
import RoomPage from '../pages/RoomPage';
import RoomsPage from '../pages/RoomsPage'; // Import RoomsPage
import MessagesPage from '../pages/MessagesPage';
import DiscoverPage from '../pages/Discover';
import SettingsPage from '../pages/SettingsPage';
import HomePage from '../pages/HomePage';
import LandingPage from '../pages/LandingPage';
import { theme } from '../theme/theme';
import '../styles/global.css';
import ScreenShotBlocker from './ScreenshotBlocker';
import SuccessPage from '../pages/SuccessPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import PrivateRoute from '../components/PrivateRoute';
import Header from '../components/layout/Header';
import styled from 'styled-components';

const ContentContainer = styled.div`
  padding-top: 60px; 
`;

const MainLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <ScreenShotBlocker />
      <Router>
        <Header />
        <ContentContainer>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/study/*" element={<StudyPage />} />
              <Route path="/podcasts" element={<PodcastPage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/room/:roomId" element={<RoomPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/user/:userId/settings" element={<SettingsPage />} />
              <Route path='/success' element={<SuccessPage />} />
            </Route>
          </Routes>
        </ContentContainer>
      </Router>
    </ThemeProvider>
  );
};

export default MainLayout;
