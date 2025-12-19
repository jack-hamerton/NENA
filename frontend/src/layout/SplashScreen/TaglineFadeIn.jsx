import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

const TaglineFadeIn = () => {
  const tagline = "Dialogue spark change";
  const words = tagline.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <Typography
      component={motion.p}
      variants={container}
      initial="hidden"
      animate="visible"
      variant="h6"
      sx={{ color: 'text.secondary', mt: 1, display: 'flex', justifyContent: 'center' }}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "5px" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </Typography>
  );
};

export default TaglineFadeIn;
