import { ThemeProvider } from 'styled-components';
import { royalBlue } from './theme/royalBlue';
import MainLayout from './layout/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DiscoverPage from './discover/DiscoverPage';
import FeedPage from './feed/FeedPage';
import MessagesPage from './messages/MessagesPage';
import RoomsPage from './rooms/RoomsPage';
import StudyPage from './study/StudyPage';
import UserProfile from './profile/UserProfile';
import MusicPodcastPage from './pages/MusicPodcastPage';
import PodcastHubPage from './pages/PodcastHubPage';

function App() {
  return (
    <ThemeProvider theme={royalBlue}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/music" element={<MusicPodcastPage />} />
            <Route path="/podcasts" element={<PodcastHubPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
