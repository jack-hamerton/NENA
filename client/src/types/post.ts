export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  title?: string;
  content: string;
  mediaUrl?: string;
  likesCount: number;
  dislikesCount?: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isReported?: boolean;
  hashtags?: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}
