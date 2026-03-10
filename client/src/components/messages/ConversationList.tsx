import { useEffect, useState } from "react";
import { messageService } from "@/services/message.service";
import { Conversation } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";

export function ConversationList() {
  const params = useParams();
  const activeId = params.id as string;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await messageService.getConversations();
        setConversations(data || []);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-2 w-full bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {conversations.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          No conversations yet.
        </div>
      ) : (
        conversations.map((conv) => (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className={cn(
              "flex items-center gap-3 rounded-lg p-3 transition-colors",
              activeId === conv.id 
                ? "bg-primary/10 text-primary hover:bg-primary/20" 
                : "hover:bg-accent"
            )}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={conv.avatar} alt={conv.name} />
              <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm truncate">{conv.name}</p>
                {conv.lastMessageTime && (
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: false })}
                  </span>
                )}
              </div>
              <p className={cn(
                "text-xs truncate",
                conv.unreadCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"
              )}>
                {conv.lastMessage || "No messages yet"}
              </p>
            </div>
            {conv.unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                {conv.unreadCount}
              </span>
            )}
          </Link>
        ))
      )}
    </div>
  );
}
