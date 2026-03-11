"use client";

import { useState, useEffect } from "react";
import { 
  format, 
} from "date-fns";
import { EventCreate, CalendarEvent, ConflictDetail } from "@/types/calendar";
import { userService } from "@/services/user.service";
import { User } from "@/types";
import { X, Search, Clock, Users, Layout, AlertCircle, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventCreate) => Promise<void>;
  selectedDate: Date;
  initialEvent?: CalendarEvent | null;
  conflict?: ConflictDetail | null;
}

export function EventDialog({ isOpen, onClose, onSubmit, selectedDate, initialEvent, conflict }: EventDialogProps) {
  const [formData, setFormData] = useState<EventCreate>({
    title: "",
    description: "",
    start_time: format(selectedDate, "yyyy-MM-dd'T'HH:00"),
    end_time: format(selectedDate, "yyyy-MM-dd'T'HH:00"),
    collaborator_ids: []
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        title: initialEvent.title,
        description: initialEvent.description || "",
        start_time: format(new Date(initialEvent.start_time), "yyyy-MM-dd'T'HH:mm"),
        end_time: format(new Date(initialEvent.end_time), "yyyy-MM-dd'T'HH:mm"),
        collaborator_ids: initialEvent.collaborators?.map(c => c.id) || []
      });
      // In a real app, we'd fetch the user objects for the collaborators
    } else {
      setFormData({
        title: "",
        description: "",
        start_time: format(selectedDate, "yyyy-MM-dd'T'10:00"),
        end_time: format(selectedDate, "yyyy-MM-dd'T'11:00"),
        collaborator_ids: []
      });
      setSelectedUsers([]);
    }
  }, [initialEvent, selectedDate, isOpen]);

  useEffect(() => {
    const search = async () => {
      if (searchQuery.length > 1) {
        const results = await userService.searchUsers(searchQuery);
        setSearchResults(results.filter(u => !selectedUsers.find(su => su.id === u.id)));
      } else {
        setSearchResults([]);
      }
    };
    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedUsers]);

  const addUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setFormData({
      ...formData,
      collaborator_ids: [...(formData.collaborator_ids || []), user.id]
    });
    setSearchQuery("");
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
    setFormData({
      ...formData,
      collaborator_ids: formData.collaborator_ids?.filter(id => id !== userId) || []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card border shadow-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b flex items-center justify-between bg-accent/5">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-primary/20 text-primary">
                <Layout className="h-5 w-5" />
             </div>
             <h2 className="text-xl font-black italic tracking-tighter uppercase">
               {initialEvent ? "Edit Event" : "New Event"}
             </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {conflict && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-3">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <AlertCircle className="h-4 w-4" />
                {conflict.message}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {conflict.available_slots.map((slot, idx) => (
                  <Button 
                    key={idx}
                    type="button"
                    variant="outline" 
                    size="sm" 
                    className="text-[10px] font-bold h-9 bg-background/50 border-destructive/20 hover:bg-destructive/5 hover:border-destructive/40"
                    onClick={() => setFormData({
                      ...formData,
                      start_time: format(new Date(slot.start), "yyyy-MM-dd'T'HH:mm"),
                      end_time: format(new Date(slot.end), "yyyy-MM-dd'T'HH:mm")
                    })}
                  >
                    <Check className="h-3 w-3 mr-1 text-green-500" />
                    {format(new Date(slot.start), "HH:mm")} - {format(new Date(slot.end), "HH:mm")}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Event Title</label>
              <Input 
                autoFocus
                placeholder="Synchronized Board Meeting..." 
                className="h-12 border-white/5 bg-accent/20 rounded-xl px-4 shadow-inner font-bold text-lg"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Starts At</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="datetime-local" 
                    className="pl-10 h-11 border-white/5 bg-accent/20 rounded-xl"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ends At</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="datetime-local" 
                    className="pl-10 h-11 border-white/5 bg-accent/20 rounded-xl"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Participants</label>
              <div className="p-3 bg-accent/20 rounded-2xl border border-white/5 space-y-3 min-h-[80px]">
                <div className="flex flex-wrap gap-2">
                   {selectedUsers.map(user => (
                     <Badge key={user.id} variant="secondary" className="pl-1 pr-1.5 py-1 gap-1.5 rounded-lg border-primary/20 bg-primary/5">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user.avatarUrl || ""} />
                          <AvatarFallback className="text-[10px]">{user.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-bold">{user.username}</span>
                        <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeUser(user.id)} />
                     </Badge>
                   ))}
                   {selectedUsers.length === 0 && (
                     <span className="text-xs text-muted-foreground font-medium italic p-1">No participants added yet...</span>
                   )}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input 
                    placeholder="Search users to invite..." 
                    className="pl-8 h-9 border-none bg-background/50 rounded-lg text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border shadow-xl rounded-xl overflow-hidden z-10 animate-in slide-in-from-top-2">
                       {searchResults.map(user => (
                         <button 
                           key={user.id}
                           type="button"
                           className="flex items-center gap-3 w-full p-2.5 hover:bg-primary/10 transition-colors text-left border-b last:border-0"
                           onClick={() => addUser(user)}
                         >
                            <Avatar className="h-8 w-8 shadow-sm">
                              <AvatarImage src={user.avatarUrl || ""} />
                              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                               <p className="text-xs font-black">{user.username}</p>
                               <p className="text-[10px] text-muted-foreground">User ID: {user.id.slice(0, 8)}...</p>
                            </div>
                            <Plus className="h-3 w-3 ml-auto text-primary" />
                         </button>
                       ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Event Details</label>
              <textarea 
                placeholder="Describe the objective of this session..." 
                className="w-full min-h-[100px] bg-accent/20 border border-white/5 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-shadow"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </form>

        <div className="p-6 border-t bg-accent/5 flex items-center justify-between">
           {initialEvent && (
              <Button type="button" variant="ghost" className="text-destructive font-bold text-xs hover:bg-destructive/10">Delete Event</Button>
           )}
           <div className="flex items-center gap-3 ml-auto">
             <Button type="button" variant="ghost" className="font-bold rounded-xl" onClick={onClose}>Discard</Button>
             <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || !formData.title} 
                className="font-black italic px-8 h-11 rounded-xl shadow-lg shadow-primary/20 tracking-tight"
             >
               {initialEvent ? "UPDATE SESSION" : "CONFIRM SCHEDULE"}
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
