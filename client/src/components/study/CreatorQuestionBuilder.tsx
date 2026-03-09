"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, HelpCircle } from "lucide-react";
import { QuestionInput, QuestionType, Methodology } from "@/types";
import { Button } from "@/components/ui/button";

interface CreatorQuestionBuilderProps {
  onSave: (questions: QuestionInput[], methodology: Methodology) => void;
  isSaving?: boolean;
}

export function CreatorQuestionBuilder({
  onSave,
  isSaving = false,
}: CreatorQuestionBuilderProps) {
  const [questions, setQuestions] = useState<QuestionInput[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("quantitative");
  const [methodology, setMethodology] = useState<Methodology>("Survey");

  const handleAddQuestion = () => {
    if (questionText.trim() && questions.length < 20) {
      setQuestions([...questions, { text: questionText, type: questionType }]);
      setQuestionText("");
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(questions, methodology);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="p-2 bg-primary/10 rounded-lg">
            <Plus className="w-5 h-5 text-primary" />
          </span>
          Build Your Study
        </h2>

        <div className="space-y-6">
          {/* Methodology Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              Study Methodology
              <HelpCircle className="w-4 h-4 opacity-50 cursor-help" />
            </label>
            <div className="flex gap-2">
              {(["Survey", "KII"] as Methodology[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethodology(m)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all text-sm font-medium ${
                    methodology === m
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {m === "KII" ? "Key Informant Interview (KII)" : "Survey"}
                </button>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-muted-foreground">
              Add Question (max 20)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Type your question here..."
                className="flex-grow bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={questions.length >= 20}
                onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
              />
              <div className="flex gap-2">
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                  className="bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="quantitative">Quantitative</option>
                  <option value="qualitative">Qualitative</option>
                </select>
                <Button
                  onClick={handleAddQuestion}
                  disabled={questions.length >= 20 || !questionText.trim()}
                  className="rounded-xl px-6"
                >
                  Add
                </Button>
              </div>
            </div>
            {questions.length >= 20 && (
              <p className="text-xs text-destructive font-medium">
                Maximum number of questions reached.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-lg">Your Questions ({questions.length})</h3>
          {questions.length > 0 && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {20 - questions.length} remaining
            </span>
          )}
        </div>

        <div className="space-y-3">
          {questions.length === 0 ? (
            <div className="bg-muted/20 border-2 border-dashed border-border rounded-2xl py-12 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                No questions added yet. Start by typing above.
              </p>
            </div>
          ) : (
            questions.map((q, i) => (
              <div
                key={i}
                className="group bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/40 hover:shadow-sm transition-all animate-in slide-in-from-left-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{q.text}</p>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary/70">
                      {q.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeQuestion(i)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-border flex justify-end">
        <Button
          onClick={handleSave}
          disabled={questions.length === 0 || isSaving}
          className="w-full sm:w-auto min-w-[200px] h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          {isSaving ? "Saving..." : <><Save className="w-5 h-5" /> Save and Publish Study</>}
        </Button>
      </div>
    </div>
  );
}
