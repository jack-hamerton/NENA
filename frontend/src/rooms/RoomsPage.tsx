import styled from 'styled-components';

const RoomsContainer = styled.div`
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const RoomsPage = () => {
  return (
    <RoomsContainer>
      <h1>Rooms</h1>
      <p>Find a room to join.</p>
    </RoomsContainer>
  );
};

export default RoomsPage;
