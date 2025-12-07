import React from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

const TaglineFadeIn: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    >
      <Typography variant="h5" align="center">
        Connect. Collaborate. Create.
      </Typography>
    </motion.div>
  );
};

export default TaglineFadeIn;
