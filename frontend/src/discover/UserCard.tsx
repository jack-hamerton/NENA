import styled from 'styled-components';

const Card = styled.div`
  background-color: ${props => props.theme.colors.card};
  padding: 20px;
  border-radius: 10px;
  color: ${props => props.theme.colors.text};
`;

const UserCard = ({ user }) => {
  return (
    <Card>
      <h3>{user.name}</h3>
      <p>{user.bio}</p>
    </Card>
  );
};

export default UserCard;
