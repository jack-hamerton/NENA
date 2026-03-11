export interface PodcastHost {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface TranscriptionItem {
  timestamp: string; // e.g., "00:00:01"
  text: string;
}

export interface Episode {
  id: string;
  podcastId: string;
  title: string;
  description: string;
  audioUrl: string;
  videoUrl?: string;
  duration: number; // in seconds
  releaseDate: string;
  publishedAt?: string; // Supporting both aliases
  notes?: string;
  transcription?: string | TranscriptionItem[];
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  host?: PodcastHost | string; // Supporting both for compatibility
  imageUrl: string;
  coverImageUrl?: string;
  category: string;
  episodes: Episode[];
  episodesCount: number;
  tags: string[];
  followersCount?: number;
  recommendations?: string[] | Podcast[]; // IDs or full objects
  createdAt: string;
  updatedAt: string;
}

export interface PodcastSummary {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  episodeCount: number;
}
