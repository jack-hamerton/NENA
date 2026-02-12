
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const PlayerContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.palette.background.paper};
  color: ${props => props.theme.palette.text.primary};
  border-radius: 4px;
  margin-bottom: 2rem;

  h2 {
    color: ${props => props.theme.palette.text.primary};
  }

  button {
    background-color: ${props => props.theme.palette.primary.main};
    color: ${props => props.theme.palette.text.primary};
    border: none;
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    cursor: pointer;

    &:hover {
        background-color: ${props => props.theme.palette.primary.dark};
    }
  }
`;

const ProgressBarContainer = styled.div`
  cursor: pointer;
  border: 1px solid ${props => props.theme.palette.divider};
  width: 100%;
  background-color: ${props => props.theme.palette.background.default};
  margin-top: 1rem;
`;

const ProgressBar = styled.div`
  height: 20px;
  background-color: ${props => props.theme.palette.primary.main};
`;

const PodcastPlayer = ({ episode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(progress);
  };

  const handleProgressClick = (event) => {
    const newTime = (event.nativeEvent.offsetX / event.target.offsetWidth) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (audioRef.current) {
        // eslint-disable-next-line
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  useEffect(() => {
    // When the episode changes, we want to reset the player
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  }, [episode]);

  if (!episode) {
    return <div>Select an episode to play</div>;
  }

  return (
      <PlayerContainer>
        <h2>{episode.title}</h2>
        <audio ref={audioRef} src={episode.audio_url} />
        <div>
          <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
        <ProgressBarContainer onClick={handleProgressClick}>
          <ProgressBar style={{ width: `${progress}%` }} />
        </ProgressBarContainer>
      </PlayerContainer>
  );
};

export default PodcastPlayer;
