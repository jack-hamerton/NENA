
import React, { useState, useEffect } from 'react';
import SearchResults from '../discover/SearchResults';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('users'); // users, posts, hashtags
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.length > 2) { // Avoid searching for very short queries
        // In a real application, you would make an API call here
        // For demonstration purposes, we'll use mock data
        const mockData = {
          users: [
            { id: 1, name: 'John Doe', handle: 'johndoe', avatar: 'https://i.pravatar.cc/150?u=johndoe' },
            { id: 2, name: 'Jane Doe', handle: 'janedoe', avatar: 'https://i.pravatar.cc/150?u=janedoe' },
          ],
          posts: [
            { id: 1, author: { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=johndoe' }, content: 'This is a sample post' },
            { id: 2, author: { name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=janedoe' }, content: 'Another sample post' },
          ],
          hashtags: [
            { id: 1, name: 'react', postCount: 123 },
            { id: 2, name: 'webdev', postCount: 456 },
          ],
        };

        setSearchResults(mockData[searchType]);
      }
      else {
        setSearchResults([]);
      }
    };

    fetchResults();
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
