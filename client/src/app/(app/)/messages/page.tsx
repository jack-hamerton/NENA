import { MessageCircle } from "lucide-react";
import { ConversationList } from "@/components/messages/ConversationList";

export default function MessagesPage() {
  return (
    <div className="grid h-[calc(100vh-140px)] gap-4 md:grid-cols-[300px_1fr]">
      <div className="flex flex-col border-r pr-4 space-y-4">
        <h1 className="text-xl font-bold">Messages</h1>
        <div className="flex-1 overflow-y-auto">
          <ConversationList />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/20 rounded-2xl border border-dashed border-white/10">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <MessageCircle className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-semibold">Your Messages</h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
          Select a conversation from the list to start chatting with your friends.
        </p>
      </div>
    </div>
  );
}
