import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const UserProfileContainer = styled.div`
  color: ${(props) => props.theme.text};
`;

const UserProfile = () => {
  const { userId } = useParams();

  return (
    <UserProfileContainer>
      <h1>User Profile for {userId}</h1>
      {/* User profile details will be displayed here */}
    </UserProfileContainer>
  );
};

export default UserProfile;
