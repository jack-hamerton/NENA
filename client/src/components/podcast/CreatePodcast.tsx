"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Image as ImageIcon, Plus } from "lucide-react";

export function CreatePodcast() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Logic for creation
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-2xl border-none bg-accent/20 backdrop-blur-lg">
      <CardHeader className="p-8 pb-4">
        <div className="h-14 w-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
          <Mic className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-black italic">Start Your Podcast</CardTitle>
        <CardDescription className="text-base">
          Share your voice with the world. Define your series and upload your first episode.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Series Title</label>
            <Input 
              placeholder="e.g. The Future of AI" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="h-12 bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea 
              placeholder="What is your podcast about?..." 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full min-h-[120px] bg-background/50 border border-white/10 rounded-xl p-4 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Cover Art</label>
               <div className="h-32 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-[10px] font-bold">Upload Image</span>
               </div>
            </div>
            <div className="flex flex-col justify-end">
               <Button className="h-12 w-full gap-2 font-bold italic" disabled={isSubmitting}>
                 {isSubmitting ? "Creating..." : <><Plus className="h-4 w-4" /> Create Series</>}
               </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
