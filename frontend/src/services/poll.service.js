
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/polls';

const getPolls = (episodeId) => {
  return axios.get(`${API_URL}/episode/${episodeId}`);
};

const voteOnPoll = (pollId, optionId) => {
  return axios.post(`${API_URL}/${pollId}/vote/${optionId}`);
};

export { getPolls, voteOnPoll };
