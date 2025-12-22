
import React, { useState, useEffect } from 'react';
import SearchResults from '../discover/SearchResults';
import { search } from '../services/discover.service';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('users'); // users, posts, hashtags
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length > 0) {
        try {
          const response = await search(searchQuery, searchType);
          setSearchResults(response.data);
        } catch (error) {
          console.error(`Failed to fetch ${searchType}:`, error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const debounceFetch = setTimeout(() => {
        fetchResults();
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [searchQuery, searchType]);

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
      <SearchResults results={searchResults} type={searchType} />
    </div>
  );
};

export default Discover;
