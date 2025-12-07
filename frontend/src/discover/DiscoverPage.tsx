import React, { useState } from 'react';
import { Box } from '@mui/material';
import GlobalSearchBox from './GlobalSearchBox';
import ResultsGrid from './ResultsGrid';
import { DiscoverResult } from '../types/discover';

const DiscoverPage: React.FC = () => {
  const [results, setResults] = useState<DiscoverResult[]>([]);

  const handleSearch = async (query: string) => {
    // In a real app, you would fetch this from your API
    const mockResults: DiscoverResult[] = [
      { id: '1', type: 'user', title: 'John Doe', summary: 'Software Engineer' },
      { id: '2', type: 'post', title: 'How to build a social media app', summary: 'A tutorial on building a social media app with React and Node.js' },
      { id: '3', type: 'room', title: 'React Developers', summary: 'A room for React developers to connect and collaborate' },
    ];
    setResults(mockResults.filter(result => result.title.toLowerCase().includes(query.toLowerCase())));
  };

  return (
    <Box>
      <GlobalSearchBox onSearch={handleSearch} />
      <ResultsGrid results={results} />
    </Box>
  );
};

export default DiscoverPage;
