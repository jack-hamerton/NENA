"use client";

import { useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { MessageInput } from "@/components/messages/MessageInput";
import { ChatBubble } from "@/components/messages/ChatBubble";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Video, MoreVertical, Lock } from "lucide-react";

interface ChatViewProps {
  onBack?: () => void;
}

export function ChatView({ onBack }: ChatViewProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "collaborate">("chat");
  const { selectedConversation, messages, isLoadingMessages, sendMessage, fetchConversations } = useChat();

  const handleCall = (type: "audio" | "video") => {
    // In a real app, this would initialize WebRTC and open a call modal
    console.log(`Starting ${type} call with ${selectedConversation?.name}`);
    alert(`Starting ${type} call with ${selectedConversation?.name}...`);
  };

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-1">Select a conversation</h2>
          <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar>
            <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-sm">{selectedConversation.name}</h2>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => handleCall("audio")}>
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={() => handleCall("video")}>
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-background/95 backdrop-blur-sm px-4">
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "chat" 
              ? "border-primary text-foreground" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
          )}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("collaborate")}
          className={cn(
            "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "collaborate" 
              ? "border-primary text-foreground" 
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
          )}
        >
          Collaborate
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "chat" ? (
        <>
          {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              sender={message.senderId === selectedConversation.id ? "them" : "me"}
              message={message.content}
              timestamp={new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              isRead={message.isRead}
            />
          ))
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={sendMessage} />
        </>
      ) : (
        /* Collaborate Tab Content */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/10">
          <div className="max-w-md space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            </div>
            <h3 className="text-xl font-semibold">Shared Document</h3>
            <p className="text-muted-foreground text-sm">
              Collaborate in real-time on notes, ideas, and documents with {selectedConversation.name}.
            </p>
            <Button className="mt-4">
              Create Document
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
