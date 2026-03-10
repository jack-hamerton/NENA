export interface Episode {
  id: string;
  podcastId: string;
  title: string;
  description: string;
  audioUrl: string;
  videoUrl?: string;
  duration: number; // in seconds
  releaseDate: string;
  transcription?: string;
  notes?: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  imageUrl: string;
  category: string;
  episodes: Episode[];
  recommendations?: string[]; // IDs of recommended podcasts
  createdAt: string;
  updatedAt: string;
}

export interface PodcastSummary {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  category: string;
  episodeCount: number;
}
