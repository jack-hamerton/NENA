
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';
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

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    color: ${(props) => props.theme.text.primary};
    background-color: ${(props) => props.theme.palette.dark};
  }
  .MuiInputLabel-root {
    color: ${(props) => props.theme.text.secondary};
  }
  .MuiOutlinedInput-root {
    fieldset {
      border-color: ${(props) => props.theme.palette.secondary};
    }
    &:hover fieldset {
      border-color: ${(props) => props.theme.palette.accent};
    }
    &.Mui-focused fieldset {
      border-color: ${(props) => props.theme.palette.accent};
    }
  }
`;

const StyledButton = styled(Button)`
  background-color: ${props => props.theme.palette.accent};
  &:hover {
    background-color: ${props => props.theme.palette.secondary};
  }
`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await resetPassword(email);
      setMessage('Check your inbox for further instructions.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer maxWidth='xs'>
        <StyledBox sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component='h1' variant='h5'>
            Reset Password
          </Typography>
          {error && (
            <Typography color='error' align='center' sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {message && (
            <Typography color='success' align='center' sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <StyledTextField
              margin='normal'
              required
              fullWidth
              label='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <StyledButton type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Reset Password
            </StyledButton>
            <MuiLink component={Link} to='/login' variant='body2'>
              Back to Login
            </MuiLink>
          </form>
        </StyledBox>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default ForgotPasswordPage;
