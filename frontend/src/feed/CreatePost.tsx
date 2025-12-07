import { Box, TextField, Button } from '@mui/material';

const CreatePost = () => {
  return (
    <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="What's on your mind?"
        variant="outlined"
      />
      <Button variant="contained" sx={{ mt: 1 }}>Post</Button>
    </Box>
  );
};

export default CreatePost;
