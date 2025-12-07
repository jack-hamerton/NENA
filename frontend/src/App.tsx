import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { DiscoverPage } from './discover/DiscoverPage';
import { FeedPage } from './feed/FeedPage';
import { MessagesPage } from './messages/MessagesPage';
import { RoomsPage } from './rooms/RoomsPage';
import { StudyPage } from './study/StudyPage';
import { UserProfile } from './profile/UserProfile';
import { MusicPodcastPage } from './pages/MusicPodcastPage';
import { PodcastHubPage } from './pages/PodcastHubPage';
import { Toaster } from 'react-hot-toast';
import { SplashScreen } from './layout/SplashScreen/SplashScreen';

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<FeedPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="study" element={<StudyPage />} />
          <Route path="profile/:userId" element={<UserProfile />} />
          <Route path="music" element={<MusicPodcastPage />} />
          <Route path="podcasts" element={<PodcastHubPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
