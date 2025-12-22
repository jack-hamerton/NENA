
import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfilePicture = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 2rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const DisplayName = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
`;

const Handle = styled.h2`
  font-size: 1.2rem;
  font-weight: 300;
  color: #aaa;
  margin: 0.2rem 0;
`;

const RoleBadge = styled.span`
  background-color: #3897f0;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  display: inline-block;
`;

const Tagline = styled.p`
  margin-top: 0.5rem;
  font-size: 1rem;
`;

const FollowButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const FollowButton = styled.button`
  background-color: ${props => props.color || '#3897f0'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.8;
  }
`;

const ProfileHeader = ({ user }) => {
  return (
    <HeaderContainer>
      <ProfilePicture src={user.profilePicture} alt={user.displayName} />
      <UserInfo>
        <div>
          <RoleBadge>{user.role.icon} {user.role.name}</RoleBadge>
          <DisplayName>{user.displayName}</DisplayName>
        </div>
        <Handle>@{user.handle}</Handle>
        <Tagline>{user.tagline}</Tagline>
        <FollowButtonGroup>
            <FollowButton color="#2ecc71">Follow as Supporter</FollowButton>
            <FollowButton color="#e67e22">Follow as Amplifier</FollowButton>
            <FollowButton color="#3498db">Follow as Learner</FollowButton>
        </FollowButtonGroup>
      </UserInfo>
    </HeaderContainer>
  );
};

export default ProfileHeader;
