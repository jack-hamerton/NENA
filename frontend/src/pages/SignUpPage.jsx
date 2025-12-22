
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleRegister = async (username, password, email) => {
    setError('');
    try {
      await register(username, password, email);
      navigate('/success');
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
          <Typography color='error' align='center' sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <RegisterForm onSubmit={handleRegister} />
      </Box>
    </Container>
  );
};

export default SignUpPage;
