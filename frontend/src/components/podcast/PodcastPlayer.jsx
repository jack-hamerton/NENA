
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { podcasts } from '../../mock/podcasts';
import { theme } from '../../theme/theme';
import { ThreadedCommentSection } from '../../comments/ThreadedCommentSection';

const PlayerContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};

  h1, h2 {
    color: ${props => props.theme.palette.secondary};
  }

  img {
    width: 100%;
    max-width: 400px;
    height: auto;
    margin-bottom: 1rem;
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

const ProgressBarContainer = styled.div`
  cursor: pointer;
  border: 1px solid ${props => props.theme.palette.highlight};
  width: 100%;
  background-color: ${props => props.theme.palette.primary};
`;

const ProgressBar = styled.div`
  height: 20px;
  background-color: ${props => props.theme.palette.accent};
`;

const PodcastPlayer = () => {
  const [searchParams] = useSearchParams();
  const podcastId = searchParams.get('id');
  const podcast = podcasts.find((p) => p.id === parseInt(podcastId));
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  // Mock comments with replies for demonstration
  const [comments, setComments] = useState([
    {id: 1, author: 'Alice', text: 'This is a fantastic episode!', parentId: null, postId: podcastId},
    {id: 2, author: 'Bob', text: 'Can\'t wait for the next one.', parentId: null, postId: podcastId},
    {id: 3, author: 'Charlie', text: 'Great point at 15:30', parentId: 1, postId: podcastId},
  ]);

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
  
  const handleCommentSubmit = (commentData) => {
    const newComment = {
      id: Date.now(),
      author: 'CurrentUser', // This would come from your auth context in a real app
      text: commentData.text,
      parentId: commentData.parentId || null,
      postId: podcastId,
    };
    setComments(prevComments => [...prevComments, newComment]);
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

  if (!podcast) {
    return <div>Podcast not found</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <PlayerContainer>
        <h1>{podcast.title}</h1>
        <h2>{podcast.author}</h2>
        <img src={podcast.imageUrl} alt={podcast.title} />
        <audio ref={audioRef} src={podcast.audioUrl} />
        <div>
          <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
        <ProgressBarContainer onClick={handleProgressClick}>
          <ProgressBar style={{ width: `${progress}%` }} />
        </ProgressBarContainer>

        <ThreadedCommentSection 
          comments={comments} 
          onCommentSubmitted={handleCommentSubmit} 
        />

      </PlayerContainer>
    </ThemeProvider>
  );
};

export default PodcastPlayer;
