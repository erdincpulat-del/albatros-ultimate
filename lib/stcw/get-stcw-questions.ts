"use client";

import type { QuizMode, StcwQuestion } from "./quiz-types";
import { supabase } from "../supabase-client";

type DbQuestion = {
  question_code: string;
  category: StcwQuestion["category"];
  difficulty: StcwQuestion["difficulty"];
  question: string;
  options: string[] | string;
  correct_answer: number;
  explanation: string;
};

export async function getStcwQuestionsFromSupabase(
  mode: QuizMode
): Promise<StcwQuestion[]> {
  const { data, error } = await supabase.rpc("get_stcw_quiz_questions", {
    question_limit: mode,
  });

  if (error) {
    console.error("STCW Supabase RPC error:", error);
    return [];
  }

  const rows = (data || []) as DbQuestion[];

  return rows.map((q) => ({
    id: q.question_code,
    category: q.category,
    difficulty: q.difficulty,
    type: "theory",
    level: "basic",
    scenario: undefined,
    question: q.question,
    options:
      typeof q.options === "string" ? JSON.parse(q.options) : q.options,
    correctAnswer: q.correct_answer,
    explanation: q.explanation,
  }));
}