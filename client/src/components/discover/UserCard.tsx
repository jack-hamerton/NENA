"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";
import { useRouter } from "next/navigation";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const router = useRouter();

  return (
    <div 
      className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={() => router.push(`/profile/${user.username}`)}
    >
      <Avatar className="h-12 w-12 border">
        <AvatarImage src={user.avatarUrl} alt={user.displayName} />
        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{user.displayName}</h3>
        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
        {user.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{user.bio}</p>}
      </div>
    </div>
  );
}
