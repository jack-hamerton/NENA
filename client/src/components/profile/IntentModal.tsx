"use client";

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface IntentModalProps {
  open: boolean;
  onClose: () => void;
  onFollow: (intent: string) => void;
}

const INTENT_CATEGORIES = [
  { id: 'Collaborator', description: 'Peers you want to work with' },
  { id: 'Mentor', description: 'Users you look up to for guidance' },
  { id: 'Peer', description: 'Users with similar interests' }
];

const IntentModal: React.FC<IntentModalProps> = ({ open, onClose, onFollow }) => {
  const [selectedIntent, setSelectedIntent] = useState<string>('');

  const handleFollow = () => {
    if (selectedIntent) {
      onFollow(selectedIntent);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Follow Intent</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-sm text-muted-foreground text-center">
            How do you see this user&apos;s role in your creative journey?
          </p>

          <div className="space-y-3">
            {INTENT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedIntent(category.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left group",
                  selectedIntent === category.id 
                    ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                )}
              >
                <div>
                  <div className="font-bold text-sm group-hover:text-primary transition-colors">
                    {category.id}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category.description}
                  </div>
                </div>
                {selectedIntent === category.id && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <Button 
            className="w-full h-12 text-base font-bold" 
            variant="nena"
            disabled={!selectedIntent}
            onClick={handleFollow}
          >
            Confirm & Follow
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default IntentModal;
