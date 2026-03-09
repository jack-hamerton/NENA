import api from "@/lib/api";
import { Podcast, Episode } from "@/types";

export const podcastService = {
  getPodcasts: async () => {
    const response = await api.get<Podcast[]>("/podcasts");
    return response.data;
  },

  getEpisodes: async (podcastId: string) => {
    const response = await api.get<Episode[]>(`/podcasts/${podcastId}/episodes`);
    return response.data;
  },
};
