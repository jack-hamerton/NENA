import styled from 'styled-components';

const NewPostContainer = styled.div`
  background-color: ${props => props.theme.colors.card};
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1em;
  margin-bottom: 10px;
`;

const PostButton = styled.button`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const NewPost = () => {
  return (
    <NewPostContainer>
      <TextArea placeholder="What's on your mind?" />
      <PostButton>Post</PostButton>
    </NewPostContainer>
  );
};

export default NewPost;
