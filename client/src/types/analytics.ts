export interface EngagementStats {
  views: number;
  likes: number;
  followers: number;
  engagementRate: number;
  change: {
    views: number;
    likes: number;
    followers: number;
    rate: number;
  };
}

export interface ChartDataPoint {
  date: string;
  value: number;
}
