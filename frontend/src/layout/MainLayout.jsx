import React, { useState, useEffect } from 'react';
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
import LandingPage from '../pages/LandingPage';
import AnalyticsBar from '../analytics/AnalyticsBar';
import { theme } from '../theme/theme';
import '../styles/global.css';
import ScreenShotBlocker from './ScreenshotBlocker';
import SuccessPage from '../pages/SuccessPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import PrivateRoute from '../components/PrivateRoute';
import TestPage from '../TestPage';
import { Sidebar } from '../components/layout/Sidebar';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const ContentContainer = styled.div`
  margin-left: ${props => props.sidebarOpen ? '120px' : '0'};
  transition: margin-left 0.3s ease-in-out;
`;

const LayoutWithSidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
  
    useEffect(() => {
      const handleDoubleClick = () => {
        if (user && window.innerWidth > 768) { // Only for PC and if user is logged in
          setSidebarOpen(prev => !prev);
        }
      };
  
      document.addEventListener('dblclick', handleDoubleClick);
  
      return () => {
        document.removeEventListener('dblclick', handleDoubleClick);
      };
    }, [user]); // Add user to dependency array
  
    useEffect(() => {
        if (!user) {
            setSidebarOpen(false);
        }
    }, [user])
  
    return (
        <>
            {user && <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />}
            <ContentContainer sidebarOpen={sidebarOpen && !!user}>
              <Routes>
                <Route path="/test" element={<TestPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path='/forgot-password' element={<ForgotPasswordPage />} />
                
                <Route element={<PrivateRoute />}>
                  <Route path="/home" element={<HomePage />} />
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
            </ContentContainer>
        </>
    );
}

const MainLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <ScreenShotBlocker />
      <Router>
          <LayoutWithSidebar />
      </Router>
    </ThemeProvider>
  );
};

export default MainLayout;
