import React from 'react';
import styled from 'styled-components';

const PostCard = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: ${(props) => props.theme.palette.primary};
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const AuthorName = styled.h5`
  margin: 0;
  color: ${(props) => props.theme.text.primary};
`;

const PostContent = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
`;

const PostSearchResult = ({ post }) => {
  return (
    <PostCard>
      <PostHeader>
        <Avatar src={post.author.avatar} alt={post.author.name} />
        <AuthorName>{post.author.name}</AuthorName>
      </PostHeader>
      <PostContent>{post.content}</PostContent>
    </PostCard>
  );
};

export default PostSearchResult;
