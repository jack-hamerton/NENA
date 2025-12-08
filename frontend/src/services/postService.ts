import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const getForYouFeed = () => {
  return axios.get(`${API_URL}/feed/for-you`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const getFollowingFeed = () => {
  return axios.get(`${API_URL}/feed/following`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const createPost = (postData: { text: string; media_url?: string }) => {
  return axios.post(`${API_URL}/posts`, postData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const bookmarkPost = (postId: number) => {
  return axios.post(`${API_URL}/posts/${postId}/bookmark`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const unbookmarkPost = (postId: number) => {
  return axios.delete(`${API_URL}/posts/${postId}/bookmark`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};
