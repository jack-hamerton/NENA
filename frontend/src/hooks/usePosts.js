import { postService } from '../services/postService';

export const usePosts = () => {
  const getForYouFeed = async () => {
    return await postService.getForYouFeed();
  };

  const getFollowingFeed = async () => {
    return await postService.getFollowingFeed();
  };

  const createPost = async (postData) => {
    return await postService.createPost(postData);
  };

  const likePost = async (postId) => {
    return await postService.likePost(postId);
  };

  const unlikePost = async (postId) => {
    return await postService.unlikePost(postId);
  };

  const getCommentsForPost = async (postId) => {
    return await postService.getCommentsForPost(postId);
  };

  const reportPost = async (postId) => {
    return await postService.reportPost(postId);
  };

  return { getForYouFeed, getFollowingFeed, createPost, likePost, unlikePost, getCommentsForPost, reportPost };
};
