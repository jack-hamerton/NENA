"use client";

import React, { useState } from "react";
import { 
  PlusCircle, 
  Users2, 
  ArrowLeft,
  GraduationCap
} from "lucide-react";
import { 
  Study, 
  StudyUserMode, 
  ParticipantStep 
} from "@/types";
import { Button } from "@/components/ui/button";
import { CreatorStudio } from "@/components/study/CreatorStudio";
import { ParticipantGate } from "@/components/study/ParticipantGate";
import { ParticipantConsent } from "@/components/study/ParticipantConsent";
import { ParticipantQuestionnaire } from "@/components/study/ParticipantQuestionnaire";

export default function StudyRoomPage() {
  const [mode, setMode] = useState<StudyUserMode | null>(null);
  const [participantStep, setParticipantStep] = useState<ParticipantStep>("gate");
  const [activeStudy, setActiveStudy] = useState<Study | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  // Mock study fetching for demo purposes
  const handleJoinStudy = (code: string) => {
    setIsJoining(true);
    // Simulate API call
    setTimeout(() => {
      const mockStudy: Study = {
        id: "s1",
        title: "African Tech Adoption 2024",
        description: "A research project investigating how mobile-first solutions are impacting rural economies.",
        methodology: "Survey",
        unique_code: code,
        author_id: "u1",
        created_at: new Date().toISOString(),
        questions: [
          { id: "q1", text: "How often do you use mobile banking apps?", type: "quantitative", study_id: "s1" },
          { id: "q2", text: "What is your primary device for accessing the internet?", type: "quantitative", study_id: "s1" },
          { id: "q3", text: "Please share a story about how technology changed your daily work routine.", type: "qualitative", study_id: "s1" },
        ]
      };
      setActiveStudy(mockStudy);
      setIsJoining(false);
      setParticipantStep("consent");
    }, 1200);
  };

  const handleSubmitAnswers = (answers: Record<string, string>) => {
    console.log("Answers submitted:", answers);
    setParticipantStep("complete");
  };

  const handleReset = () => {
    setMode(null);
    setParticipantStep("gate");
    setActiveStudy(null);
  };

  if (!mode) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 flex flex-col items-center justify-center min-h-[80vh] space-y-12 animate-in fade-in duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-2 ring-1 ring-primary/20">
            <GraduationCap className="w-8 h-8 text-primary shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Study Room
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto font-medium">
            Join a research project or build your own study to gather deep insights using AI analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button
            onClick={() => setMode("participant")}
            className="group relative bg-card border border-border rounded-3xl p-10 text-left hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 duration-300"
          >
            <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
              <Users2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black mb-2">Join a Study</h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
              Use a unique code to participate in active research projects and share your perspective.
            </p>
            <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
              <PlusCircle className="w-6 h-6 text-primary" />
            </div>
          </button>

          <button
            onClick={() => setMode("creator")}
            className="group relative bg-card border border-border rounded-3xl p-10 text-left hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 duration-300"
          >
            <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
              <PlusCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black mb-2">Create a Project</h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
              Design a research protocol, add questions, and visualize high-level AI-driven analytics.
            </p>
            <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
              <PlusCircle className="w-6 h-6 text-primary" />
            </div>
          </button>
        </div>
        
        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] opacity-40">
          NENA Digital Research Institute • Protocol 2024.A
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleReset}
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Button>
        </div>

        {mode === "creator" && <CreatorStudio />}

        {mode === "participant" && (
          <div className="pb-20">
            {participantStep === "gate" && (
              <ParticipantGate onJoin={handleJoinStudy} isLoading={isJoining} />
            )}
            
            {participantStep === "consent" && activeStudy && (
              <ParticipantConsent 
                study={activeStudy} 
                onConsent={() => setParticipantStep("questionnaire")}
                onDecline={handleReset}
              />
            )}

            {participantStep === "questionnaire" && activeStudy && (
              <ParticipantQuestionnaire 
                study={activeStudy} 
                onSubmit={handleSubmitAnswers}
              />
            )}

            {participantStep === "complete" && (
              <div className="max-w-md mx-auto py-12 bg-card border border-border rounded-3xl shadow-xl flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-500">
                <div className="p-4 bg-emerald-500/10 rounded-full">
                  <GraduationCap className="w-12 h-12 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight">Thank You!</h2>
                  <p className="text-muted-foreground text-sm font-medium px-8 leading-relaxed">
                    Your contribution has been successfully submitted and added to our research. 
                    Your insights are invaluable.
                  </p>
                </div>
                <Button 
                  onClick={handleReset}
                  className="rounded-2xl h-12 px-8 font-bold"
                >
                  Return to Hub
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
