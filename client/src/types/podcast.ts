export interface Podcast {
  id: string;
  title: string;
  description: string;
  host: string;
  coverImageUrl?: string;
  episodesCount: number;
  tags: string[];
  createdAt: string;
}

export interface Episode {
  id: string;
  podcastId: string;
  title: string;
  duration: number; // in seconds
  audioUrl: string;
  publishedAt: string;
}
