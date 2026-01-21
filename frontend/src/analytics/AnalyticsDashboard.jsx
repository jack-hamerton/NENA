
import React from 'react';
import { Box, Typography } from '@mui/material';
import UserEngagementChart from './UserEngagementChart';
import PostEngagementChart from './PostEngagementChart';
import AdvocacyImpactMatrix from './AdvocacyImpactMatrix';

const AnalyticsDashboard = ({ userId }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      
      {/* New Advocacy Impact Matrix */}
      <Box sx={{ mb: 4 }}>
        <AdvocacyImpactMatrix userId={userId} />
      </Box>

      {/* Existing Charts */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          User Engagement
        </Typography>
        <UserEngagementChart />
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom>
          Post Engagement
        </Typography>
        <PostEngagementChart />
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;
