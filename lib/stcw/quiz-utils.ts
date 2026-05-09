import type { QuizMode, QuizResult, StcwQuestion } from "./quiz-types";

export function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export function getQuizQuestions(
  questions: StcwQuestion[],
  mode: QuizMode
): StcwQuestion[] {
  return shuffleArray(questions).slice(0, mode);
}

export function calculateQuizResult(
  questions: StcwQuestion[],
  answers: Record<string, number>
): QuizResult {
  let correctCount = 0;
  const wrongQuestionIds: string[] = [];

  questions.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      correctCount++;
    } else {
      wrongQuestionIds.push(q.id);
    }
  });

  const totalQuestions = questions.length;
  const wrongCount = totalQuestions - correctCount;
  const score = Math.round((correctCount / totalQuestions) * 100);

  return {
    totalQuestions,
    correctCount,
    wrongCount,
    score,
    passed: score >= 70,
    wrongQuestionIds,
  };
}