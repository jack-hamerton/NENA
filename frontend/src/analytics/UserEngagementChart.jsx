
import React, { useState, useEffect, useContext } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, CircularProgress, Alert, Box
} from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const UserEngagementChart = () => {
  const { user } = useContext(AuthContext);
  const [engagementData, setEngagementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("You must be logged in to view your engagement metrics.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // This secure endpoint should return an object with the current user's engagement stats.
        const response = await api.get('/analytics/me/engagement');
        setEngagementData(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to load your engagement data. This feature may still be in development.");
        console.error('Error fetching user engagement data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box component={Paper} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ pl: 2 }}>
        My Engagement
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell align="right">Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {engagementData ? (
              <>
                <TableRow>
                  <TableCell>Posts Created</TableCell>
                  <TableCell align="right">{engagementData.posts_count}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Comments Made</TableCell>
                  <TableCell align="right">{engagementData.comments_count}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Following</TableCell>
                  <TableCell align="right">{engagementData.following_count}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Followers</TableCell>
                  <TableCell align="right">{engagementData.followers_count}</TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No engagement data available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserEngagementChart;
