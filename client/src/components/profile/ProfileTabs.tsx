"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Headphones, Heart, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  username: string;
  posts?: Array<{
    id: string;
    content: string;
    likesCount: number;
    createdAt: string;
  }>;
}

const tabs = [
  { id: "posts", label: "Posts", icon: FileText },
  { id: "podcasts", label: "Podcasts", icon: Headphones },
  { id: "liked", label: "Liked", icon: Heart },
  { id: "reposts", label: "Reposts", icon: Repeat2 },
];

export function ProfileTabs({ username, posts = [] }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-border/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === "posts" && (
          <div className="space-y-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-nena transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-sm">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {post.likesCount}
                      </span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No posts yet</p>
                <p className="text-xs mt-1">@{username}&apos;s posts will appear here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "podcasts" && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Headphones className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">No podcasts yet</p>
            <p className="text-xs mt-1">@{username}&apos;s podcasts will appear here</p>
          </div>
        )}

        {activeTab === "liked" && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Heart className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">No liked content yet</p>
            <p className="text-xs mt-1">@{username}&apos;s liked content will appear here</p>
          </div>
        )}

        {activeTab === "reposts" && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Repeat2 className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">No reposts yet</p>
            <p className="text-xs mt-1">@{username}&apos;s reposts will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
