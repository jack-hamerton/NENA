import api from "@/lib/api";
import { Podcast, Episode, PodcastSummary } from "@/types/podcast";
// import { MOCK_PODCASTS, MOCK_EPISODES } from "../mock/podcasts";

/**
 * Service for handling podcast-related API calls and mock data.
 */
export const podcastService = {
  /**
   * Fetch all podcasts
   */
  async getPodcasts(): Promise<PodcastSummary[]> {
    try {
      const response = await api.get<PodcastSummary[]>("/podcasts");
      return response.data;
    } catch {
      // Fallback to mock for development
      /*
      return MOCK_PODCASTS.map(p => ({
        id: p.id,
        title: p.title,
        author: p.host.name,
        thumbnailUrl: p.imageUrl || "/podcasts/default.png",
        duration: "0:00",
        category: p.tags?.[0] || "General"
      }));
      */
      return [];
    }
  },

  /**
   * Fetch a single podcast by ID
   */
  async getPodcastById(id: string): Promise<Podcast | null> {
    try {
      const response = await api.get<Podcast>(`/podcasts/${id}`);
      return response.data;
    } catch {
      // return MOCK_PODCASTS.find(p => p.id === id) || null;
      return null;
    }
  },

  /**
   * Fetch episodes for a specific podcast
   */
  async getEpisodes(podcastId: string): Promise<Episode[]> {
    try {
      const response = await api.get<Episode[]>(`/podcasts/${podcastId}/episodes`);
      return response.data;
    } catch {
      // return MOCK_EPISODES[podcastId] || [];
      return [];
    }
  },

  /**
   * Fetch top podcasts by type (listened or viewed)
   */
  async getTopPodcasts(type: "listened" | "viewed", region: string = "US"): Promise<PodcastSummary[]> {
    try {
      const response = await api.get<PodcastSummary[]>(`/podcasts/top`, {
        params: { type, region }
      });
      return response.data;
    } catch {
      return [];
    }
  },

  /**
   * Search podcasts by query string
   */
  async searchPodcasts(query: string): Promise<PodcastSummary[]> {
    try {
      const response = await api.get<PodcastSummary[]>("/podcasts/search", {
        params: { q: query }
      });
      return response.data;
    } catch {
      return [];
    }
  },

  /**
   * Create a new podcast
   */
  async createPodcast(formData: FormData): Promise<Podcast> {
    const response = await api.post<Podcast>("/podcasts", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
