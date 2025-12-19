
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

const createPost = (postData) => {
  return axios.post(`${API_URL}/posts`, postData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const bookmarkPost = (postId) => {
  return axios.post(`${API_URL}/posts/${postId}/bookmark`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const unbookmarkPost = (postId) => {
  return axios.delete(`${API_URL}/posts/${postId}/bookmark`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const likePost = (postId) => {
  return axios.post(`${API_URL}/posts/${postId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const unlikePost = (postId) => {
  return axios.post(`${API_URL}/posts/${postId}/unlike`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const addComment = (comment) => {
  return axios.post(`${API_URL}/posts/${comment.postId}/comments`, comment, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const getComments = (postId) => {
  return axios.get(`${API_wURL}/posts/${postId}/comments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const reportPost = (postId) => {
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
    addComment,
    getComments,
    reportPost,
};
