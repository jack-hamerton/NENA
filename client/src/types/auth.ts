export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  role?: string;
  tagline?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
