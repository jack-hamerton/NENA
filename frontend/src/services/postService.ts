import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const getForYouFeed = () => {
  return axios.get(`${API_URL}/feed/for-you`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const getFollowingFeed = () => {
  return axios.get(`${API_URL}/feed/following`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const createPost = (postData: { text: string; media_url?: string; poll?: { question: string; options: string[] } }) => {
  return axios.post(`${API_URL}/posts`, postData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const bookmarkPost = (postId: number) => {
  return axios.post(`${API_URL}/posts/${postId}/bookmark`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const unbookmarkPost = (postId: number) => {
  return axios.delete(`${API_URL}/posts/${postId}/bookmark`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const likePost = (postId: number) => {
  return axios.post(`${API_URL}/posts/${postId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const unlikePost = (postId: number) => {
  return axios.delete(`${API_URL}/posts/${postId}/like`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const createComment = (postId: number, commentData: { text: string }) => {
  return axios.post(`${API_URL}/posts/${postId}/comments`, commentData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const getCommentsForPost = (postId: number) => {
  return axios.get(`${API_URL}/posts/${postId}/comments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const reportPost = (postId: number) => {
  return axios.post(`${API_URL}/posts/${postId}/report`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const postService = {
    getForYouFeed,
    getFollowingFeed,
    createPost,
    bookmarkPost,
    unbookmarkPost,
    likePost,
    unlikePost,
    createComment,
    getCommentsForPost,
    reportPost,
};
