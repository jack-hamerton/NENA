
import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import PodcastCard from '../components/podcast/PodcastCard';
import PodcastPlayer from '../components/podcast/PodcastPlayer';
import { podcasts } from '../mock/podcasts';
import { useSearchParams } from 'react-router-dom';
import { theme } from '../theme/theme';

const PodcastsContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};

  h1, h2 {
    color: ${props => props.theme.palette.secondary};
  }

  input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    background-color: ${props => props.theme.palette.primary};
    border: 1px solid ${props => props.theme.palette.highlight};
    color: ${props => props.theme.text.primary};
  }

  button {
    background-color: ${props => props.theme.palette.secondary};
    color: ${props => props.theme.text.primary};
    border: none;
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    cursor: pointer;
  }
`;

const Podcasts = () => {
  const [searchParams] = useSearchParams();
  const podcastId = searchParams.get('id');
  const [activeTab, setActiveTab] = useState('recommendations');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (podcastId) {
    return <PodcastPlayer />;
  }

  return (
    <ThemeProvider theme={theme}>
      <PodcastsContainer>
        <h1>Podcasts</h1>
        <input
          type="text"
          placeholder="Search podcasts"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div>
          <button onClick={() => setActiveTab('recommendations')}>
            Personalized Recommendations
          </button>
          <button onClick={() => setActiveTab('playlists')}>
            Curated Playlists
          </button>
        </div>
        {searchQuery && (
          <div>
            <h2>Search Results for "{searchQuery}"</h2>
            {filteredPodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        )}
        {activeTab === 'recommendations' && !searchQuery && (
          <div>
            <h2>Personalized Recommendations</h2>
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        )}
        {activeTab === 'playlists' && !searchQuery && (
          <div>
            <h2>Curated Playlists</h2>
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        )}
      </PodcastsContainer>
    </ThemeProvider>
  );
};

export default Podcasts;
