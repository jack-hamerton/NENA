"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "@/types";
import { ChevronLeft, Info, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ChatHeaderProps {
  conversation: Conversation;
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" asChild>
          <Link href="/messages">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={conversation.avatar} alt={conversation.name} />
          <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold truncate max-w-[120px] md:max-w-none">
            {conversation.name}
          </h2>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${conversation.isOnline ? "bg-green-500" : "bg-muted-foreground"}`} />
            <span className="text-[10px] text-muted-foreground">
              {conversation.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
