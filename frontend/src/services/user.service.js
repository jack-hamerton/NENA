
import api from './api';

export const getMe = () => {
    return api.get('/users/me');
};

export const getUserById = (id) => {
    return api.get(`/users/${id}`);
};

export const getFollowers = (id) => {
    return api.get(`/users/${id}/followers`);
};

export const getFollowersOfFollowers = (id) => {
    return api.get(`/users/${id}/followers-of-followers`);
};

export const followUser = (id, intent) => {
    return api.post(`/users/${id}/follow`, { intent });
};

export const getUserPosts = (id) => {
    return api.get(`/users/${id}/posts`);
};

export const getUserPodcasts = (id) => {
    return api.get(`/users/${id}/podcasts`);
};

export const getFollowerIntentMetrics = (id) => {
    return api.get(`/users/${id}/follower-intent-metrics`);
};

export const getUserHashtagMetrics = (id) => {
    return api.get(`/users/${id}/hashtag-metrics`);
};

export const getUserBadges = (id) => {
    return api.get(`/users/${id}/badges`);
};

export const updateProfile = (id, profileData) => {
    return api.put(`/profile/${id}`, profileData);
};
