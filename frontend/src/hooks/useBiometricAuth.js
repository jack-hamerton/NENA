
import { useState, useEffect } from 'react';
import { FingerprintAIO } from '@capacitor/fingerprint-auth';
import { Capacitor } from '@capacitor/core';

export const useBiometricAuth = () => {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  // Check for biometric availability when the hook is first used
  useEffect(() => {
    const checkAvailability = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const result = await FingerprintAIO.isAvailable();
          if (result.isAvailable) {
            setIsBiometricAvailable(true);
          }
        } catch (error) {
          console.error('Biometric availability check failed', error);
          setIsBiometricAvailable(false);
        }
      }
    };
    checkAvailability();
  }, []);

  // Function to trigger the biometric authentication prompt
  const authenticate = async () => {
    if (!isBiometricAvailable) {
      // This should not happen if used correctly, but it's a safe fallback.
      throw new Error('Biometric authentication is not available on this device.');
    }
    
    try {
      await FingerprintAIO.authenticate({
        reason: 'Unlock the application', // Reason displayed on the native prompt
        fallbackButtonTitle: 'Use PIN', // Button to fall back to PIN entry
        disableBackup: false, // Allows fallback to PIN
      });
      // If the above promise resolves, authentication was successful
      return true;
    } catch (error) {
      // If the promise rejects, authentication failed or was cancelled
      console.log('Biometric authentication failed', error);
      return false;
    }
  };

  return { isBiometricAvailable, authenticate };
};
