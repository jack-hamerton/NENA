"use client";

import { SearchType, User, Post, Hashtag, Room } from "@/types";
import { UserCard } from "./UserCard";
import { PostCard } from "./PostCard";
import { HashtagCard } from "./HashtagCard";
import { RoomCard } from "./RoomCard";
import { Loader2 } from "lucide-react";

interface SearchResultsProps {
  results: any[];
  type: SearchType;
  isLoading: boolean;
}

export function SearchResults({ results, type, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Searching for {type}...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center">
        <p className="text-lg font-medium">No results found</p>
        <p className="text-sm">Try searching for something else or check your spelling.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
      {results.map((result, index) => {
        const key = result.id || `${type}-${index}`;
        
        switch (type) {
          case "users":
            return <UserCard key={key} user={result as User} />;
          case "posts":
            return <PostCard key={key} post={result as Post} />;
          case "hashtags":
            return <HashtagCard key={key} hashtag={result as Hashtag} />;
          case "rooms":
            return <RoomCard key={key} room={result as Room} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
