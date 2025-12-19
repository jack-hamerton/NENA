
import React, { useState } from 'react';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('users'); // users, posts, hashtags

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <h1>Discover</h1>
      <input
        type="text"
        placeholder={`Search for ${searchType}`}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div>
        <button onClick={() => setSearchType('users')}>Users</button>
        <button onClick={() => setSearchType('posts')}>Posts</button>
        <button onClick={() => setSearchType('hashtags')}>Hashtags</button>
      </div>
      {/* Add search results based on searchType */}
    </div>
  );
};

export default Discover;
