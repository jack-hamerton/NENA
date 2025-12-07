import { Box, Typography, Avatar, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const { userId } = useParams();

  // Fetch user data based on userId

  return (
    <Box>
      <Avatar sx={{ width: 120, height: 120, mb: 2 }} />
      <Typography variant="h4">User Name</Typography>
      <Typography variant="body1" color="text.secondary">@username</Typography>
      <Button variant="contained" sx={{ mt: 2 }}>Follow</Button>
      {/* Add more profile details here */}
    </Box>
  );
};

export default UserProfile;
