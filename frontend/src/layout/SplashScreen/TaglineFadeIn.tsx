import styled from 'styled-components';
import { motion } from 'framer-motion';

const TaglineContainer = styled(motion.div)`
  margin-top: 20px;
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

export const TaglineFadeIn = () => {
  return (
    <TaglineContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      Connecting Minds, Creating Futures
    </TaglineContainer>
  );
};
