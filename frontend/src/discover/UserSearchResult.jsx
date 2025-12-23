import React from 'react';
import styled from 'styled-components';

const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: ${(props) => props.theme.palette.primary};
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h4`
  margin: 0;
  color: ${(props) => props.theme.text.primary};
`;

const UserHandle = styled.p`
  margin: 0;
  color: ${(props) => props.theme.text.secondary};
`;

const UserSearchResult = ({ user }) => {
  return (
    <UserCard>
      <Avatar src={user.avatar} alt={user.name} />
      <UserInfo>
        <UserName>{user.name}</UserName>
        <UserHandle>@{user.handle}</UserHandle>
      </UserInfo>
    </UserCard>
  );
};

export default UserSearchResult;
