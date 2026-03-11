"use client";

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Reply } from "lucide-react";
import { Comment as CommentType } from "@/types";
import { formatTimeAgo } from "@/lib/utils";
import { usePosts } from "@/context/PostContext";
import { Textarea } from "@/components/ui/textarea";

interface CommentItemProps {
  comment: CommentType;
  allComments: CommentType[];
  depth?: number;
}

export function CommentItem({ comment, allComments, depth = 0 }: CommentItemProps) {
  const { likeComment, addComment } = usePosts();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [localIsLiked, setLocalIsLiked] = useState(comment.isLiked);
  const [localLikesCount, setLocalLikesCount] = useState(comment.likesCount);

  const replies = allComments.filter(c => c.parentId === comment.id);

  const handleLike = async () => {
    await likeComment(comment.id);
    setLocalIsLiked(true);
    setLocalLikesCount(prev => prev + 1);
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await addComment(comment.postId, replyContent, comment.id);
    setReplyContent("");
    setIsReplying(false);
    // Note: In a real app, we'd trigger a refresh or update local state
  };

  return (
    <div className={`flex flex-col gap-2 ${depth > 0 ? 'ml-6 border-l border-border pl-4 mt-2' : 'mt-4'}`}>
      <div className="flex items-start gap-3">
        <Avatar className="h-6 w-6">
          <AvatarImage src={comment.authorAvatar} />
          <AvatarFallback fallback={comment.authorUsername} />
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{comment.authorName}</span>
            <span className="text-xs text-muted-foreground">@{comment.authorUsername}</span>
            <span className="text-xs text-muted-foreground">• {formatTimeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-foreground">{comment.content}</p>
          
          <div className="flex items-center gap-4 pt-1">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs hover:text-primary transition-colors ${localIsLiked ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-3 w-3 ${localIsLiked ? 'fill-primary' : ''}`} />
              {localLikesCount}
            </button>
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Reply className="h-3 w-3" />
              Reply
            </button>
          </div>

          {isReplying && (
            <div className="mt-2 space-y-2">
              <Textarea 
                placeholder="Write a reply..." 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="text-sm min-h-[60px]"
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)}>Cancel</Button>
                <Button size="sm" onClick={handleReply} disabled={!replyContent.trim()}>Reply</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="flex flex-col gap-2">
          {replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              allComments={allComments} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
