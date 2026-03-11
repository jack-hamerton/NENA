"use client";

import { ConversationList } from "@/components/messages/ConversationList";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChatProvider } from "@/context/ChatContext";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConversationOpen = pathname.split("/").length > 2;

  return (
    <ChatProvider>
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Sidebar - Hidden on mobile if a conversation is open */}
        <div 
          className={cn(
            "w-full md:w-80 border-r flex flex-col transition-all",
            isConversationOpen ? "hidden md:flex" : "flex"
          )}
        >
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                className="pl-9 bg-muted/50 border-none focus-visible:ring-1" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <ConversationList />
          </div>
        </div>

        {/* Main Content - Chat Window */}
        <div 
          className={cn(
            "flex-1 flex flex-col transition-all",
            !isConversationOpen ? "hidden md:flex" : "flex"
          )}
        >
          {children}
        </div>
      </div>
    </ChatProvider>
  );
}
