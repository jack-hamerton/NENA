import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { UserEngagement } from '../../types/analytics';

const UserEngagementChart = () => {
  const [userEngagement, setUserEngagement] = useState<UserEngagement[]>([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/analytics/user-engagement');
        const data = await response.json();
        setUserEngagement(data);
      } catch (error) {
        console.error('Error fetching user engagement data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell align="right">Posts</TableCell>
            <TableCell align="right">Comments</TableCell>
            <TableCell align="right">Following</TableCell>
            <TableCell align="right">Followers</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userEngagement.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell component="th" scope="row">
                {user.full_name}
              </TableCell>
              <TableCell align="right">{user.posts_count}</TableCell>
              <TableCell align="right">{user.comments_count}</TableCell>
              <TableCell align="right">{user.following_count}</TableCell>
              <TableCell align="right">{user.followers_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserEngagementChart;
