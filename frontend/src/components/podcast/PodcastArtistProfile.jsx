import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../../utils/api';
import { darkTheme } from '../../theme';

// --- Styled Components ---
const ArtistProfileContainer = styled.div`
  padding: 2rem;
  color: ${darkTheme.palette.text.primary};
`;

const ShowHeader = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ShowInfo = styled.div`
  h1 {
    margin: 0;
  }
`;

const Tabs = styled.div`
  margin: 2rem 0;
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${darkTheme.palette.text.secondary};
  cursor: pointer;
  padding: 1rem;
  font-size: 1rem;

  &.active {
    color: ${darkTheme.palette.primary.main};
    border-bottom: 2px solid ${darkTheme.palette.primary.main};
  }
`;

// --- PodcastArtistProfile Component ---
export const PodcastArtistProfile = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [activeTab, setActiveTab] = useState('episodes');

  useEffect(() => {
    const fetchArtist = async () => {
      const response = await api.get(`/podcast-artists/${artistId}`);
      setArtist(response.data);
    };
    fetchArtist();
  }, [artistId]);

  if (!artist) return <div>Loading...</div>;

  return (
    <ArtistProfileContainer>
      <ShowHeader>
        <img src={artist.show.coverArt} alt={artist.show.name} width="200" height="200" />
        <ShowInfo>
          <h1>{artist.show.name}</h1>
          <a href={artist.show.customUrl} target="_blank" rel="noopener noreferrer">
            {artist.show.customUrl}
          </a>
          <p>{artist.show.description}</p>
          {/* Add social links here */}
        </ShowInfo>
      </ShowHeader>

      <Tabs>
        <Tab
          className={activeTab === 'episodes' ? 'active' : ''}
          onClick={() => setActiveTab('episodes')}
        >
          Episodes
        </Tab>
        <Tab
          className={activeTab === 'merchandise' ? 'active' : ''}
          onClick={() => setActiveTab('merchandise')}
        >
          Merchandise
        </Tab>
        <Tab
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </Tab>
      </Tabs>

      <div>
        {activeTab === 'episodes' && (
          <div>
            {/* Add episode list with comments and polls here */}
          </div>
        )}
        {activeTab === 'merchandise' && (
          <div>
            {/* Add merchandise links here */}
          </div>
        )}
        {activeTab === 'analytics' && (
          <div>
            {/* Add detailed analytics here */}
          </div>
        )}
      </div>
    </ArtistProfileContainer>
  );
};
