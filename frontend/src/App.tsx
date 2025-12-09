
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { AIProvider } from './hooks/useAI';
import MainLayout from './layout/MainLayout';
import SplashScreen from './layout/SplashScreen/SplashScreen';
import FeedPage from './feed/FeedPage';
import DiscoverPage from './discover/DiscoverPage';
import UserProfile from './profile/UserProfile';
import MessagesPage from './messages/MessagesPage';
import RoomsPage from './rooms/RoomsPage';
import { RoomPage } from './pages/RoomPage';
import StudyPage from './study/StudyPage';
import SettingsPage from './settings/SettingsPage';
import Analytics from './pages/Analytics';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const theme = {
  primary: '#1a73e8',
  primaryHover: '#287ae6',
  background: '#121212',
  accent: '#f48fb1',
  text: '#ffffff',
  borderColor: '#333',
  font: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  secondary: '#90caf9',
  tertiary: '#f48fb1',
  colors: {
    card: '#1e1e1e',
    text: '#ffffff'
  }
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const handleSplashFinish = () => {
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <AIProvider>
          <AuthProvider>
            {loading ? (
              <SplashScreen onFinish={handleSplashFinish} />
            ) : (
              <Router>
                <Routes>
                  {user ? (
                    <Route path='/*' element={<MainApp />} />
                  ) : (
                    <>
                      <Route path='/login' element={<LoginPage />} />
                      <Route path='/register' element={<RegisterPage />} />
                      <Route path='*' element={<Navigate to='/login' />} />
                    </>
                  )}
                </Routes>
              </Router>
            )}
          </AuthProvider>
        </AIProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

const MainApp = () => (
  <MainLayout>
    <Routes>
      <Route path='/discover' element={<DiscoverPage />} />
      <Route path='/profile/:userId' element={<UserProfile />} />
      <Route path='/messages' element={<MessagesPage />} />
      <Route path='/rooms' element={<RoomsPage />} />
      <Route path='/room/:roomId' element={<RoomPage />} />
      <Route path='/study' element={<StudyPage />} />
      <Route path='/settings' element={<SettingsPage />} />
      <Route path='/analytics' element={<Analytics />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  </MainLayout>
);

export default App;
