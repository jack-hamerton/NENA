"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ChatProvider } from "@/context/ChatContext";
import { ConversationList } from "@/components/messages/ConversationList";
import { ChatView } from "@/components/messages/ChatView";
import { cn } from "@/lib/utils";

function MessagesContent() {
  const [showChat, setShowChat] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!isMobile) {
      setShowChat(false);
    }
  }, [isMobile]);

  return (
    <ChatProvider>
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Conversation List Sidebar */}
        <div
          className={cn(
            "w-full md:w-80 lg:w-96 border-r bg-background flex-shrink-0",
            isMobile && showChat ? "hidden" : "block"
          )}
        >
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
          <ConversationList onSelectConversation={() => isMobile && setShowChat(true)} />
        </div>

        {/* Chat View */}
        {isMobile ? (
          showChat && (
            <div className="w-full absolute inset-0 z-50 bg-background">
              <ChatView onBack={() => setShowChat(false)} />
            </div>
          )
        ) : (
          <div className="flex-1 hidden md:block">
            <ChatView />
          </div>
        )}
      </div>
    </ChatProvider>
  );
}

export default function MessagesPage() {
  return <MessagesContent />;
}
