"use client";

import React, { useState } from "react";
import { Send, MessageSquare, ListTodo, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Study, Question } from "@/types";

interface ParticipantQuestionnaireProps {
  study: Study;
  onSubmit: (answers: Record<string, string>) => void;
  isSubmitting?: boolean;
}

export function ParticipantQuestionnaire({ 
  study, 
  onSubmit, 
  isSubmitting = false 
}: ParticipantQuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all questions answered
    const unanswered = study.questions.filter(q => !answers[q.id]?.trim());
    if (unanswered.length > 0) {
      setError(`Please answer all questions before submitting. (${unanswered.length} remaining)`);
      return;
    }

    onSubmit(answers);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-10 space-y-2 px-2">
        <div className="flex items-center gap-2 text-primary">
          <ListTodo className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest">Questionnaire</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight">{study.title}</h2>
        <p className="text-muted-foreground text-sm font-medium">
          {study.description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {study.questions.map((question, i) => (
          <div 
            key={question.id}
            className="group bg-card border border-border rounded-3xl p-8 space-y-6 hover:border-primary/30 transition-all shadow-sm shadow-primary/5"
          >
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">
                {i + 1}
              </span>
              <div className="space-y-1">
                <h4 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                  {question.text}
                </h4>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                  {question.type} response
                </p>
              </div>
            </div>

            {question.type === "quantitative" ? (
              <div className="flex flex-wrap gap-2">
                {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswerChange(question.id, option)}
                    className={`px-4 py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                      answers[question.id] === option
                        ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                        : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative">
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Share your thoughts here..."
                  className="w-full bg-muted/30 border-2 border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all min-h-[140px] resize-none"
                />
                <div className="absolute top-4 right-4 opacity-20 group-focus-within:opacity-100 transition-opacity">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
              </div>
            )}
          </div>
        ))}

        {error && (
          <div className="p-4 bg-destructive/10 border-2 border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-sm font-bold animate-in bounce-in duration-500">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="pt-8 border-t border-border flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            {isSubmitting ? "Submitting..." : <><Send className="w-6 h-6" /> Submit Responses</>}
          </Button>
        </div>
      </form>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-40">
          NENA Digital Research Institute • Protocol {study.unique_code}
        </p>
      </div>
    </div>
  );
}
