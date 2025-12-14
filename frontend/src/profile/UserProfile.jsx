import { useState } from 'react';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import Impact from './Impact';
import { CreateChallengeForm } from '../components/impact/CreateChallengeForm';

const UserProfile = () => {
  const { userId } = useParams();
  const [showImpact, setShowImpact] = useState(false);

  // Fetch user data based on userId

  return (
    <Box>
      <Avatar sx={{ width: 120, height: 120, mb: 2 }} />
      <Typography variant="h4">User Name</Typography>
      <Typography variant="body1" color="text.secondary">@username</Typography>
      <Button variant="contained" sx={{ mt: 2 }}>Follow</Button>
      <Button variant="outlined" sx={{ mt: 2, ml: 2 }} onClick={() => setShowImpact(!showImpact)}>
        {showImpact ? 'Hide Impact' : 'Show Impact'}
      </Button>

      {showImpact && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Collaboration Impact</Typography>
          <CreateChallengeForm />
          <Impact userId={userId} />
        </Box>
      )}

      {/* Add more profile details here */}
    </Box>
  );
};

export default UserProfile;
