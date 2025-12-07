import styled from 'styled-components';

const PodcastsContainer = styled.div`
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const PodcastsPage = () => {
  return (
    <PodcastsContainer>
      <h1>Podcasts</h1>
      <p>Here are some podcasts for you.</p>
    </PodcastsContainer>
  );
};

export default PodcastsPage;
