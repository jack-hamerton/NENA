
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card, CardContent } from '@mui/material';
import api from '../utils/api'; // Assuming a utility for API calls

// Placeholder components for detailed analytics - in a real app, these would be in separate files
const EngagementMetricsCard = ({ data }) => (
    <Card>
        <CardContent>
            <Typography variant="h6">Key Metrics</Typography>
            <Typography>Total Engagements: {data.total_engagements}</Typography>
            <Typography>Engagement Rate: {data.engagement_rate.toFixed(2)}%</Typography>
        </CardContent>
    </Card>
);

const ContentTypePerformanceChart = ({ data }) => (
    <Card>
        <CardContent>
            <Typography variant="h6">Content Performance</Typography>
            {data.map(item => (
                <Typography key={item.content_type}>{item.content_type}: {item.average_engagement.toFixed(2)} avg. engagement</Typography>
            ))}
        </CardContent>
    </Card>
);

const TopPostsList = ({ data }) => (
    <Card>
        <CardContent>
            <Typography variant="h6">Top Posts</Typography>
            {data.map(post => (
                <Typography key={post.post_id}>{post.text.substring(0, 30)}... - {post.engagement_rate} engagements</Typography>
            ))}
        </CardContent>
    </Card>
);


const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/analytics/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics dashboard", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Loading analytics...</Typography>;
  }

  if (!dashboardData) {
    return <Typography>Could not load analytics data.</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <EngagementMetricsCard data={dashboardData.engagement_metrics} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ContentTypePerformanceChart data={dashboardData.content_type_performance} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TopPostsList data={dashboardData.top_posts} />
        </Grid>
        {/* Add more components for other analytics data as needed */}
      </Grid>
    </div>
  );
};

export default Analytics;
