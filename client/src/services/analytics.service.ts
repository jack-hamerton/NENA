import api from "@/lib/api";
import { EngagementStats, ChartDataPoint } from "@/types";

export const analyticsService = {
  getStats: async () => {
    const response = await api.get<EngagementStats>("/analytics/stats");
    return response.data;
  },

  getChartData: async () => {
    const response = await api.get<ChartDataPoint[]>("/analytics/chart");
    return response.data;
  },
};
