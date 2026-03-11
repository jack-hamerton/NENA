import api from "@/lib/api";
import { AdvocacyMatrix, UserEngagement, PostEngagement, EngagementStats, ChartDataPoint } from "@/types/analytics";

export const analyticsService = {
  getStats: async () => {
    const response = await api.get<EngagementStats>("/analytics/stats");
    return response.data;
  },

  getChartData: async () => {
    const response = await api.get<ChartDataPoint[]>("/analytics/chart");
    return response.data;
  },

  getAdvocacyMatrix: async (userId: string) => {
    const response = await api.get<AdvocacyMatrix>(`/analytics/advocacy-matrix/${userId}`);
    return response.data;
  },

  getUserEngagement: async () => {
    const response = await api.get<UserEngagement[]>("/analytics/user-engagement");
    return response.data;
  },

  getPostEngagement: async () => {
    const response = await api.get<PostEngagement[]>("/analytics/post-engagement");
    return response.data;
  },
};
