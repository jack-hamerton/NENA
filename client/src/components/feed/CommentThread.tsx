"use client";

import React, { useState, useEffect } from 'react';
import { Comment as CommentType } from "@/types";
import { usePosts } from "@/context/PostContext";
import { CommentItem } from "./CommentItem";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CommentThreadProps {
  postId: string;
}

export function CommentThread({ postId }: CommentThreadProps) {
  const { getComments, addComment } = usePosts();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCommentContent, setNewCommentContent] = useState("");

  const loadComments = async () => {
    setIsLoading(true);
    const fetched = await getComments(postId);
    setComments(fetched);
    setIsLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleSubmit = async () => {
    if (!newCommentContent.trim()) return;
    await addComment(postId, newCommentContent);
    setNewCommentContent("");
    loadComments(); // Reload to show new comment
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const rootComments = comments.filter(c => !c.parentId);

  return (
    <div className="mt-6 border-t border-border pt-4">
      <h3 className="text-sm font-semibold mb-4">Comments ({comments.length})</h3>
      
      <div className="space-y-4 mb-6">
        <Textarea 
          placeholder="What are your thoughts?" 
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSubmit} disabled={!newCommentContent.trim()}>
            Post Comment
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {rootComments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          rootComments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              allComments={comments} 
            />
          ))
        )}
      </div>
    </div>
  );
}
