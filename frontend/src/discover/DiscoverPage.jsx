
import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import GlobalSearchBox from './GlobalSearchBox';
import ResultsGrid from './ResultsGrid';
import { searchService } from '../services/searchService';
import { DiscoverResult } from '../types/discover';
import { theme } from '../theme/theme';

const DiscoverContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.palette.primary};
`;

const DiscoverPage = () => {
  const [results, setResults] = useState<DiscoverResult[]>([]);

  const handleSearch = async (query: string) => {
    const searchResults = await searchService.search(query);
    setResults(searchResults);
  };

  return (
    <ThemeProvider theme={theme}>
      <DiscoverContainer>
        <GlobalSearchBox onSearch={handleSearch} />
        <ResultsGrid results={results} />
      </DiscoverContainer>
    </ThemeProvider>
  );
};

export default DiscoverPage;
