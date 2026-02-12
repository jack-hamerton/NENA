
import React from 'react';
import { Box, Typography } from '@mui/material';
import UserEngagementChart from './UserEngagementChart';
import PostEngagementChart from './PostEngagementChart';
import AdvocacyImpactMatrix from './AdvocacyImpactMatrix';

// The component now accepts a `showTitle` prop to make it embeddable.
const AnalyticsDashboard = ({ showTitle = true }) => {
  return (
    <Box sx={{ p: 3 }}>
      {showTitle && (
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
      )}
      
      {/* The AdvocacyImpactMatrix now securely gets the user from AuthContext. */}
      <Box sx={{ mb: 4 }}>
        <AdvocacyImpactMatrix />
      </Box>

      {/* The UserEngagementChart now securely gets the user from AuthContext. */}
      <Box sx={{ mb: 4 }}>
        <UserEngagementChart />
      </Box>

      {/* The PostEngagementChart now securely gets the user from AuthContext. */}
      <Box>
        <PostEngagementChart />
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;
