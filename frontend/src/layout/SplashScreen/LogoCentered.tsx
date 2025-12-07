import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LogoCentered = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <img src="/logo.png" alt="Nena Logo" width={120} />
      <Typography variant="h4" sx={{ mt: 2, color: 'text.primary' }}>
        Nena
      </Typography>
    </Box>
  );
};

export default LogoCentered;
