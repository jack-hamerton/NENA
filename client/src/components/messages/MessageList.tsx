"use client";

import { Message } from "@/types";
import { ChatBubble } from "./ChatBubble";
import { useEffect, useRef } from "react";
import { format } from "date-fns";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm space-y-2">
          <div className="p-3 rounded-full bg-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 21 1.9-1.9a9 9 0 1 1 2.8 2.8L3 21Z" />
              <path d="M9 10h6" />
              <path d="M9 14h6" />
            </svg>
          </div>
          <p>No messages yet. Say hello!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            sender={msg.senderId === currentUserId ? "me" : "them"}
            message={msg.content}
            timestamp={format(new Date(msg.createdAt), "HH:mm")}
          />
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
