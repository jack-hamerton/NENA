import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { xiaoGenshin } from './theme/xiaoGenshin';
import SplashScreen from './layout/SplashScreen/SplashScreen';
import MainLayout from './layout/MainLayout';
import FeedPage from './feed/FeedPage';
import DiscoverPage from './discover/DiscoverPage';
import UserProfile from './profile/UserProfile';
import MessagesPage from './messages/MessagesPage';
import RoomsPage from './rooms/RoomsPage';
import StudyPage from './study/StudyPage';
import MusicPage from './music/MusicPage';
import PodcastsPage from './podcasts/PodcastsPage';

function App() {
  return (
    <ThemeProvider theme={xiaoGenshin}>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<FeedPage />} />
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="profile/:userId" element={<UserProfile />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="study" element={<StudyPage />} />
            <Route path="music" element={<MusicPage />} />
            <Route path="podcasts" element={<PodcastsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
