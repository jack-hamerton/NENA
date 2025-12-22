
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../layout/SplashScreen/SplashScreen';

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate('/');
  };

  return <SplashScreen onFinish={handleFinish} />;
};

export default SuccessPage;
