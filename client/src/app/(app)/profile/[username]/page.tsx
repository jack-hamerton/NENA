"use client";
import React from 'react';

// Using a type compatible with Next.js 15 page props
export default function ProfilePage({ params }: { params: Promise<{ username: string }> } | { params: { username: string } }) {
  const resolvedParams = React.use(params as Promise<{ username: string }>);
  
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">@{resolvedParams.username}</h1>
        <p className="text-muted-foreground">User profile details coming in Phase 2.</p>
      </div>
    </div>
  );
}
