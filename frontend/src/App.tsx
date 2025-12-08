import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { darkTheme } from './theme';
import MainLayout from './layout/MainLayout';
import SplashScreen from './layout/SplashScreen/SplashScreen';
import FeedPage from './feed/FeedPage';
import DiscoverPage from './discover/DiscoverPage';
import UserProfile from './profile/UserProfile';
import MessagesPage from './messages/MessagesPage';
import RoomsPage from './rooms/RoomsPage';
import StudyPage from './study/StudyPage';
import SettingsPage from './settings/SettingsPage';
import Analytics from './pages/Analytics';

const App = () => {
  const [loading, setLoading] = useState(true);

  const handleSplashFinish = () => {
    setLoading(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <SnackbarProvider>
          {loading ? (
            <SplashScreen onFinish={handleSplashFinish} />
          ) : (
            <Router>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<FeedPage />} />
                  <Route path="/discover" element={<DiscoverPage />} />
                  <Route path="/profile/:userId" element={<UserProfile />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/rooms" element={<RoomsPage />} />
                  <Route path="/study" element={<StudyPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </MainLayout>
            </Router>
          )}
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
