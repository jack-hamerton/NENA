"use client";

import React, { useState } from 'react';
import { X, Image as ImageIcon, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onCreatePost: (data: { content: string; media?: File | null }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ open, onClose, onCreatePost }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!content.trim() && !media) return;
    onCreatePost({ content, media });
    setContent('');
    setMedia(null);
    setPreview(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Create Post</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <textarea
            className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none min-h-[120px] placeholder:text-muted-foreground/50"
            placeholder="Share your creative spark..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
          />

          {preview && (
            <div className="relative rounded-lg overflow-hidden border">
              <img src={preview} alt="Upload preview" className="w-full h-auto max-h-64 object-cover" />
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 h-7 w-7 rounded-full"
                onClick={() => { setMedia(null); setPreview(null); }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input type="file" className="hidden" accept="image/*" onChange={handleMediaChange} />
                <div className="p-2 rounded-full hover:bg-primary/10 text-primary transition-colors">
                  <ImageIcon className="h-5 w-5" />
                </div>
              </label>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={cn(
                "text-xs font-medium",
                content.length > 250 ? "text-destructive" : "text-muted-foreground"
              )}>
                {content.length}/280
              </span>
              <Button 
                onClick={handleSubmit} 
                variant="nena" 
                className="gap-2"
                disabled={!content.trim() && !media}
              >
                Post <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreatePostModal;
