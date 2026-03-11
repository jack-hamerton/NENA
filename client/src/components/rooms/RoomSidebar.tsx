"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  MessageSquare, 
  BarChart3, 
  Sparkles,
  User,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Participant, RoomMessage } from "@/types/room";
import { cn } from "@/lib/utils";

interface RoomSidebarProps {
  roomId: string;
  messages: RoomMessage[];
  onSendMessage: (content: string) => void;
  roomParticipants: Participant[];
}

export function RoomSidebar({ messages, onSendMessage, roomParticipants }: RoomSidebarProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [input, setInput] = useState("");
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleAiRewrite = (tone: string) => {
    const rewrites: Record<string, string> = {
      formal: `I would like to suggest: ${input}`,
      friendly: `Hey! I was thinking maybe: ${input} 😊`,
      respectful: `With all due respect, I believe: ${input}`,
      concise: `${input.substring(0, 50)}...`,
    };
    if (input.trim()) {
      setInput(rewrites[tone] || input);
    }
    setIsAiMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-md border-l border-white/10">
      {/* Tab Headers */}
      <div className="px-4 pt-3 border-b border-white/5">
        <div className="grid w-full grid-cols-3 bg-white/5 rounded-lg p-1">
          <TabButton 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')}
            icon={<MessageSquare className="h-3 w-3" />}
            label="Chat"
          />
          <TabButton 
            active={activeTab === 'polls'} 
            onClick={() => setActiveTab('polls')}
            icon={<BarChart3 className="h-3 w-3" />}
            label="Polls"
          />
          <TabButton 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
            icon={<User className="h-3 w-3" />}
            label="People"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Content */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/40 text-xs opacity-50">
                  <MessageSquare className="h-10 w-10 mb-2" />
                  <p>Start the conversation</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3 group">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={msg.avatarUrl} />
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {msg.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-bold text-white">{msg.username}</span>
                        <span className="text-[9px] text-white/40">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="bg-white/5 rounded-2xl p-3 text-xs leading-relaxed border border-white/5 text-white/90">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-1 border border-white/10 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent py-2 text-xs focus:outline-none text-white placeholder:text-white/20"
                />
                
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-7 w-7 rounded-full transition-colors text-white/60", isAiMenuOpen ? "bg-primary/20 text-primary" : "hover:bg-white/10")}
                    onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </Button>
                  
                  {isAiMenuOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-40 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <AiMenuOption onClick={() => handleAiRewrite('formal')} label="Formal Tone" />
                      <AiMenuOption onClick={() => handleAiRewrite('friendly')} label="Friendly Tone" />
                      <AiMenuOption onClick={() => handleAiRewrite('respectful')} label="Respectful Tone" />
                      <AiMenuOption onClick={() => handleAiRewrite('concise')} label="Make Concise" />
                    </div>
                  )}
                </div>

                <Button 
                  variant="default" 
                  size="icon" 
                  className="h-7 w-7 rounded-full shrink-0" 
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Polls Content */}
        {activeTab === 'polls' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="bg-primary/5 rounded-xl border border-primary/20 p-4 space-y-3">
               <h4 className="text-xs font-bold flex items-center gap-2 text-primary">
                 <BarChart3 className="h-4 w-4" /> Active Poll
               </h4>
               <p className="text-xs font-medium text-white/90">Which design style do you prefer for our next drop?</p>
               <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-between text-[11px] h-9 hover:bg-white/10 text-white/70 border-white/10">
                    Traditional/Authentic <span>42%</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-between text-[11px] h-9 hover:bg-white/10 text-white/70 border-white/10">
                    Modern/Minimalist <span>58%</span>
                  </Button>
               </div>
               <p className="text-[10px] text-white/40 text-center">126 people voted</p>
            </div>
            
            <Button variant="outline" className="w-full border-dashed border-white/20 gap-2 text-[10px] h-10 text-white/60 hover:text-white">
              <Plus className="h-3.5 w-3.5" /> Create New Poll
            </Button>
          </div>
        )}

        {/* People Content */}
        {activeTab === 'users' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">In the room</h4>
                <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{roomParticipants.length}</span>
             </div>
             <div className="space-y-3">
                {roomParticipants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={p.avatarUrl} />
                         <AvatarFallback className="text-[10px] bg-white/10 text-primary">
                           {p.username[0].toUpperCase()}
                         </AvatarFallback>
                       </Avatar>
                       <div className="min-w-0">
                          <p className="text-xs font-medium truncate text-white">{p.displayName || p.username}</p>
                          <p className="text-[10px] text-white/40 capitalize">{p.role}</p>
                       </div>
                    </div>
                    {p.role === "host" && <Badge variant="secondary" className="text-[8px] h-4 bg-primary/20 text-primary border-none">Host</Badge>}
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-[10px] font-medium transition-all duration-200",
        active ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:bg-white/5 hover:text-white/60"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function AiMenuOption({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 text-xs text-white/70 hover:bg-white/10 rounded-lg transition-colors"
    >
      {label}
    </button>
  );
}
