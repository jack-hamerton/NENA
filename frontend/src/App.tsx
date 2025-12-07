import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { xiaoGenshin } from './theme/xiaoGenshin';
import MainLayout from './layout/MainLayout';
import DiscoverPage from './discover/DiscoverPage';
import UserProfile from './profile/UserProfile';
import FeedPage from './feed/FeedPage';
import MessagesPage from './messages/MessagesPage';
import RoomsPage from './rooms/RoomsPage';
import StudyPage from './study/StudyPage';
import MusicPodcastPage from './pages/MusicPodcastPage';
import PodcastHubPage from './pages/PodcastHubPage';
import SplashScreen from './layout/SplashScreen/SplashScreen'; // Assuming you have this component

function App() {
  return (
    <ThemeProvider theme={xiaoGenshin}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<FeedPage />} />
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="profile/:userId" element={<UserProfile />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="study" element={<StudyPage />} />
            <Route path="music" element={<MusicPodcastPage />} />
            <Route path="podcasts" element={<PodcastHubPage />} />
          </Route>
          <Route path="/splash" element={<SplashScreen />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
