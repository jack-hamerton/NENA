
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const EpisodeListContainer = styled.div`
  margin-top: 2rem;
`;

const EpisodeItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${theme.palette.divider};
  cursor: pointer;

  &:hover {
    background-color: ${theme.palette.action.hover};
  }

  h4 {
    margin: 0;
    color: ${theme.palette.text.primary};
  }

  p {
    margin: 0.5rem 0 0;
    color: ${theme.palette.text.secondary};
  }
`;

const EpisodeList = ({ episodes, onEpisodeSelect }) => {
  if (!episodes || episodes.length === 0) {
    return <div>No episodes found.</div>;
  }

  return (
    <EpisodeListContainer>
      <h3 style={{ color: theme.palette.text.primary }}>Episodes</h3>
      {episodes.map(episode => (
        <EpisodeItem key={episode.id} onClick={() => onEpisodeSelect(episode)}>
          <h4>{episode.title}</h4>
          <p>{new Date(episode.release_date).toLocaleDateString()}</p>
        </EpisodeItem>
      ))}
    </EpisodeListContainer>
  );
};

export default EpisodeList;
