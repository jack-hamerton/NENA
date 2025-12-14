
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Typography, CircularProgress, Alert } from '@mui/material';
import authService from '../services/auth.service';

const EmailVerificationPage = () => {
    const { token } = useParams();
    const history = useHistory();
    const [verificationStatus, setVerificationStatus] = useState('verifying');

    useEffect(() => {
        if (token) {
            authService.verifyEmail(token)
                .then(() => {
                    setVerificationStatus('success');
                    setTimeout(() => history.push('/login'), 3000); // Redirect to login after 3 seconds
                })
                .catch(() => {
                    setVerificationStatus('error');
                });
        }
    }, [token, history]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <Typography variant="h5">Email Verification</Typography>
            {verificationStatus === 'verifying' && <CircularProgress />}
            {verificationStatus === 'success' && <Alert severity="success">Email successfully verified! Redirecting to login...</Alert>}
            {verificationStatus === 'error' && <Alert severity="error">Failed to verify email. The link may be invalid or expired.</Alert>}
        </div>
    );
};

export default EmailVerificationPage;
