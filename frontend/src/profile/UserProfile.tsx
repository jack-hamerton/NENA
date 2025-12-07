import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const UserProfileContainer = styled.div`
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const UserProfile = () => {
  const { userId } = useParams();

  return (
    <UserProfileContainer>
      <h1>User Profile</h1>
      <p>Viewing profile for user: {userId}</p>
    </UserProfileContainer>
  );
};

export default UserProfile;
