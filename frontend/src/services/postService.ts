
export interface PostData {
  id: string;
  author: string;
  content: string;
  isReported: boolean;
  needsReview: boolean;
}

let posts: PostData[] = [
  {
    id: '1',
    author: 'User A',
    content: 'This is a great post!',
    isReported: false,
    needsReview: false,
  },
  {
    id: '2',
    author: 'User B',
    content: 'I disagree with this post.',
    isReported: false,
    needsReview: false,
  },
  {
    id: '3',
    author: 'User C',
    content: 'This post might be controversial.',
    isReported: false,
    needsReview: false,
  },
];

export const postService = {
  async getPosts(): Promise<PostData[]> {
    return Promise.resolve(posts);
  },

  async reportPost(postId: string): Promise<PostData | null> {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.isReported = true;
      // Simulate AI-powered content moderation
      if (post.content.includes('controversial')) {
        post.needsReview = true;
      }
      return Promise.resolve(post);
    }
    return Promise.resolve(null);
  },
};
