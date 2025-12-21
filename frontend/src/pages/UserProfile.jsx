
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as userService from '../services/user.service';
import * as postService from '../services/post.service';

// --- Styled Components ---

const ProfileContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Username = styled.h2`
  font-size: 2rem;
  font-weight: 300;
  color: #FAFAFA;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
`;

const Stat = styled.div`
  font-size: 1rem;
  color: #FAFAFA;
  b {
    font-weight: 600;
  }
`;

const FollowButton = styled.button`
  background-color: #3897f0;
  color: white;
  border: 1px solid #3897f0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  margin-left: 2rem;

  &:hover {
    background-color: #357ae8;
  }
`;

const UnfollowButton = styled.button`
  background-color: transparent;
  color: #FAFAFA;
  border: 1px solid #dbdbdb;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  margin-left: 2rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const PostThumbnail = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  background-color: #333;
  cursor: pointer;
  overflow: hidden;

  &:hover div {
    opacity: 1;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 1.2rem;
`;

// --- UserProfile Component ---

const UserProfile = () => {
  const { username } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const userRes = await userService.getUserByUsername(username);
      const fetchedUser = userRes.data;
      setProfileUser(fetchedUser);

      if (fetchedUser) {
        const postsRes = await postService.getPostsByUser(fetchedUser.id);
        setPosts(postsRes.data);
        
        const loggedInUser = userService.getCurrentUser();
        setCurrentUser(loggedInUser);

        // Check if the logged-in user is following the profile user
        // This requires the API to provide follower information on the user object
        setIsFollowing(
          fetchedUser.followers.some(f => f.follower_id === loggedInUser.id)
        );
      }
    } catch (err) {
      setError("Failed to fetch user data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleFollow = async () => {
    try {
      await userService.followUser(profileUser.id);
      setIsFollowing(true);
      // Optionally, refetch user data to update follower count
      fetchUserData(); 
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await userService.unfollowUser(profileUser.id);
      setIsFollowing(false);
      // Optionally, refetch user data to update follower count
      fetchUserData(); 
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!profileUser) return <div>User not found.</div>;

  const isOwnProfile = currentUser && currentUser.id === profileUser.id;

  return (
    <ProfileContainer>
      <ProfileHeader>
        <div>
          <Username>{profileUser.username}</Username>
          <Stats>
            <Stat><b>{posts.length}</b> posts</Stat>
            <Stat><b>{profileUser.followers.length}</b> followers</Stat>
            <Stat><b>{profileUser.following.length}</b> following</Stat>
          </Stats>
        </div>
        {!isOwnProfile && (
          <>
            {isFollowing ? (
              <UnfollowButton onClick={handleUnfollow}>Unfollow</UnfollowButton>
            ) : (
              <FollowButton onClick={handleFollow}>Follow</FollowButton>
            )}
          </>
        )}
      </ProfileHeader>

      <PostGrid>
        {posts.map(post => (
          <PostThumbnail key={post.id}>
            {post.media_url && <ThumbnailImage src={post.media_url} alt="Post thumbnail" />}
            <ThumbnailOverlay>
              <span>{post.content.substring(0, 30)}...</span>
            </ThumbnailOverlay>
          </PostThumbnail>
        ))}
      </PostGrid>
    </ProfileContainer>
  );
};

export default UserProfile;
