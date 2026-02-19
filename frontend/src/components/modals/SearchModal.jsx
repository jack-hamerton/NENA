
import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import GlobalSearchBox from '../../discover/GlobalSearchBox';
import ResultsGrid from '../../discover/ResultsGrid.tsx';
import { searchService } from '../../services/searchService';
import { theme } from '../../theme/theme';
import { Modal } from '@mui/material';

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 800px;
  background-color: ${props => props.theme.palette.dark};
  border: 2px solid #000;
  box-shadow: 24;
  padding: 2rem;
  min-height: 80vh;
  overflow-y: auto;
  outline: none;
`;

const SearchModal = ({ open, onClose }) => {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    if (query) {
      const searchResults = await searchService.search(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    if (!open) {
      setResults([]);
    }
  }, [open]);

  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose}>
        <ModalContent>
          <GlobalSearchBox onSearch={handleSearch} />
          <ResultsGrid results={results} />
        </ModalContent>
      </Modal>
    </ThemeProvider>
  );
};

export default SearchModal;
