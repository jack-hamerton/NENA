import styled from 'styled-components';

const PageContainer = styled.div`
  color: ${(props) => props.theme.text};
`;

const MusicPodcastPage = () => {
  return (
    <PageContainer>
      <h1>Music & Podcasts</h1>
    </PageContainer>
  );
};

export default MusicPodcastPage;
