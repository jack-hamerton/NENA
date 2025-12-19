
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { podcasts } from '../../mock/podcasts';

const PodcastPlayer = () => {
  const [searchParams] = useSearchParams();
  const podcastId = searchParams.get('id');
  const podcast = podcasts.find((p) => p.id === parseInt(podcastId));
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
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  if (!podcast) {
    return <div>Podcast not found</div>;
  }

  return (
    <div>
      <h1>{podcast.title}</h1>
      <h2>{podcast.author}</h2>
      <img src={podcast.imageUrl} alt={podcast.title} />
      <audio ref={audioRef} src={podcast.audioUrl} />
      <div>
        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
      <div onClick={handleProgressClick} style={{ cursor: 'pointer', border: '1px solid #ccc', width: '100%' }}>
        <div style={{ width: `${progress}%`, height: '20px', backgroundColor: 'blue' }} />
      </div>
    </div>
  );
};

export default PodcastPlayer;
