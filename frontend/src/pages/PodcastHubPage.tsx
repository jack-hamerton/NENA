import styled from 'styled-components';

const PageContainer = styled.div`
  color: ${(props) => props.theme.text};
`;

const PodcastHubPage = () => {
  return (
    <PageContainer>
      <h1>Podcast Hub</h1>
    </PageContainer>
  );
};

export default PodcastHubPage;
