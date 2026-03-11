"use client";

import React, { useState, useEffect } from "react";
import { 
  LineChart, 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  Share2, 
  RefreshCcw,
  Users,
  MessageSquare
} from "lucide-react";
import { 
  CreatorTab, 
  Study, 
  AnalysisResult, 
  QuestionInput, 
  Methodology 
} from "@/types";
import { Button } from "@/components/ui/button";
import { CreatorQuestionBuilder } from "./CreatorQuestionBuilder";
import { KPIStatStrip } from "./charts/KPIStatStrip";
import { SentimentDonut } from "./charts/SentimentDonut";
import { ThemeWordCloud } from "./charts/ThemeWordCloud";
import { QuoteCard } from "./charts/QuoteCard";
import { InsightList } from "./charts/InsightList";
import { QualTable } from "./charts/QualTable";
import { studyService } from "@/services/study.service";

interface CreatorStudioProps {
  studyId?: string;
  initialStudy?: Study;
}

export function CreatorStudio({ studyId, initialStudy }: CreatorStudioProps) {
  const [activeTab, setActiveTab] = useState<CreatorTab>("build");
  const [study, setStudy] = useState<Study | null>(initialStudy || null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for initial dashboard view if no analysis yet
  const mockAnalysis: AnalysisResult = {
    study_id: studyId || "preview",
    participant_count: 12,
    sentiment: { positive: 65, negative: 15, neutral: 20 },
    themes: [
      { keyword: "User Experience", count: 12 },
      { keyword: "Accessibility", count: 8 },
      { keyword: "Performance", count: 6 },
      { keyword: "Design", count: 4 },
      { keyword: "Mobile", count: 3 },
    ],
    key_quotes: [
      { text: "The interface feels very intuitive and snappy.", author: "Participant #4" },
      { text: "I wish there were more color customization options.", author: "Participant #9" },
    ],
    insights: [
      "Users highly value the clean aesthetic.",
      "Navigation is the most praised feature.",
      "Consider improving dark mode contrast.",
    ],
    answers_table: {
      headers: ["Question", "Average Sentiment", "Common Response"],
      rows: [
        ["How do you like the UI?", "Positive", "Very clean and modern"],
        ["Is it easy to use?", "Neutral", "Mostly, but menu is hidden"],
      ],
    },
  };

  useEffect(() => {
    if (studyId && !analysis) {
      // In a real app, we'd fetch or use WebSockets here
      // For now, we'll use mock data to show the UI
      setAnalysis(mockAnalysis);
    }
  }, [studyId]);

  const handleSaveStudy = async (questions: QuestionInput[], methodology: Methodology) => {
    setIsSaving(true);
    try {
      // In a real app:
      // const newStudy = await studyService.createStudy({
      //   title: "New Study",
      //   description: "Description",
      //   methodology,
      //   questions,
      // });
      // setStudy(newStudy);
      setTimeout(() => {
        setIsSaving(false);
        setActiveTab("dashboard");
      }, 1500);
    } catch (error) {
      console.error("Failed to save study", error);
      setIsSaving(false);
    }
  };

  const tabs: { id: CreatorTab; label: string; icon: React.ReactNode }[] = [
    { id: "build", label: "Build", icon: <LineChart className="w-4 h-4" /> },
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "findings", label: "Findings", icon: <Search className="w-4 h-4" /> },
    { id: "methodology", label: "Methodology", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            {study?.title || "Project Study Room"}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {study ? `Unique Code: ${study.unique_code}` : "Drafting your research study"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {study && (
            <Button variant="outline" className="rounded-xl flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Link
            </Button>
          )}
          <Button variant="ghost" size="icon" className="rounded-xl">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1 bg-muted/30 border border-border rounded-2xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-card text-primary shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-2 min-h-[400px]">
        {activeTab === "build" && (
          <CreatorQuestionBuilder onSave={handleSaveStudy} isSaving={isSaving} />
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <KPIStatStrip
              stats={[
                { title: "Participants", value: analysis?.participant_count || 0, icon: "👥" },
                { title: "Completion Rate", value: "92%", icon: "✅" },
                { title: "Avg. Time", value: "4m 12s", icon: "⏱️" },
                { title: "Insights", value: analysis?.insights.length || 0, icon: "💡" },
              ]}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-card border border-border rounded-xl p-6">
                <SentimentDonut data={analysis?.sentiment || mockAnalysis.sentiment} />
              </div>
              <div className="md:col-span-2">
                <ThemeWordCloud themes={analysis?.themes || mockAnalysis.themes} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <Users className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-base">Key Participant Quotes</h3>
                </div>
                {(analysis?.key_quotes || mockAnalysis.key_quotes).map((quote, i) => (
                  <QuoteCard key={i} quote={quote} />
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <LineChart className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-base">Analytical Insights</h3>
                </div>
                <InsightList insights={analysis?.insights || mockAnalysis.insights} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "findings" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <QualTable data={analysis?.answers_table || mockAnalysis.answers_table} />
          </div>
        )}

        {activeTab === "methodology" && (
          <div className="bg-card border border-border rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Research Methodology</h2>
            <p className="text-muted-foreground max-w-md">
              This study uses a <strong>{study?.methodology || "Mixed-Methods"}</strong> approach 
              to gather participant sentiment and qualitative feedback.
            </p>
            <div className="w-full max-w-lg border border-border rounded-xl p-4 text-left">
              <h4 className="font-bold text-sm mb-2">Protocol Details</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Automated sentiment classification using LLM</li>
                <li>• Theme extraction via semantic clustering</li>
                <li>• Real-time data visualization via WebSockets</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
