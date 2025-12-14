
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

// This would be in a separate api/auth.js file
const api = {
  login: async (email, password) => {
    const response = await fetch('/api/login/access-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to login');
    }
    return response.json();
  },
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.login(email, password);
      // In a real app, you would store the token from `data.access_token`
      // in your auth context/storage and likely redirect to a dashboard.
      console.log('Login successful', data);
      // For now, just navigating to a placeholder 'home' page
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component='h1' variant='h5'>
          Login
        </Typography>
        {error && (
          <Typography color='error' align='center' sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            margin='normal'
            required
            fullWidth
            label='Email Address'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <MuiLink component={Link} to='/signup' variant='body2'>
            {"Don't have an account? Sign Up"}
          </MuiLink>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
