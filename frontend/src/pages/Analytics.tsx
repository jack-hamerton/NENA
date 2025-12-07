import React from 'react';
import { Grid, Typography } from '@mui/material';
import UserEngagementChart from '../analytics/UserEngagementChart';
import PostEngagementChart from '../analytics/PostEngagementChart';

const Analytics = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            User Engagement
          </Typography>
          <UserEngagementChart />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Post Engagement
          </Typography>
          <PostEngagementChart />
        </Grid>
      </Grid>
    </div>
  );
};

export default Analytics;
