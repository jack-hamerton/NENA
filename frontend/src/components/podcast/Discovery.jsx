
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const DiscoveryContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${theme.palette.light};
  background: ${theme.palette.dark};
  color: ${theme.text.primary};
  width: 300px;
`;

const SurpriseButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background: ${theme.palette.primary};
  color: white;
  cursor: pointer;

  &:hover {
    background: ${theme.palette.secondary};
  }
`;

const Discovery = ({ podcasts, onPodcastSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSurprise = () => {
    const randomIndex = Math.floor(Math.random() * podcasts.length);
    onPodcastSelect(podcasts[randomIndex]);
  };

  const filteredPodcasts = podcasts.filter(podcast =>
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DiscoveryContainer>
      <SearchInput
        type="text"
        placeholder="Search for a podcast..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <SurpriseButton onClick={handleSurprise}>Surprise Me</SurpriseButton>
      <div>
        {searchTerm && filteredPodcasts.map(podcast => (
          <div key={podcast.id} onClick={() => onPodcastSelect(podcast)}>
            {podcast.title}
          </div>
        ))}
      </div>
    </DiscoveryContainer>
  );
};

export default Discovery;
