import { useState, useEffect } from 'react';
import LogoCentered from './LogoCentered';
import TaglineFadeIn from './TaglineFadeIn';
import TransitionAnimation from './TransitionAnimation';

const SplashScreen = ({ onFinish }) => {
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTransition(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <LogoCentered />
      <TaglineFadeIn />
      {showTransition && <TransitionAnimation onTransitionComplete={onFinish} />}
    </div>
  );
};

export default SplashScreen;
