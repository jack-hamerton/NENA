import React, { useEffect } from 'react';

const ScreenshotBlocker: React.FC = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'PrintScreen') {
        event.preventDefault();
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
