"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { messageService } from "@/services/message.service";
import { Conversation, Message } from "@/types";
import { ChatHeader } from "@/components/messages/ChatHeader";
import { MessageList } from "@/components/messages/MessageList";
import { MessageInput } from "@/components/messages/MessageInput";
import { Loader2 } from "lucide-react";

export default function ConversationPage() {
  const { id } = useParams() as { id: string };
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mocking current user ID (this should come from auth state in a real app)
  const currentUserId = "me"; 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [convData, msgsData] = await Promise.all([
          messageService.getConversationById(id),
          messageService.getMessages(id)
        ]);
        setConversation(convData);
        setMessages(msgsData || []);
      } catch (error) {
        console.error("Failed to fetch conversation data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSendMessage = async (content: string) => {
    try {
      const newMessage = await messageService.sendMessage({
        conversationId: id,
        content,
        type: "chat"
      });
      setMessages((prev) => [...prev, { ...newMessage, isMe: true }]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Conversation not found.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      <ChatHeader conversation={conversation} />
      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput 
        conversationId={id} 
        onSend={handleSendMessage} 
      />
    </div>
  );
}
