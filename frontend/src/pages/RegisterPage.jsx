
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
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        {error && (
          <Typography color='error' align='center' sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleRegister}>
          <TextField
            margin='normal'
            required
            fullWidth
            label='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label='Email Address'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <TextField
            margin='normal'
            required
            fullWidth
            label='Confirm Password'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <MuiLink component={Link} to='/login' variant='body2'>
            {"Already have an account? Sign In"}
          </MuiLink>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;
