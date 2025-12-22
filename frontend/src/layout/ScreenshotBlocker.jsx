
import { useEffect } from 'react';

const ScreenshotBlocker = () => {
  useEffect(() => {
    document.body.classList.add('screenshot-blocker-active');

    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screenshotting is disabled on this platform.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('screenshot-blocker-active');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
};

export default ScreenshotBlocker;
