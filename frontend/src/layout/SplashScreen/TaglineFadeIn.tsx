import styled from 'styled-components';
import { motion } from 'framer-motion';

const TaglineContainer = styled(motion.div)`
  text-align: center;
  margin-top: 20px;
`;

const Tagline = styled.h2`
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.body};
  font-size: 1.5em;
  font-style: italic;
`;

const TaglineFadeIn = () => {
  return (
    <TaglineContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 1 }}
    >
      <Tagline>Connecting Minds, Building Futures</Tagline>
    </TaglineContainer>
  );
};

export default TaglineFadeIn;
