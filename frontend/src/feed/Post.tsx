import { Box, Avatar, Typography, IconButton } from '@mui/material';
import { Favorite, Share, Comment } from '@mui/icons-material';

const Post = ({ post }) => {
  return (
    <Box sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar src={post.user.avatar} />
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle1">{post.user.name}</Typography>
          <Typography variant="body2" color="text.secondary">{post.timestamp}</Typography>
        </Box>
      </Box>
      <Typography variant="body1" sx={{ mb: 1 }}>{post.content}</Typography>
      <Box>
        <IconButton><Favorite /></IconButton>
        <IconButton><Share /></IconButton>
        <IconButton><Comment /></IconButton>
      </Box>
    </Box>
  );
};

export default Post;
