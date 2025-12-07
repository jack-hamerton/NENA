import styled from 'styled-components';
import UserCard from './UserCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ResultsGrid = () => {
  // Dummy data - replace with actual search results
  const users = [
    { id: 1, name: 'Alice', bio: 'Loves coding and coffee' },
    { id: 2, name: 'Bob', bio: 'Music enthusiast and gamer' },
    // ... more users
  ];

  return (
    <Grid>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </Grid>
  );
};

export default ResultsGrid;
