import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';

interface GlobalSearchBoxProps {
  onSearch: (query: string) => void;
}

const GlobalSearchBox: React.FC<GlobalSearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for people, posts, rooms..."
        value={query}
        onChange={handleChange}
      />
    </Box>
  );
};

export default GlobalSearchBox;
