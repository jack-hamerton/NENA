
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/podcasts';

const checkFollowStatus = (podcastId, userId) => {
  return axios.get(`${API_URL}/${podcastId}/followers/${userId}`);
};

const followPodcast = (podcastId, userId) => {
  return axios.post(`${API_URL}/${podcastId}/follow`, { userId });
};

const unfollowPodcast = (podcastId, userId) => {
  return axios.delete(`${API_URL}/${podcastId}/unfollow`, { data: { userId } });
};

export { checkFollowStatus, followPodcast, unfollowPodcast };
