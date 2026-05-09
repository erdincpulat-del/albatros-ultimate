// lib/stcw/quiz-types.ts

// 📌 KATEGORİLER
export type StcwCategory =
  | "fire"
  | "survival"
  | "firstAid"
  | "pssr"
  | "seamanship"
  | "watchkeeping"
  | "emergency";

// 📌 ZORLUK
export type StcwDifficulty = "easy" | "medium" | "hard";

// 🔥 YENİ ENGINE TYPE'LARI
export type QuestionType = "theory" | "decision" | "scenario";
export type QuestionLevel = "basic" | "intermediate" | "advanced";

// 🎯 SENARYO MODELİ
export type Scenario = {
  time: "day" | "night";
  visibility: "good" | "restricted";
  traffic: "low" | "medium" | "high";
  riskLevel: number;
};

// 🧠 ANA SORU MODELİ (UPGRADE EDİLDİ)
export type StcwQuestion = {
  id: string;
  category: StcwCategory;
  difficulty: StcwDifficulty;

  // 🔥 yeni alanlar
  type: QuestionType;
  level: QuestionLevel;
  scenario?: Scenario;

  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

// 🎯 QUIZ MODE
export type QuizMode = number;

// 📊 SONUÇ MODELİ
export type QuizResult = {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  score: number;
  passed: boolean;
  wrongQuestionIds: string[];
};