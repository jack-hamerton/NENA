export interface UserEngagement {
    user_id: number;
    full_name: string;
    posts_count: number;
    comments_count: number;
    following_count: number;
    followers_count: number;
}

export interface PostEngagement {
    post_id: number;
    text: string;
    author: string;
    comments_count: number;
    likes_count: number;
}
