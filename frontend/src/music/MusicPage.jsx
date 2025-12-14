import styled from 'styled-components';

const MusicContainer = styled.div`
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const MusicPage = () => {
  return (
    <MusicContainer>
      <h1>Music</h1>
      <p>Here&apos;s some music for you.</p>
    </MusicContainer>
  );
};

export default MusicPage;
