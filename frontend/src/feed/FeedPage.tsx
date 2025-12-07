import styled from 'styled-components';

const FeedContainer = styled.div`
  color: ${(props) => props.theme.text};
`;

const FeedPage = () => {
  return (
    <FeedContainer>
      <h1>Feed</h1>
      {/* Feed items will be mapped here */}
    </FeedContainer>
  );
};

export default FeedPage;
