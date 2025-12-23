
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../theme/theme';

const StyledContainer = styled(Container)`
  background-color: ${props => props.theme.palette.dark};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.palette.primary};
  padding: 2rem;
  border-radius: 8px;
  color: ${props => props.theme.text.primary};
`;

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
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth='xs'>
        <StyledBox sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component='h1' variant='h5'>
            Sign Up
          </Typography>
          {error && (
            <Typography color='error' align='center' sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <RegisterForm onSubmit={handleRegister} />
        </StyledBox>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default SignUpPage;
