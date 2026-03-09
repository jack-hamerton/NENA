"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ListFilter, Users, RotateCcw, PlusSquare } from 'lucide-react';

interface FeedControlNavProps {
  isOpen: boolean;
  feedType: string;
  setFeedType: (type: string) => void;
  handleRestart: () => void;
  setCreatePostModalOpen: (open: boolean) => void;
}

const FeedControlNav: React.FC<FeedControlNavProps> = ({
  isOpen,
  feedType,
  setFeedType,
  handleRestart,
  setCreatePostModalOpen,
}) => {
  return (
    <nav
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full p-6 space-y-8 mt-12 lg:mt-0">
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-4">
            Feed Controls
          </h2>
          
          <Button
            variant={feedType === 'for-you' ? 'nena' : 'ghost'}
            className="w-full justify-start gap-3"
            onClick={() => setFeedType('for-you')}
          >
            <ListFilter className="h-4 w-4" />
            For You
          </Button>

          <Button
            variant={feedType === 'following' ? 'nena' : 'ghost'}
            className="w-full justify-start gap-3"
            onClick={() => setFeedType('following')}
          >
            <Users className="h-4 w-4" />
            Following
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleRestart}
          >
            <RotateCcw className="h-4 w-4" />
            Restart Feed
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5"
            onClick={() => setCreatePostModalOpen(true)}
          >
            <PlusSquare className="h-4 w-4" />
            Create Post
          </Button>
        </div>

        <div className="mt-auto pt-6 text-[10px] text-muted-foreground/60 text-center leading-relaxed">
          NENA Beta v1.0.0<br />
          Experience visual community like never before.
        </div>
      </div>
    </nav>
  );
};

export default FeedControlNav;
