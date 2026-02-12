
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/profile';

const getProfileData = (userId) => {
  return axios.get(`${API_URL}/${userId}/follower-web`);
};

const profileService = {
    getProfileData,
};

export default profileService;
