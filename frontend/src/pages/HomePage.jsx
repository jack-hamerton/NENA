
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Container maxWidth='md'>
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Welcome to the App!
        </Typography>
        <Typography variant='body1' sx={{ mb: 4 }}>
          You have successfully logged in and can now access the app&apos;s features.
        </Typography>
        <Button variant='contained' color='primary' onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
