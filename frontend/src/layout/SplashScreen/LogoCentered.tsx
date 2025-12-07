import styled from 'styled-components';
import { motion } from 'framer-motion';

const LogoContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LogoCentered = () => {
  return (
    <LogoContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Placeholder for a logo */}
      <h1 style={{ color: 'white', fontSize: '4em' }}>NENA</h1>
    </LogoContainer>
  );
};

export default LogoCentered;
