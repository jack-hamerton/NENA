import styled from 'styled-components';

const DiscoverContainer = styled.div`
  color: ${(props) => props.theme.text};
`;

const DiscoverPage = () => {
  return (
    <DiscoverContainer>
      <h1>Discover</h1>
      {/* Discover content will be displayed here */}
    </DiscoverContainer>
  );
};

export default DiscoverPage;
