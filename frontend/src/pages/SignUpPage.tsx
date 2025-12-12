
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// This would be in a separate api/auth.ts file in a real application
const api = {
  sendPnv: async (phoneNumber: string, countryCode: string) => {
    const response = await fetch('/api/register/send-pnv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber, country_code: countryCode }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send verification code');
    }
    return response.json();
  },
  checkPnvAndRegister: async (
    phoneNumber: string,
    countryCode: string,
    code: string,
    email: string,
    fullName: string,
    password: str
  ) => {
    const response = await fetch('/api/register/check-pnv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pnv_in: { phone_number: phoneNumber, country_code: countryCode, code },
        user_in: { email, full_name: fullName, password, phone_number: phoneNumber, country_code: countryCode },
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to register');
    }
    return response.json();
  },
};

const steps = ['Verify Phone Number', 'Create Account'];

const SignUpPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default to +1
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.sendPnv(phoneNumber, countryCode);
      setActiveStep(1);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api.checkPnvAndRegister(
        phoneNumber,
        countryCode,
        code,
        email,
        fullName,
        password
      );
      // In a real app, you would store the token from `data.access_token`
      // in your auth context/storage.
      console.log('Registration successful', data);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth='xs'>
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Typography color='error' align='center' sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {activeStep === 0 && (
          <form onSubmit={handlePhoneSubmit}>
            <TextField
              margin='normal'
              required
              fullWidth
              label='Country Code'
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              label='Phone Number'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Send Verification Code
            </Button>
          </form>
        )}

        {activeStep === 1 && (
          <form onSubmit={handleRegisterSubmit}>
            <Typography sx={{ mt: 2, mb: 1 }}>
              Verification code sent to {countryCode} {phoneNumber}
            </Typography>
            <TextField
              margin='normal'
              required
              fullWidth
              label='Verification Code'
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
              label='Full Name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              Create Account
            </Button>
          </form>
        )}
      </Box>
    </Container>
  );
};

export default SignUpPage;

