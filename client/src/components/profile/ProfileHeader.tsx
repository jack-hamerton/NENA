"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Link as LinkIcon, Share2, UserPlus, Edit3 } from "lucide-react";

interface ProfileUser {
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  role?: string;
  tagline?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  joinedDate?: string;
  isOwnProfile?: boolean;
}

interface ProfileHeaderProps {
  user: ProfileUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Cover Photo */}
      <div className="relative h-40 sm:h-52 w-full rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10" />
        <div className="absolute inset-0 bg-nena-atmosphere opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Avatar + Info */}
      <div className="flex flex-col items-center gap-4 px-4 -mt-24 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
          <div className="relative group">
            <Avatar size="lg" className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-primary/20">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback fallback={user.username} className="text-2xl" />
            </Avatar>
            <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-background bg-green-500" />
            {user.isOwnProfile && (
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          <div className="text-center sm:text-left sm:pb-2">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              {user.role && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  👑 {user.role}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm font-medium">@{user.username}</p>
          </div>
        </div>
        
        <div className="flex gap-3 sm:pb-2">
          {user.isOwnProfile ? (
            <Button variant="outline" size="sm" className="px-6 rounded-full gap-2">
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile
            </Button>
          ) : (
            <Button variant="nena" size="sm" className="px-6 gap-2 shadow-lg">
              <UserPlus className="h-3.5 w-3.5" /> Follow
            </Button>
          )}
          <Button variant="outline" size="sm" className="rounded-full gap-2">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bio & Meta */}
      <div className="px-4 space-y-4">
        {(user.bio || user.tagline) && (
          <p className="text-sm max-w-2xl leading-relaxed">
            {user.tagline && <span className="italic text-muted-foreground">{user.tagline}</span>}
            {user.tagline && user.bio && <br />}
            {user.bio}
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-medium">
          {user.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {user.location}
            </div>
          )}
          {user.website && (
            <div className="flex items-center gap-1.5">
              <LinkIcon className="h-3.5 w-3.5" />
              <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                {user.website}
              </a>
            </div>
          )}
          {user.joinedDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Joined {user.joinedDate}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 border-y py-4 border-border/50 font-medium">
          <div className="flex gap-1.5 text-sm">
            <span className="font-bold text-foreground">{user.postsCount ?? 0}</span>
            <span className="text-muted-foreground">Posts</span>
          </div>
          <div className="flex gap-1.5 text-sm cursor-pointer hover:text-primary transition-colors">
            <span className="font-bold text-foreground">{user.followersCount ?? 0}</span>
            <span className="text-muted-foreground">Followers</span>
          </div>
          <div className="flex gap-1.5 text-sm cursor-pointer hover:text-primary transition-colors">
            <span className="font-bold text-foreground">{user.followingCount ?? 0}</span>
            <span className="text-muted-foreground">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}
