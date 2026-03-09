"use client";

import React, { useState } from "react";
import { KeyRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParticipantGateProps {
  onJoin: (code: string) => void;
  isLoading?: boolean;
}

export function ParticipantGate({ onJoin, isLoading = false }: ParticipantGateProps) {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onJoin(code.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-6 bg-card border border-border rounded-3xl shadow-xl shadow-primary/5 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-4 bg-primary/10 rounded-2xl">
          <KeyRound className="w-10 h-10 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Join a Study</h2>
          <p className="text-muted-foreground text-sm">
            Enter the unique research code provided by your facilitator to begin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="study-code" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Research Code
            </label>
            <input
              id="study-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. NENA-2024"
              className="w-full bg-muted/30 border-2 border-border rounded-2xl px-6 py-4 text-center text-xl font-black tracking-widest focus:outline-none focus:border-primary transition-all placeholder:text-muted/40 uppercase"
              maxLength={12}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={!code.trim() || isLoading}
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isLoading ? "Verifying..." : <>Enter Study Room <ArrowRight className="w-5 h-5" /></>}
          </Button>
        </form>

        <p className="text-[10px] text-muted-foreground pt-4 border-t border-border w-full">
          Your participation helps advance African digital research. 
          All data is handled according to our Ethics Protocol.
        </p>
      </div>
    </div>
  );
}
