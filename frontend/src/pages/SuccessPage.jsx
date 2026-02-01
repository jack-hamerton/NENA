
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../layout/SplashScreen/SplashScreen';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate('/home');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <SplashScreen onFinish={handleFinish} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#ffffff',
          pointerEvents: 'none',
          gap: '0.5rem',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '0.04em' }}>Success</h1>
        <p style={{ margin: 0, fontSize: '1rem', opacity: 0.85 }}>
          You are signed in.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
