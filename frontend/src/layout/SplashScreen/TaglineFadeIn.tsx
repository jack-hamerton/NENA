import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

const TaglineFadeIn = () => {
  return (
    <Typography
      component={motion.p}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      variant="h6"
      sx={{ color: 'text.secondary', mt: 1 }}
    >
      Connecting Minds, Building Futures.
    </Typography>
  );
};

export default TaglineFadeIn;
