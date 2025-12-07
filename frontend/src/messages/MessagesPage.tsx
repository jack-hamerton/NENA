import styled from 'styled-components';

const MessagesContainer = styled.div`
  color: ${(props) => props.theme.text};
`;

const MessagesPage = () => {
  return (
    <MessagesContainer>
      <h1>Messages</h1>
      {/* Messages content will be displayed here */}
    </MessagesContainer>
  );
};

export default MessagesPage;
