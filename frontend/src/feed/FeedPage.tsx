import styled from 'styled-components';
import NewPost from './NewPost';
import ActivityFeed from './ActivityFeed';

const FeedContainer = styled.div`
  padding: 20px;
`;

const FeedPage = () => {
  return (
    <FeedContainer>
      <NewPost />
      <ActivityFeed />
    </FeedContainer>
  );
};

export default FeedPage;
