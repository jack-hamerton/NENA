import styled from 'styled-components';

const RoomsContainer = styled.div`
  color: ${(props) => props.theme.text};
`;

const RoomsPage = () => {
  return (
    <RoomsContainer>
      <h1>Rooms</h1>
      {/* Rooms content will be displayed here */}
    </RoomsContainer>
  );
};

export default RoomsPage;
