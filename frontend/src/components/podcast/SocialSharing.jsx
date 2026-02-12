
import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  RedditIcon,
} from 'react-share';
import styled from 'styled-components';
import { theme } from '../../theme/theme';

const SocialSharingContainer = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  text-align: center;
`;

const SocialSharing = ({ podcast, episode }) => {
  const shareUrl = `http://localhost:3000/podcasts/${podcast.id}/episodes/${episode.id}`;
  const title = `Check out this episode: ${episode.title} from ${podcast.title}`;

  return (
    <SocialSharingContainer>
      <h3 style={{ color: theme.text.primary }}>Share this Episode</h3>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <FacebookShareButton url={shareUrl} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton url={shareUrl} title={title}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <RedditShareButton url={shareUrl} title={title}>
          <RedditIcon size={32} round />
        </RedditShareButton>
      </div>
    </SocialSharingContainer>
  );
};

export default SocialSharing;
