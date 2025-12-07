import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/core/Home';
import { NotFound } from './components/core/NotFound';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Post } from './components/post/Post';
import { UserProfile } from './components/user/UserProfile';
import { Room } from './components/room/Room';
import { PodcastPlayer } from './components/podcast/PodcastPlayer';
import { Calendar } from './components/calendar/Calendar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:postId" element={<Post />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/rooms/:roomId" element={<Room />} />
        <Route path="/podcasts/:podcastId" element={<PodcastPlayer />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
