"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreatePost() {
  return (
    <Button size="sm" variant="nena" className="gap-2">
      <Plus className="h-4 w-4" /> 
      <span>New Post</span>
    </Button>
  );
}
