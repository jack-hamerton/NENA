import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PostEngagementChart = () => {
  const [postEngagement, setPostEngagement] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/analytics/post-engagement');
        const data = await response.json();
        setPostEngagement(data);
      } catch (error) {
        console.error('Error fetching post engagement data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Post</TableCell>
            <TableCell>Author</TableCell>
            <TableCell align="right">Comments</TableCell>
            <TableCell align="right">Likes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {postEngagement.map((post) => (
            <TableRow key={post.post_id}>
              <TableCell component="th" scope="row">
                {post.text}
              </TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell align="right">{post.comments_count}</TableCell>
              <TableCell align="right">{post.likes_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostEngagementChart;
