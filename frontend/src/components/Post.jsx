
import React from 'react';
import styled from 'styled-components';
import { formatDistanceToNowStrict } from 'date-fns';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';

// --- Styled Components ---

const PostContainer = styled.div`
  background-color: #1A1A1A;
  border: 1px solid #2F2F2F;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: #E0E0E0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
`;

const AuthorLink = styled.a`
  font-weight: bold;
  color: #FFFFFF;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Timestamp = styled.span`
  color: #888;
  margin-left: 0.5rem;
  font-size: 0.9rem;
`;

const MoreOptionsButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  margin-left: auto;
`;

const Content = styled.div`
  padding: 0 1rem 1rem;
  white-space: pre-wrap; /* Preserves line breaks and spacing */
  line-height: 1.5;
`;

const HashtagLink = styled.a`
  color: #1DA1F2;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const MediaWrapper = styled.div`
  max-height: 600px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
`;

const StyledMedia = styled.img` /* Using img for both video/image for simplicity */
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 1rem;
  border-top: 1px solid #2F2F2F;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 4px;

  &:hover {
    color: #1DA1F2;
    background-color: rgba(29, 161, 242, 0.1);
  }
`;

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

  const { id, author, content, media_url, created_at, isReported } = post;
  
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
