"use client";

import React from "react";
import { ShieldCheck, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Study } from "@/types";

interface ParticipantConsentProps {
  study: Study;
  onConsent: () => void;
  onDecline: () => void;
}

export function ParticipantConsent({ study, onConsent, onDecline }: ParticipantConsentProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl shadow-primary/5">
        <div className="bg-primary/10 p-8 flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-card rounded-2xl shadow-sm ring-1 ring-primary/20">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Research Participation & Consent</h2>
          <p className="text-sm text-primary font-bold uppercase tracking-wider">
            Study: {study.title}
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4 leading-relaxed">
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-2xl ring-1 ring-border">
              <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium italic">
                You have been invited to participate in a research study. Before you begin, please read the following information carefully.
              </p>
            </div>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Purpose of Study
              </h4>
              <p className="text-xs">
                The purpose of this study is to gather feedback and insights using a <strong>{study.methodology}</strong> methodology.
                Your responses will help the research team understand user experiences and community sentiment.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Data Collection & Privacy
              </h4>
              <p className="text-xs">
                Your participation is voluntary. All data collected will be stored securely. 
                Individual responses will be used for AI-assisted qualitative analysis to extract themes and sentiments.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" /> Ethical Conduct
              </h4>
              <p className="text-xs italic underline underline-offset-4 decoration-primary/30">
                You can withdraw from this study at any time by closing this window. No data will be sent until you click "Submit" at the very end of the questionnaire.
              </p>
            </section>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
            <Button 
              variant="ghost" 
              onClick={onDecline}
              className="flex-1 h-14 rounded-2xl text-muted-foreground font-bold hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              I Decline
            </Button>
            <Button 
              onClick={onConsent}
              className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
            >
              I Agree & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
