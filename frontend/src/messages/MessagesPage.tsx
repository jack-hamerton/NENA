import styled from 'styled-components';

const MessagesContainer = styled.div`
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const MessagesPage = () => {
  return (
    <MessagesContainer>
      <h1>Messages</h1>
      <p>Here are your messages.</p>
    </MessagesContainer>
  );
};

export default MessagesPage;
