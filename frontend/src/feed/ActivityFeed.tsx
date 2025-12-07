import styled from 'styled-components';
import Post from './Post';

const ActivityFeedContainer = styled.div``;

const ActivityFeed = () => {
  // Dummy data
  const posts = [
    { id: 1, author: 'John Doe', content: 'Just discovered a great new band!' },
    { id: 2, author: 'Jane Smith', content: 'Studying for my exams. Wish me luck!' },
  ];

  return (
    <ActivityFeedContainer>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </ActivityFeedContainer>
  );
};

export default ActivityFeed;
