import React from 'react';
import UserSearchResult from './UserSearchResult';
import PostSearchResult from './PostSearchResult';
import HashtagSearchResult from './HashtagSearchResult';

const SearchResults = ({ results, type }) => {
  if (results.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div>
      {results.map((result) => {
        if (type === 'users') {
          return <UserSearchResult key={result.id} user={result} />;
        } else if (type === 'posts') {
          return <PostSearchResult key={result.id} post={result} />;
        } else if (type === 'hashtags') {
          return <HashtagSearchResult key={result.id} hashtag={result} />;
        }
        return null;
      })}
    </div>
  );
};

export default SearchResults;
