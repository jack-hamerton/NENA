
import React from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { Poll } from './poll/Poll'; // Import the Poll component
import {
    PostContainer,
    PostHeader,
    AuthorLink,
    Timestamp,
    MoreOptionsButton,
    Content,
    HashtagLink,
    MediaWrapper,
    StyledMedia,
    ActionsBar,
    ActionButton
} from './Post.styled';

// --- Helper Functions ---

/**
 * Renders content with clickable hashtags and mentions.
 */
const renderContentWithLinks = (text) => {
  if (!text) return null;
  const parts = text.split(/([#@]\w+)/g);
  return parts.map((part, index) => {
    if (part.match(/^[#@]\w+/)) {
      const url = part.startsWith('#')
        ? `/search?q=${part.substring(1)}`
        : `/${part.substring(1)}`;
      return <HashtagLink key={index} href={url}>{part}</HashtagLink>;
    }
    return part;
  });
};

/**
 * Determines if a URL points to a video based on its extension.
 */
const isVideo = (url) => {
  return /\.(mp4|webm|mov)$/i.test(url);
};


// --- Post Component ---

const Post = ({ post, onReport }) => {
  if (!post) return null;

  const { id, author, content, media_url, created_at, isReported, poll } = post;
  
  // Placeholder for author until backend is updated
  const authorName = author?.username || `user_${post.user_id?.substring(0, 4)}` || 'Anonymous';

  return (
    <PostContainer className={isReported ? 'reported' : ''}>
      <PostHeader>
        <AuthorLink href={`/${authorName}`}>{authorName}</AuthorLink>
        <Timestamp>
          · {created_at ? formatDistanceToNowStrict(new Date(created_at)) : 'just now'}
        </Timestamp>
        <MoreOptionsButton onClick={() => onReport(id)}>
          <MoreHorizontal size={20} />
        </MoreOptionsButton>
      </PostHeader>

      {content && (
        <Content>
          {renderContentWithLinks(content)}
        </Content>
      )}

      {media_url && (
        <MediaWrapper>
          {isVideo(media_url) ? (
            <StyledMedia as="video" src={media_url} controls />
          ) : (
            <StyledMedia src={media_url} alt="Post media" />
          )}
        </MediaWrapper>
      )}

      {poll && <Poll poll={poll} postId={id} />}

      <ActionsBar>
        <ActionButton><Heart size={20} /> Like</ActionButton>
        <ActionButton><MessageCircle size={20} /> Comment</ActionButton>
        <ActionButton><Share2 size={20} /> Share</ActionButton>
        <ActionButton><Bookmark size={20} /> Save</ActionButton>
      </ActionsBar>
    </PostContainer>
  );
};

export default Post;
