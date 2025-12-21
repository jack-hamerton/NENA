
import React from 'react';
import styled from 'styled-components';

const FollowListContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Title = styled.h2`
  text-align: center;
  color: #FAFAFA;
  margin-bottom: 1.5rem;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
`;

const UserItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #333;
`;

const FollowList = ({ title, users }) => {
  return (
    <FollowListContainer>
      <Title>{title}</Title>
      <UserList>
        {users && users.map(user => (
          <UserItem key={user.id}>
            {/* In the future, you can add user avatars and links to profiles */}
            <span>{user.username}</span>
          </UserItem>
        ))}
      </UserList>
    </FollowListContainer>
  );
};

export default FollowList;
