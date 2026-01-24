
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import StudyPage from '../pages/StudyPage';
import PodcastPage from '../pages/PodcastPage';
import CalendarPage from '../pages/Calendar';
import ProfilePage from '../pages/ProfilePage';
import RoomPage from '../pages/RoomPage';
import MessagesPage from '../pages/MessagesPage';
import DiscoverPage from '../pages/Discover';
import SettingsPage from '../pages/SettingsPage';
import HomePage from '../pages/HomePage';
import AnalyticsBar from '../analytics/AnalyticsBar';
import { theme } from '../theme/theme';
import '../styles/global.css';
import ScreenShotBlocker from './ScreenshotBlocker';
import SuccessPage from '../pages/SuccessPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import PrivateRoute from '../components/PrivateRoute';
import TestPage from '../TestPage';

const MainLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <ScreenShotBlocker />
      <Router>
        <Routes>
          <Route path="/test" element={<TestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/podcasts" element={<PodcastPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/room" element={<RoomPage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/user/:userId/settings" element={<SettingsPage />} />
            <Route path="/analytics" element={<AnalyticsBar />} />
            <Route path='/success' element={<SuccessPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default MainLayout;
