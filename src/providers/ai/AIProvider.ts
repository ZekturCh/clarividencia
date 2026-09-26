import type { AIInsight, Answers, Scores } from '../../types';

export interface AIProvider {
  analyze(input: { scores: Scores; answers: Answers }): Promise<AIInsight>;
}
