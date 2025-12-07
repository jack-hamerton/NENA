import styled from 'styled-components';
import GlobalSearchBox from './GlobalSearchBox';
import ResultsGrid from './ResultsGrid';

const DiscoverContainer = styled.div`
  padding: 20px;
`;

const DiscoverPage = () => {
  return (
    <DiscoverContainer>
      <GlobalSearchBox />
      <ResultsGrid />
    </DiscoverContainer>
  );
};

export default DiscoverPage;
