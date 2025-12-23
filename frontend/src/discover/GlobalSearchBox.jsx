import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import styled from 'styled-components';

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    color: ${(props) => props.theme.text.primary};
    background-color: ${(props) => props.theme.palette.primary};
  }
  .MuiInputLabel-root {
    color: ${(props) => props.theme.text.secondary};
  }
  .MuiOutlinedInput-root {
    fieldset {
      border-color: ${(props) => props.theme.palette.secondary};
    }
    &:hover fieldset {
      border-color: ${(props) => props.theme.palette.accent};
    }
    &.Mui-focused fieldset {
      border-color: ${(props) => props.theme.palette.accent};
    }
  }
`;

const GlobalSearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <StyledTextField
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
