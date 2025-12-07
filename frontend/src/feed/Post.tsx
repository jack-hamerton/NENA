import styled from 'styled-components';

const PostContainer = styled.div`
  background-color: ${props => props.theme.colors.card};
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const PostHeader = styled.h4`
  color: ${props => props.theme.colors.text};
  margin-bottom: 10px;
`;

const PostContent = styled.p`
  color: ${props => props.theme.colors.text};
`;

const Post = ({ post }) => {
  return (
    <PostContainer>
      <PostHeader>{post.author}</PostHeader>
      <PostContent>{post.content}</PostContent>
    </PostContainer>
  );
};

export default Post;
