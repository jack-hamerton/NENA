export type QuestionType = "qualitative" | "quantitative";
export type Methodology = "Survey" | "KII";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  study_id: string;
}

export interface QuestionInput {
  text: string;
  type: QuestionType;
}

export interface Study {
  id: string;
  title: string;
  description: string;
  methodology: Methodology;
  questions: Question[];
  unique_code: string;
  author_id: string;
  created_at: string;
}

export interface StudyCreateInput {
  title: string;
  description: string;
  methodology: Methodology;
  questions: QuestionInput[];
}

export interface AnswerSubmission {
  user_id: string;
  answers: Record<string, string>; // question_id -> answer_text
}

export interface Quote {
  text: string;
  author: string;
}

export interface Theme {
  keyword: string;
  count: number;
}

export interface SentimentBreakdown {
  positive: number;
  negative: number;
  neutral: number;
}

export interface AnalysisResult {
  study_id: string;
  participant_count: number;
  sentiment: SentimentBreakdown;
  themes: Theme[];
  key_quotes: Quote[];
  insights: string[];
  answers_table: {
    headers: string[];
    rows: string[][];
  };
}

export type StudyUserMode = "creator" | "participant";
export type CreatorTab = "build" | "dashboard" | "findings" | "methodology";
export type ParticipantStep = "gate" | "consent" | "questionnaire" | "complete";
