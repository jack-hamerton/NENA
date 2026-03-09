"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Radio } from "lucide-react";

interface CreateRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (room: { name: string; topic: string; category: string }) => void;
}

const categories = [
  { id: "general", label: "General", emoji: "💬" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "tech", label: "Tech", emoji: "💻" },
  { id: "art", label: "Art", emoji: "🎨" },
  { id: "community", label: "Community", emoji: "🤝" },
  { id: "education", label: "Education", emoji: "📚" },
];

export function CreateRoomDialog({ isOpen, onClose, onCreate }: CreateRoomDialogProps) {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("general");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate({ name: name.trim(), topic: topic.trim(), category });
      setName("");
      setTopic("");
      setCategory("general");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Create Room</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="px-5 pb-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Room Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Room Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Give your room a name..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                autoFocus
              />
            </div>

            {/* Topic */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Topic (optional)
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What will you be discussing?"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={category === cat.id ? "default" : "outline"}
                    className={`cursor-pointer text-xs px-3 py-1 transition-all ${
                      category === cat.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => setCategory(cat.id)}
                  >
                    {cat.emoji} {cat.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" variant="nena" className="w-full gap-2 mt-2" disabled={!name.trim()}>
              <Radio className="h-4 w-4" />
              Go Live
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
