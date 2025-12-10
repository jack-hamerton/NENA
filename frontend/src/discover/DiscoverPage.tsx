
import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalSearchBox from './GlobalSearchBox';
import ResultsGrid from './ResultsGrid';
import { searchService } from '../services/searchService';
import { DiscoverResult } from '../types/discover';

const DiscoverContainer = styled.div`
  padding: 2rem;
`;

const DiscoverPage = () => {
  const [results, setResults] = useState<DiscoverResult[]>([]);

  const handleSearch = async (query: string) => {
    const searchResults = await searchService.search(query);
    setResults(searchResults);
  };

  return (
    <DiscoverContainer>
      <GlobalSearchBox onSearch={handleSearch} />
      <ResultsGrid results={results} />
    </DiscoverContainer>
  );
};

export default DiscoverPage;
