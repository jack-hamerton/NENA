"use client";

import React from 'react';
import { PostCard } from './PostCard';
import { Post as PostType } from '@/types';

interface ActivityFeedProps {
  posts: PostType[];
  onReportPost: (postId: string) => void;
  onUsernameLongPress: (userId: string) => void;
  onHashtagClick: (hashtag: string) => void;
  onCampaignClick: (campaignName: string) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  posts, 
  onReportPost, 
  onUsernameLongPress, 
  onHashtagClick, 
  onCampaignClick 
}) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-8 text-center text-muted-foreground">
        <p>No posts to display.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          onReportPost={() => onReportPost(post.id)}
          onUsernameLongPress={() => onUsernameLongPress(post.authorId)}
          onHashtagClick={onHashtagClick}
          onCampaignClick={onCampaignClick}
        />
      ))}
    </div>
  );
};

export default ActivityFeed;
