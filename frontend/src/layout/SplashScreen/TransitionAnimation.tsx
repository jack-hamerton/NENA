import styled from 'styled-components';
import { motion } from 'framer-motion';

const TransitionContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.primary};
  z-index: 999;
`;

export const TransitionAnimation = () => {
  return (
    <TransitionContainer
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    />
  );
};
