import { questions } from '../data/questions';
import { baseScore, dimensions, maxRawScore, minRawScore } from '../data/scoringRules';
import type { Answers, Scores } from '../types';

const clamp = (value: number) => Math.min(maxRawScore, Math.max(minRawScore, value));

export function calculateScores(answers: Answers): Scores {
  const totals = dimensions.reduce(
    (acc, dimension) => ({ ...acc, [dimension]: baseScore }),
    {} as Scores,
  );

  questions.forEach((question) => {
    const selectedOption = question.options.find((option) => option.id === answers[question.id]);
    if (!selectedOption) return;

    Object.entries(selectedOption.weights).forEach(([dimension, weight]) => {
      totals[dimension as keyof Scores] = clamp(totals[dimension as keyof Scores] + Number(weight));
    });
  });

  return totals;
}

export function calculateTotalScore(scores: Scores): number {
  const values = Object.values(scores);
  return Math.round(values.reduce((sum, score) => sum + score, 0) / values.length);
}

export function getSelectedOptionLabel(answers: Answers, questionId: keyof Answers): string {
  const question = questions.find((item) => item.id === questionId);
  const option = question?.options.find((item) => item.id === answers[questionId]);
  return option?.label ?? 'Sin respuesta';
}
