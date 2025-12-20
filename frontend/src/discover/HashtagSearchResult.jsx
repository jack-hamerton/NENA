import React from 'react';
import styled from 'styled-components';

const HashtagCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
`;

const HashtagName = styled.h4`
  margin: 0;
`;

const HashtagPosts = styled.p`
  margin: 0;
  color: #888;
`;

const HashtagSearchResult = ({ hashtag }) => {
  return (
    <HashtagCard>
      <HashtagName>#{hashtag.name}</HashtagName>
      <HashtagPosts>{hashtag.postCount} posts</HashtagPosts>
    </HashtagCard>
  );
};

export default HashtagSearchResult;
