"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        placeholder={placeholder || "Search users, posts, hashtags, rooms…"} 
        className="pl-9 bg-card/50" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
