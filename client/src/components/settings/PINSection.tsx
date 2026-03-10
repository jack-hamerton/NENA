"use client";

import { useState, useEffect } from "react";
import { Lock, ShieldCheck, ShieldAlert, KeyRound, Eraser, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PINSection() {
  const [hasPin, setHasPin] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const storedPin = localStorage.getItem("app_pin");
    setHasPin(!!storedPin);
  }, []);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSetPin = () => {
    clearMessages();
    if (newPin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }
    if (newPin !== confirmNewPin) {
      setError("PINs do not match");
      return;
    }

    localStorage.setItem("app_pin", newPin);
    setHasPin(true);
    setNewPin("");
    setConfirmNewPin("");
    setSuccess("Application PIN has been set successfully");
  };

  const handleChangePin = () => {
    clearMessages();
    const storedPin = localStorage.getItem("app_pin");
    if (currentPin !== storedPin) {
      setError("Current PIN is incorrect");
      return;
    }
    if (newPin.length !== 4) {
      setError("New PIN must be 4 digits");
      return;
    }
    if (newPin !== confirmNewPin) {
      setError("New PINs do not match");
      return;
    }

    localStorage.setItem("app_pin", newPin);
    setCurrentPin("");
    setNewPin("");
    setConfirmNewPin("");
    setSuccess("Application PIN has been changed successfully");
  };

  const handleRemovePin = () => {
    clearMessages();
    const storedPin = localStorage.getItem("app_pin");
    if (currentPin !== storedPin) {
      setError("Current PIN is incorrect to authorize removal");
      return;
    }

    localStorage.removeItem("app_pin");
    setHasPin(false);
    setCurrentPin("");
    setSuccess("Application PIN has been removed");
  };

  return (
    <Card className="border-white/5 bg-background/50 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
      <CardHeader className="p-8 border-b border-white/5 bg-accent/5">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-2xl shadow-lg",
            hasPin ? "bg-primary/20 text-primary" : "bg-orange-500/20 text-orange-500"
          )}>
            <Fingerprint className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black italic tracking-tighter uppercase">App Security</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">
              Local device protection
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        {(error || success) && (
          <div className={cn(
            "p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300",
            error ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
          )}>
            {error ? <ShieldAlert className="h-5 w-5 shrink-0" /> : <ShieldCheck className="h-5 w-5 shrink-0" />}
            <p className="text-sm font-bold uppercase tracking-tight">{error || success}</p>
          </div>
        )}

        {hasPin ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Authorization</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                  type="password"
                  placeholder="Enter current 4-digit PIN"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  maxLength={4}
                  className="pl-12 h-14 bg-accent/10 border-white/5 rounded-2xl font-mono text-lg tracking-[0.5em]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New PIN</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="New 4-digits"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    maxLength={4}
                    className="pl-12 h-14 bg-accent/10 border-white/5 rounded-2xl font-mono text-lg tracking-[0.5em]"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm New</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Repeat 4-digits"
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value)}
                    maxLength={4}
                    className="pl-12 h-14 bg-accent/10 border-white/5 rounded-2xl font-mono text-lg tracking-[0.5em]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                className="flex-1 h-12 rounded-2xl font-black italic tracking-tight uppercase shadow-lg shadow-primary/20"
                onClick={handleChangePin}
              >
                Update Security PIN
              </Button>
              <Button 
                variant="outline" 
                className="h-12 px-8 rounded-2xl font-black italic tracking-tight uppercase border-destructive/20 text-destructive hover:bg-destructive/10"
                onClick={handleRemovePin}
              >
                <Eraser className="h-4 w-4 mr-2" /> Disable Protection
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-4">
               <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                  <ShieldAlert className="h-5 w-5" />
               </div>
               <p className="text-sm font-medium text-orange-500/80 leading-relaxed">
                 You haven't set an application PIN. We recommend setting one to protect your data on this device.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Choose PIN</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="4-digit code"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    maxLength={4}
                    className="pl-12 h-14 bg-accent/10 border-white/5 rounded-2xl font-mono text-lg tracking-[0.5em]"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm PIN</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Repeat code"
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value)}
                    maxLength={4}
                    className="pl-12 h-14 bg-accent/10 border-white/5 rounded-2xl font-mono text-lg tracking-[0.5em]"
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-2xl font-black italic tracking-tight uppercase shadow-lg shadow-primary/20"
              onClick={handleSetPin}
            >
              Activate PIN Protection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
