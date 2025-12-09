export interface PostEngagement {
    post_id: string;
    text: string;
    author: string;
    comments_count: number;
    likes_count: number;
}

export interface UserEngagement {
    user_id: string;
    full_name: string;
    posts_count: number;
    comments_count: number;
    following_count: number;
    followers_count: number;
}
