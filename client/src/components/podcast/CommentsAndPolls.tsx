"use client";

import { useState, useEffect } from "react";
import { commentService, Comment } from "@/services/comment.service";
import { pollService, Poll } from "@/services/poll.service";
import { aiService } from "@/services/ai.service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Sparkles, Send, Reply, BarChart2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentsAndPollsProps {
  episodeId: string;
}

export function CommentsAndPolls({ episodeId }: CommentsAndPollsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRewriting, setIsRewriting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commentsData, pollsData] = await Promise.all([
          commentService.getComments(episodeId),
          pollService.getPolls(episodeId)
        ]);
        setComments(commentsData || []);
        setPolls(pollsData || []);
      } catch (error) {
        console.error("Failed to fetch comments/polls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [episodeId]);

  const handleRewrite = async (tone: string) => {
    if (!newComment.trim()) return;
    setIsRewriting(true);
    try {
      const rewritten = await aiService.rewriteText(newComment, tone);
      setNewComment(rewritten);
    } catch (error) {
      console.error("Rewrite failed:", error);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    const comment = await commentService.createComment({ episodeId, text: newComment });
    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  const handleVote = async (pollId: string, optionId: string) => {
    await pollService.voteOnPoll(pollId, optionId);
    // Optimistic update or refetch
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          options: poll.options.map(opt => 
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          )
        };
      }
      return poll;
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading discussion...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Polls Section */}
      {polls.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Live Polls
          </h3>
          <div className="grid gap-4">
            {polls.map((poll) => (
              <div key={poll.id} className="p-6 rounded-2xl border bg-card/50 backdrop-blur-sm space-y-4">
                <h4 className="font-bold">{poll.question}</h4>
                <div className="grid gap-2">
                  {poll.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleVote(poll.id, opt.id)}
                      className="group relative flex items-center justify-between p-3 rounded-lg border hover:border-primary transition-all text-left"
                    >
                      <span className="text-sm font-medium z-10">{opt.text}</span>
                      <span className="text-xs text-muted-foreground z-10">{opt.votes} votes</span>
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> Discussion
        </h3>

        {/* New Comment Input */}
        <div className="p-6 rounded-3xl border bg-accent/10 focus-within:ring-2 focus-within:ring-primary/20 transition-all space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What's on your mind?..."
            className="w-full bg-transparent border-none outline-none text-sm resize-none min-h-[80px]"
          />
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
               <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs rounded-full gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => handleRewrite("friendly")}
                disabled={isRewriting || !newComment}
               >
                 <Sparkles className={cn("h-3 w-3", isRewriting && "animate-spin")} /> AI Polish
               </Button>
            </div>
            <Button size="sm" onClick={handleSubmitComment} disabled={!newComment.trim()}>
              <Send className="h-3.5 w-3.5 mr-2" /> Post
            </Button>
          </div>
        </div>

        {/* Comment List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <Avatar className="h-10 w-10 border shadow-sm">
                <AvatarImage src={`/avatars/${comment.id}.png`} />
                <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{comment.username}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{comment.text}</p>
                <div className="flex items-center gap-4 pt-1">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                    <Reply className="h-3 w-3" /> Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <div className="text-center py-12 border border-dashed rounded-3xl text-sm text-muted-foreground">
              No comments yet. Be the first to start the conversation!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
