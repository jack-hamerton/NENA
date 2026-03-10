import { User, Post, Room } from "./index";

export type SearchType = "users" | "posts" | "hashtags" | "rooms";

export interface Hashtag {
  name: string;
  postCount: number;
}

export interface SearchResult {
  users?: User[];
  posts?: Post[];
  hashtags?: Hashtag[];
  rooms?: Room[];
}

export interface DiscoverSearchResponse {
  data: User[] | Post[] | Hashtag[] | Room[];
}
