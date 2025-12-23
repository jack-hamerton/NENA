
import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import GlobalSearchBox from './GlobalSearchBox';
import ResultsGrid from './ResultsGrid';
import { searchService } from '../services/searchService';
import { theme } from '../theme/theme';

const DiscoverContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.palette.dark};
  min-height: 100vh;
`;

const DiscoverPage = () => {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
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
