
import { useState, useEffect } from \'react\';
import { Avatar, Card, CardHeader, CardContent, CardActions, IconButton, Typography, Link } from \'@mui/material\';
import { Favorite, Comment } from \'@mui/icons-material\';
import { useUser } from \'../../hooks/useUser\';
import { usePosts } from \'../../hooks/usePosts\';
import { ThreadedCommentSection } from \'../../comments/ThreadedCommentSection\';

const PostContent = ({ content, onCampaignClick }) => {
  const handleHashtagClick = (tag) => {
    if (tag.startsWith(\'#campaign-\')) {
      const campaignName = tag.replace(\'#campaign-\', \'\');
      onCampaignClick(campaignName);
    } else {
      // Handle regular hashtag click if needed
      console.log(\'Regular hashtag clicked:\', tag);
    }
  };

  const renderContent = () => {
    const parts = content.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith(\'#\')) {
        const isCampaign = part.startsWith(\'#campaign-\');
        return (
          <Link key={index} component="button" variant="body2" onClick={() => handleHashtagClick(part)} sx={{ color: isCampaign ? \'primary.main\' : \'inherit\', fontWeight: isCampaign ? \'bold\' : \'normal\' }}>
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return <Typography variant="body2" color="text.secondary">{renderContent()}</Typography>;
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
      console.error(\'Error liking/unliking post:\', error);
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={<Avatar src={author?.profile_picture_url} />}
        title={author?.username || \'Loading...\'}
        subheader={new Date(post.created_at).toLocaleDateString()}
      />
      <CardContent>
        <PostContent content={post.content} onCampaignClick={onCampaignClick} />
        {post.media_url && (
          <img src={post.media_url} alt="Post media" style={{ maxWidth: \'100%\', marginTop: \'1rem\' }} />
        )}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleLike}>
          <Favorite color={post.is_liked ? \'error\' : \'inherit\'} />
        </IconButton>
        <Typography>{post.like_count}</Typography>
        <IconButton aria-label="comment" onClick={handleCommentClick}>
          <Comment />
        </IconButton>
        <Typography>{post.comment_count}</Typography>
      </CardActions>
      {showComments && (
        <ThreadedCommentSection 
          postId={post.id}
          comments={[]}
          onCommentSubmitted={() => {}}
        />
      )}
    </Card>
  );
};
