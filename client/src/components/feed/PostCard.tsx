"use client";

import Link from "next/link";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onReportPost?: () => void;
  onHashtagClick?: (hashtag: string) => void;
  onCampaignClick?: (campaignName: string) => void;
}

export function PostCard({ 
  post, 
  onReportPost, 
  onHashtagClick, 
  onCampaignClick 
}: PostCardProps) {
  const renderContent = (content: string) => {
    const parts = content.split(/(#[\w-]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return (
          <span 
            key={i} 
            className="text-primary hover:underline cursor-pointer font-medium"
            onClick={(e) => {
              e.stopPropagation();
              if (part.startsWith('#campaign-')) {
                onCampaignClick?.(part.replace('#campaign-', ''));
              } else {
                onHashtagClick?.(part);
              }
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card className="hover:shadow-nena transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Link href={`/profile/${post.authorUsername}`} className="flex-shrink-0">
          <Avatar size="sm" className="cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback fallback={post.authorUsername} />
          </Avatar>
        </Link>
        <div className="flex flex-col min-w-0">
          <Link href={`/profile/${post.authorUsername}`} className="hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold truncate">{post.authorName}</span>
              <span className="text-xs text-muted-foreground truncate">@{post.authorUsername}</span>
            </div>
          </Link>
          <span className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt)}</span>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto flex-shrink-0" onClick={() => onReportPost?.()}>
          <MoreHorizontal className="h-4 w-4" />
          {post.isReported && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-destructive" />}
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm whitespace-pre-wrap">
          {renderContent(post.content)}
        </div>
        
        {post.mediaUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border border-border">
             <img src={post.mediaUrl} alt="Post content" className="w-full h-auto object-cover max-h-96" />
          </div>
        )}

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.hashtags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-[10px] cursor-pointer"
                onClick={() => onHashtagClick?.(`#${tag}`)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <Heart className={post.isLiked ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} />
              <span className="text-xs">{post.likesCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.commentsCount}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
            <Share2 className="h-4 w-4" />
            <span className="text-xs">{post.sharesCount}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
