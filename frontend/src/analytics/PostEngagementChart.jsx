
import React, { useState, useEffect, useContext } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, CircularProgress, Alert, Box
} from '@mui/material';
import { apiClient } from '../services/apiClient';
import { AuthContext } from '../contexts/AuthContext';

const PostEngagementChart = () => {
  const { user } = useContext(AuthContext);
  const [postEngagement, setPostEngagement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("You must be logged in to view your post engagement.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // This secure endpoint should return an array of the current user's posts with engagement stats.
        const response = await apiClient.get('/api/v1/analytics/me/post-engagement');
        setPostEngagement(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to load your post engagement data. This feature may still be in development.");
        console.error('Error fetching post engagement data:', error);
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
    <Box component={Paper} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ pl: 2 }}>
        My Post Engagement
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Post</TableCell>
              <TableCell align="right">Comments</TableCell>
              <TableCell align="right">Likes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postEngagement.length > 0 ? (
              postEngagement.map((post) => (
                <TableRow key={post.post_id}>
                  <TableCell component="th" scope="row">
                    {post.text.substring(0, 100)}...
                  </TableCell>
                  <TableCell align="right">{post.comments_count}</TableCell>
                  <TableCell align="right">{post.likes_count}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>You have not created any posts yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PostEngagementChart;
