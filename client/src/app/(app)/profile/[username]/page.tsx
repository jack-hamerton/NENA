"use client";

import React from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileMetrics } from "@/components/profile/ProfileMetrics";
import { Button } from "@/components/ui/button";
import { MessageSquare, Radio, Bookmark } from "lucide-react";

// Mock profile data — in production this would come from the API
const mockProfiles: Record<string, {
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio: string;
  location: string;
  website: string;
  role: string;
  tagline: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  joinedDate: string;
  posts: Array<{ id: string; content: string; likesCount: number; createdAt: string }>;
  metrics: {
    supporters: number;
    amplifiers: number;
    learners: number;
    topicsEngaged: string[];
    badges: string[];
    impactScore: number;
  };
}> = {
  alice_w: {
    username: "alice_w",
    displayName: "Alice Wambui",
    avatarUrl: "/avatars/alice.png",
    bio: "Digital artist and community advocate. Building with NENA. Passionate about African storytelling and visual arts. Always looking for new collaborators! 🇰🇪",
    location: "Nairobi, Kenya",
    website: "nena.io/alice_w",
    role: "Creator",
    tagline: "Creative soul 🎨 | Turning narratives into art",
    followersCount: 1247,
    followingCount: 384,
    postsCount: 42,
    joinedDate: "January 2024",
    posts: [
      { id: "p1", content: "Just finished my latest digital painting! What do you guys think? #art #creativity", likesCount: 24, createdAt: new Date().toISOString() },
      { id: "p2", content: "Exploring new techniques in mixed media — combining traditional Kenyan patterns with digital art 🖌️✨ #africanart", likesCount: 18, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: "p3", content: "Workshop this weekend on community storytelling. DM me if you'd like to join! 📚", likesCount: 31, createdAt: new Date(Date.now() - 172800000).toISOString() },
    ],
    metrics: {
      supporters: 89,
      amplifiers: 45,
      learners: 23,
      topicsEngaged: ["art", "creativity", "storytelling", "community"],
      badges: ["Rising Star", "Community Builder"],
      impactScore: 78,
    },
  },
  bob_o: {
    username: "bob_o",
    displayName: "Bob Otieno",
    avatarUrl: "/avatars/bob.png",
    bio: "Design enthusiast hosting live rooms on the future of African design. Let's build something beautiful together. 🌍",
    location: "Mombasa, Kenya",
    website: "nena.io/bob_o",
    role: "Amplifier",
    tagline: "Design is how we shape the future 🌊",
    followersCount: 856,
    followingCount: 210,
    postsCount: 28,
    joinedDate: "February 2024",
    posts: [
      { id: "p4", content: "Excited to host a live room tonight on the future of design in Africa. Join us! #design #africa", likesCount: 15, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: "p5", content: "Just discovered an amazing design community in Lagos. The talent is incredible! 🎨🔥", likesCount: 22, createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
    metrics: {
      supporters: 52,
      amplifiers: 67,
      learners: 34,
      topicsEngaged: ["design", "africa", "technology", "community"],
      badges: ["Room Host", "Amplifier"],
      impactScore: 65,
    },
  },
};

// Default profile for unknown usernames
const defaultProfile = {
  displayName: "NENA User",
  bio: "A member of the NENA community.",
  location: "Africa",
  website: "",
  role: "Member",
  tagline: "Joining the movement ✊",
  followersCount: 0,
  followingCount: 0,
  postsCount: 0,
  joinedDate: "March 2024",
  posts: [] as Array<{ id: string; content: string; likesCount: number; createdAt: string }>,
  metrics: {
    supporters: 0,
    amplifiers: 0,
    learners: 0,
    topicsEngaged: [] as string[],
    badges: [] as string[],
    impactScore: 0,
  },
};

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = React.use(params);
  const username = resolvedParams.username;
  
  const profile = mockProfiles[username] || { ...defaultProfile, username };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <ProfileHeader user={{ ...profile, isOwnProfile: false }} />

      {/* Metrics */}
      <div className="px-4">
        <ProfileMetrics metrics={profile.metrics} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 flex flex-wrap gap-3">
        <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs">
          <MessageSquare className="h-3.5 w-3.5" /> Message
        </Button>
        <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs">
          <Radio className="h-3.5 w-3.5" /> Community Rooms
        </Button>
        <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs">
          <Bookmark className="h-3.5 w-3.5" /> Pinned Story
        </Button>
      </div>

      {/* Content Tabs */}
      <div className="px-4">
        <ProfileTabs username={username} posts={profile.posts} />
      </div>
    </div>
  );
}
