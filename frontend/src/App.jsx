
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import FloatingNav from './layout/FloatingNav';
import SplashScreen from './layout/SplashScreen/SplashScreen';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile'; 
import ProfilePage from './pages/ProfilePage';
import FollowList from './components/FollowList'; 
import * as userService from './services/user.service';
import DiscoverPage from './discover/DiscoverPage';
import MessagesPage from './messages/MessagesPage';
import RoomsPage from './rooms/RoomsPage';
import { Room } from './rooms/Room';
import Podcasts from './pages/Podcasts';
import PodcastPlayer from './components/podcast/PodcastPlayer';
import { theme } from './theme/theme';


// --- Placeholder Pages ---
const StudyPage = () => <div>Study Page</div>;
const CalendarPage = () => <div>Calendar Page</div>;
const CreatePodcastPage = () => <div>Create Podcast Page</div>;
const PrivacySettingsPage = () => <div>Privacy Settings Page</div>;

const AppContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding-left: 100px; /* Space for the floating nav */
  padding-right: 2rem;
`;

const FollowerList = () => {
  const { username } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const userRes = await userService.getUserByUsername(username);
        // Assuming the API returns a nested object with user details
        setUsers(userRes.data.followers.map(f => f.follower)); 
      } catch (error) {
        console.error("Failed to fetch followers:", error);
      }
    };

    fetchFollowers();
  }, [username]);

  return <FollowList title="Followers" users={users} />;
};

const FollowingList = () => {
  const { username } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const userRes = await userService.getUserByUsername(username);
        // Assuming the API returns a nested object with user details
        setUsers(userRes.data.following.map(f => f.followed)); 
      } catch (error) {
        console.error("Failed to fetch following:", error);
      }
    };

    fetchFollowing();
  }, [username]);

  return <FollowList title="Following" users={users} />;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
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
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/user/:username" element={<UserProfile />} />
              <Route path="/user/:username/followers" element={<FollowerList />} />
              <Route path="/user/:username/following" element={<FollowingList />} />
              <Route path="/podcast/create" element={<CreatePodcastPage />} />
              <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App;
