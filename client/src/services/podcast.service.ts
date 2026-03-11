import { Podcast, Episode } from "../types/podcast";
import { MOCK_PODCASTS, MOCK_EPISODES } from "../mock/podcasts";

// In a real application, this would point to the backend API
// const API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/v1/podcasts';

export const podcastService = {
  /**
   * Fetch all podcasts
   */
  async getPodcasts(): Promise<Podcast[]> {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_PODCASTS);
      }, 500);
    });
  },

  /**
   * Fetch a single podcast by ID
   */
  async getPodcastById(id: string): Promise<Podcast | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const podcast = MOCK_PODCASTS.find(p => p.id === id);
        resolve(podcast || null);
      }, 300);
    });
  },

  /**
   * Fetch episodes for a specific podcast
   */
  async getEpisodes(podcastId: string): Promise<Episode[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_EPISODES[podcastId] || []);
      }, 300);
    });
  },

  /**
   * Mock creating a podcast
   */
  async createPodcast(formData: FormData): Promise<Podcast> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPodcast: Podcast = {
          id: `p${Date.now()}`,
          title: formData.get('title') as string || 'New Podcast',
          description: formData.get('description') as string || '',
          host: {
            id: 'h-me',
            name: 'Current User',
          },
          episodesCount: 0,
          tags: [],
          createdAt: new Date().toISOString(),
        };
        MOCK_PODCASTS.unshift(newPodcast);
        MOCK_EPISODES[newPodcast.id] = [];
        resolve(newPodcast);
      }, 800);
    });
  }
};
