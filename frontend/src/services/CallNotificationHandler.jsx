
import React, { useEffect } from 'react';
import { callService } from './callService';
import { useSnackbar } from '../context/SnackbarContext';

const CallNotificationHandler = () => {
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const handleIncomingCall = (from) => {
      showSnackbar(`Incoming call from ${from}`, 'info');
      // Here you can also add buttons to the snackbar,
      // but that requires more complex state management.
      // For now, we'll just show a notification.
    };

    callService.on('incomingCall', handleIncomingCall);

    return () => {
      callService.off('incomingCall', handleIncomingCall);
    };
  }, [showSnackbar]);

  return null; // This component doesn't render anything
};

export default CallNotificationHandler;
