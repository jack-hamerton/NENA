
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Button } from '@mui/material';

const api = {
  verifyEmail: async (token: string, email: string) => {
    const response = await fetch(`/api/verify-email?token=${token}&email=${email}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Email verification failed');
    }
    return response.json();
  },
};

const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setVerificationStatus('failed');
      setError('Missing verification token or email.');
      return;
    }

    const verify = async () => {
      try {
        await api.verifyEmail(token, email);
        setVerificationStatus('success');
      } catch (err: any) {
        setVerificationStatus('failed');
        setError(err.message);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <Container maxWidth='xs'>
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant='h5' component='h1' gutterBottom>
          Email Verification
        </Typography>
        {verificationStatus === 'verifying' && (
          <Box>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Verifying your email...</Typography>
          </Box>
        )}
        {verificationStatus === 'success' && (
          <Box>
            <Typography color='primary' sx={{ mt: 2 }}>
              Email successfully verified!
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Proceed to Login
            </Button>
          </Box>
        )}
        {verificationStatus === 'failed' && (
          <Box>
            <Typography color='error' sx={{ mt: 2 }}>
              Verification Failed: {error}
            </Typography>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => navigate('/signup')}
              sx={{ mt: 2 }}
            >
              Return to Sign Up
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default EmailVerificationPage;
