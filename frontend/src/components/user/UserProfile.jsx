import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserPodcasts } from '../../services/user.service';
import PodcastList from '../podcast/PodcastList';

export const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [showPodcasts, setShowPodcasts] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      // Assuming you have a user service to fetch user data
      // For now, we'll just set a placeholder user
      setUser({ fullName: 'John Doe', email: 'john.doe@example.com' });
    };
    fetchUser();
  }, [userId]);

  const handleShowPodcasts = async () => {
    if (!showPodcasts) {
      try {
        const response = await getUserPodcasts(userId);
        setPodcasts(response.data);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    }
    setShowPodcasts(!showPodcasts);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.fullName}</h1>
      <p>Email: {user.email}</p>
      {/* Display other user info */}

      <button onClick={handleShowPodcasts}>
        {showPodcasts ? 'Hide Podcasts' : 'Show Podcasts'}
      </button>

      {showPodcasts && <PodcastList podcasts={podcasts} />}
    </div>
  );
};
