import { postService } from '../services/postService';

export const usePosts = () => {
  const getForYouFeed = async () => {
    return await postService.getForYouFeed();
  };

  const getFollowingFeed = async () => {
    return await postService.getFollowingFeed();
  };

  const createPost = async (postData: { text: string; media_url?: string; poll?: { question: string; options: string[] } }) => {
    return await postService.createPost(postData);
  };

  const likePost = async (postId: number) => {
    return await postService.likePost(postId);
  };

  const unlikePost = async (postId: number) => {
    return await postService.unlikePost(postId);
  };

  const getCommentsForPost = async (postId: number) => {
    return await postService.getCommentsForPost(postId);
  };

  return { getForYouFeed, getFollowingFeed, createPost, likePost, unlikePost, getCommentsForPost };
};
