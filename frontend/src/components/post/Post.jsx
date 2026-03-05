
import { useState, useEffect } from 'react';
import { Avatar, Box, Typography, Link, IconButton } from '@mui/material';
import { Favorite, Comment, Repeat, Share } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '../../hooks/useUser';
import { usePosts } from '../../hooks/usePosts';
import { ThreadedCommentSection } from '../../comments/ThreadedCommentSection';

const PostContent = ({ content, onCampaignClick }) => {
  const handleHashtagClick = (tag) => {
    if (tag.startsWith('#campaign-')) {
      const campaignName = tag.replace('#campaign-', '');
      onCampaignClick(campaignName);
    } else {
      // Handle regular hashtag click if needed
      console.log('Regular hashtag clicked:', tag);
    }
  };

  const renderContent = () => {
    const parts = content.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        const isCampaign = part.startsWith('#campaign-');
        return (
          <Link key={index} component="button" variant="body2" onClick={() => handleHashtagClick(part)} sx={{ color: isCampaign ? 'primary.main' : 'inherit', fontWeight: isCampaign ? 'bold' : 'normal' }}>
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{renderContent()}</Typography>;
};

export const Post = ({ post, onCampaignClick }) => {
  const [author, setAuthor] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const { getUser } = useUser();
  const { likePost, unlikePost } = usePosts();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await getUser(post.user_id);
        setAuthor(response.data);
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    if (post.user_id) {
      fetchAuthor();
    }
  }, [post.user_id, getUser]);

  const handleLike = async () => {
    try {
      if (post.is_liked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Box sx={{ display: 'flex', p: 2, borderBottom: '1px solid #333' }}>
      <Avatar src={author?.profile_picture_url} sx={{ mr: 2 }} />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>{author?.username || 'Loading...'}</Typography>
          <Typography variant="caption" color="text.secondary">
            @{author?.username} · {formatDistanceToNow(new Date(post.created_at))} ago
          </Typography>
        </Box>
        <PostContent content={post.content} onCampaignClick={onCampaignClick} />
        {post.image_url && (
          <Box sx={{ mt: 2, borderRadius: '16px', overflow: 'hidden', border: '1px solid #444' }}>
            <img src={post.image_url} alt="Post media" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
        )}
        {post.video_url && (
          <Box sx={{ mt: 2, borderRadius: '16px', overflow: 'hidden', border: '1px solid #444' }}>
            <video controls style={{ width: '100%', height: 'auto', display: 'block' }}>
              <source src={post.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={handleCommentClick}>
              <Comment fontSize="small" />
            </IconButton>
            <Typography variant="body2">{post.comment_count}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small">
                <Repeat fontSize="small" />
            </IconButton>
            <Typography variant="body2">{post.repost_count || 0}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={handleLike}>
              <Favorite fontSize="small" color={post.is_liked ? 'error' : 'inherit'} />
            </IconButton>
            <Typography variant="body2">{post.like_count}</Typography>
          </Box>
          <IconButton size="small">
            <Share fontSize="small" />
          </IconButton>
        </Box>
        {showComments && (
            <ThreadedCommentSection 
                postId={post.id}
                comments={[]}
                onCommentSubmitted={() => {}}
            />
        )}
      </Box>
    </Box>
  );
};
