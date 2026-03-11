"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Post } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  return (
    <div 
      className="p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={() => router.push(`/post/${post.id}`)}
    >
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={post.authorAvatar} alt={post.authorName} />
          <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{post.authorName}</h3>
            <span className="text-xs text-muted-foreground">• {formatDistanceToNow(new Date(post.createdAt))} ago</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">@{post.authorUsername}</p>
        </div>
      </div>
      <p className="text-sm line-clamp-3 mb-3">{post.content}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>{post.likesCount} likes</span>
        <span>{post.commentsCount} comments</span>
      </div>
    </div>
  );
}
