import styled from 'styled-components';
import { motion } from 'framer-motion';

const LogoContainer = styled(motion.div)`
  // Add your logo styles here
`;

export const LogoCentered = () => {
  return (
    <LogoContainer
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Your Logo SVG or Image */}
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="4" fill="transparent" />
      </svg>
    </LogoContainer>
  );
};
