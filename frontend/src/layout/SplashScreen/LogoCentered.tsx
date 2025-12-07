import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const LogoCentered: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* You can replace this with your actual logo */}
        <img src="/logo.png" alt="Nena Logo" width="200" />
      </motion.div>
    </Box>
  );
};

export default LogoCentered;
