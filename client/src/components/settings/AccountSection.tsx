"use client";

import { useAuth } from "@/context/AuthContext";
import { User, LogOut, Mail, AtSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export function AccountSection() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Card className="border-white/5 bg-background/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
      <CardHeader className="p-8 border-b border-white/5 bg-accent/5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/20 text-primary shadow-lg">
            <User className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black italic tracking-tighter uppercase">Account Profile</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">
              Your public and private identity
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8 bg-accent/5 p-6 rounded-[2.5rem] border border-white/5">
          <Avatar className="h-24 w-24 border-4 border-background shadow-2xl">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="text-2xl font-black uppercase bg-primary text-white">
              {user.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left space-y-1">
            <h3 className="text-2xl font-black tracking-tight">{user.displayName}</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AtSign className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">@{user.username}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{user.email}</span>
              </div>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="rounded-2xl px-6 font-black italic uppercase tracking-tight border-destructive/20 text-destructive hover:bg-destructive/10 h-12"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" /> End Session
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-accent/10 border border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Calendar className="h-4 w-4 text-muted-foreground" />
               <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Member Since</span>
             </div>
             <span className="text-sm font-black italic tracking-tighter uppercase">
               {user.createdAt ? format(new Date(user.createdAt), "MMM yyyy") : "N/A"}
             </span>
          </div>
          <div className="p-5 rounded-2xl bg-accent/10 border border-white/5 flex items-center justify-between opacity-50">
             <div className="flex items-center gap-3">
               <ShieldCheck className="h-4 w-4 text-muted-foreground" />
               <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</span>
             </div>
             <span className="text-xs font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-500">
               Verified Advocate
             </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
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
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
