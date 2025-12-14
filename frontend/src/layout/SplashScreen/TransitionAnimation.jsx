import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const TransitionAnimation = ({ onTransitionComplete }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      onAnimationComplete={onTransitionComplete}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'background.default',
        zIndex: 9999,
      }}
    />
  );
};

export default TransitionAnimation;
