"use client";

import { PostCard } from "@/components/feed/PostCard";
import { CreatePost } from "@/components/feed/CreatePost";
import { PostProvider, usePosts } from "@/context/PostContext";

function HomeFeed() {
  const { posts, isLoading } = usePosts();

  if (isLoading) {
    return <div className="text-center py-10 text-muted-foreground">Loading feed...</div>;
  }

  return (
    <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No posts yet. Start the conversation!</div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
    </div>
  );
}

export default function HomePage() {
  return (
    <PostProvider>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Home Feed</h1>
          <CreatePost />
        </div>
        <HomeFeed />
      </div>
    </PostProvider>
  );
}
