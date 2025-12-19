
import React, { useState } from 'react';
import PodcastCard from '../components/podcast/PodcastCard';
import PodcastPlayer from '../components/podcast/PodcastPlayer';
import { podcasts } from '../mock/podcasts';
import { useSearchParams } from 'react-router-dom';

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
    <div>
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
    </div>
  );
};

export default Podcasts;
