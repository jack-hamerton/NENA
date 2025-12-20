
import axios from 'axios';
import { cryptoUtils } from '../utils/crypto';

const API_URL = 'http://localhost:8000/api/v1';

const getForYouFeed = async () => {
  const response = await axios.get(`${API_URL}/feed/for-you`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  // Decrypt each post in the feed
  response.data = response.data.map(post => {
      try {
          return {
              ...post,
              content: cryptoUtils.decrypt(post.content)
          };
      } catch (e) {
          console.error("Failed to decrypt post", post, e);
          // Return the post as is, or handle the error appropriately
          return post;
      }
  });
  return response;
};

const getFollowingFeed = async () => {
  const response = await axios.get(`${API_URL}/feed/following`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  // Decrypt each post in the feed
  response.data = response.data.map(post => {
      try {
          return {
              ...post,
              content: cryptoUtils.decrypt(post.content)
          };
      } catch (e) {
          console.error("Failed to decrypt post", post, e);
          return post;
      }
  });
  return response;
};

const createPost = (postData) => {
  const encryptedPost = {
      ...postData,
      content: cryptoUtils.encrypt(postData.content)
  };
  return axios.post(`${API_URL}/posts`, encryptedPost, {
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
    const encryptedComment = {
        ...comment,
        text: cryptoUtils.encrypt(comment.text)
    };
  return axios.post(`${API_URL}/posts/${comment.postId}/comments`, encryptedComment, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

const getComments = async (postId) => {
  const response = await axios.get(`${API_URL}/posts/${postId}/comments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  // Decrypt each comment
  response.data = response.data.map(comment => {
      try {
          return {
              ...comment,
              text: cryptoUtils.decrypt(comment.text)
          };
      } catch (e) {
          console.error("Failed to decrypt comment", comment, e);
          return comment;
      }
  });
  return response;
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
