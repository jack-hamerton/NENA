
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const VideoPodcastsContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: ${theme.palette.dark};
  border-radius: 4px;

  h3 {
    color: ${theme.text.primary};
    margin-bottom: 1rem;
  }
`;

const VideoPlayer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const VideoPodcasts = ({ podcast }) => {
  if (!podcast || !podcast.videoUrl) {
    return null;
  }

  return (
    <VideoPodcastsContainer>
      <h3>Video Podcast</h3>
      <VideoPlayer>
        {/* In a real app, you would use a video player component */}
        <video width="100%" controls src={podcast.videoUrl} />
      </VideoPlayer>
    </VideoPodcastsContainer>
  );
};

export default VideoPodcasts;
