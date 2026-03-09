"use client";

import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="hover:shadow-nena transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar size="sm">
          <AvatarImage src={post.authorAvatar} />
          <AvatarFallback fallback={post.authorUsername} />
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{post.authorName}</span>
            <span className="text-xs text-muted-foreground">@{post.authorUsername}</span>
          </div>
          <span className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt)}</span>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>
        
        {post.hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
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
