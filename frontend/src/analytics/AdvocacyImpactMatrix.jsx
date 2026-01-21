
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, CircularProgress, Alert } from '@mui/material';
import { apiClient } from '../services/apiClient'; // Assuming you have a pre-configured axios instance

const AdvocacyImpactMatrix = ({ userId }) => {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // This endpoint needs to be created on your backend.
        // It should return a 3x3 matrix and a recommendation.
        const response = await apiClient.get(`/api/v1/analytics/advocacy-matrix/${userId}`);
        setMatrixData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load advocacy impact data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const yAxis = ['Awareness', 'Will', 'Action'];
  const xAxis = ['Public', 'Influencers', 'Stakeholders'];

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!matrixData) {
    return <Typography>No data available to display the Advocacy Impact Matrix.</Typography>;
  }

  // Find the max value in the matrix for scaling the bubble sizes
  const maxVal = Math.max(...matrixData.matrix.flat(), 1);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" component="h3" gutterBottom>
        Your Advocacy Impact Matrix
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This matrix visualizes your advocacy efforts across different stages and audiences. The size of the circle represents your activity level in each area.
      </Typography>
      <Grid container spacing={0}>
        {/* Y-Axis Labels */}
        <Grid item xs={3} container direction="column" justifyContent="space-around" alignItems="center">
          {yAxis.map(label => (
            <Grid item key={label} sx={{ height: '100px' }}>
              <Typography variant="subtitle2" sx={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>{label}</Typography>
            </Grid>
          ))}
        </Grid>

        {/* Matrix Grid */}
        <Grid item xs={9}>
          <Grid container spacing={0}>
            {matrixData.matrix.flat().map((value, index) => {
              const scale = Math.max(0.1, value / maxVal); // Ensure even 0-value cells are slightly visible
              return (
                <Grid item xs={4} key={index} sx={{ border: '1px solid #e0e0e0', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Box
                    sx={{
                      width: `${scale * 80}%`,
                      height: `${scale * 80}%`,
                      backgroundColor: `rgba(74, 89, 105, ${scale})`, // Using your primary color
                      borderRadius: '50%',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                   <Typography variant="h6" sx={{ position: 'absolute', color: scale > 0.5 ? 'white' : 'black' }}>{value}</Typography>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        
        {/* X-Axis Labels */}
        <Grid item xs={3} />
        <Grid item xs={9} container>
          {xAxis.map(label => (
            <Grid item xs={4} key={label} sx={{ textAlign: 'center', pt: 1 }}>
              <Typography variant="subtitle2">{label}</Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
      
      {/* Recommendation Section */}
      <Box mt={4} p={2} sx={{ backgroundColor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>Next Step Recommendation</Typography>
        <Typography variant="body1">
          {matrixData.recommendation}
        </Typography>
      </Box>
    </Paper>
  );
};

export default AdvocacyImpactMatrix;
