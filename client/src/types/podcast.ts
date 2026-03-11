export interface PodcastHost {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface TranscriptionItem {
  timestamp: string; // e.g., "00:00:01"
  text: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  host: PodcastHost | string; // Support string for backward compatibility
  coverImageUrl?: string;
  episodesCount: number;
  tags: string[];
  createdAt: string;
  followersCount?: number;
  recommendations?: Podcast[];
}

export interface Episode {
  id: string;
  podcastId: string;
  title: string;
  description?: string;
  duration: number; // in seconds
  audioUrl: string;
  videoUrl?: string;
  publishedAt: string;
  notes?: string;
  transcription?: TranscriptionItem[];
}
