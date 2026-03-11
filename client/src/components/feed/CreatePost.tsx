"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/context/PostContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreatePost() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createPost } = usePosts();

  const handleSubmit = async () => {
    if (!title || !content) return;
    await createPost(title, content);
    setTitle("");
    setContent("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="nena" className="gap-2">
          <Plus className="h-4 w-4" /> 
          <span>New Post</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input 
              placeholder="Title" 
              value={title} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Textarea 
              placeholder="What's on your mind?" 
              value={content} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} 
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title || !content}>Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
