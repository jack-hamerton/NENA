
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

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
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
            Login
          </Typography>
          {error && (
            <Typography color='error' align='center' sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleLogin}>
            <StyledTextField
              margin='normal'
              required
              fullWidth
              label='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <StyledTextField
              margin='normal'
              required
              fullWidth
              label='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <StyledButton type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Sign In
            </StyledButton>
            <MuiLink component={Link} to='/signup' variant='body2'>
              {"Don't have an account? Sign Up"}
            </MuiLink>
          </form>
        </StyledBox>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default LoginPage;
