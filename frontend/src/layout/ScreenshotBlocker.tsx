import { useEffect } from 'react';

const ScreenshotBlocker = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key === 'S')) {
        e.preventDefault();
        alert('Screenshots are disabled on this page.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
};

export default ScreenshotBlocker;
