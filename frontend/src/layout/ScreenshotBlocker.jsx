import { useEffect } from 'react';
import { Box } from '@mui/material';

const ScreenshotBlocker = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screenshotting is disabled on this platform.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} className="screenshot-blocker" />;
};

export default ScreenshotBlocker;
