import api from "@/lib/api";
import { Podcast, PodcastSummary } from "@/types/podcast";

export const podcastService = {
  getPodcasts: async () => {
    const response = await api.get<PodcastSummary[]>("/podcasts");
    return response.data;
  },

  getPodcastById: async (id: string) => {
    const response = await api.get<Podcast>(`/podcasts/${id}`);
    return response.data;
  },

  getTopPodcasts: async (type: "listened" | "viewed", region: string = "US") => {
    const response = await api.get<PodcastSummary[]>(`/podcasts/top`, {
      params: { type, region }
    });
    return response.data;
  },

  searchPodcasts: async (query: string) => {
    const response = await api.get<PodcastSummary[]>("/podcasts/search", {
      params: { q: query }
    });
    return response.data;
  }
};
