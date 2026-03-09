"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Edit2, MapPin, Link as LinkIcon } from "lucide-react";

export function ProfileHeader({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <div className="relative h-32 w-full rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-nena-atmosphere opacity-30" />
      </div>

      <div className="flex flex-col items-center gap-4 px-4 -mt-20 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
          <div className="relative">
            <Avatar size="lg" className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarFallback fallback={userId} className="text-2xl" />
            </Avatar>
            <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-background bg-green-500" />
          </div>
          <div className="text-center sm:text-left sm:pb-2">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-muted-foreground text-sm font-medium">@{userId}</p>
          </div>
        </div>
        
        <div className="flex gap-3 sm:pb-2">
          <Button variant="nena" size="sm" className="px-6">Follow</Button>
          <Button variant="outline" size="sm" className="rounded-full gap-2">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <p className="text-sm max-w-2xl leading-relaxed">
          Creative soul 🎨 | Building with NENA. Passionate about community building, 
          African storytelling, and visual arts. Always looking for new collaborators! 🇰🇪
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Nairobi, Kenya
          </div>
          <div className="flex items-center gap-1.5">
            <LinkIcon className="h-3.5 w-3.5" /> nena.io/johndoe
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Joined March 2024
          </div>
        </div>

        <div className="flex gap-6 border-y py-4 border-border/50 font-medium">
          <div className="flex gap-1.5 text-sm">
            <span className="font-bold text-foreground">142</span>
            <span className="text-muted-foreground">Posts</span>
          </div>
          <div className="flex gap-1.5 text-sm">
            <span className="font-bold text-foreground">1.2K</span>
            <span className="text-muted-foreground">Followers</span>
          </div>
          <div className="flex gap-1.5 text-sm">
            <span className="font-bold text-foreground">384</span>
            <span className="text-muted-foreground">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}
