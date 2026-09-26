import { questions } from '../data/questions';
import { useAppServices } from '../context/AppServicesContext';
import { calculateScores, calculateTotalScore } from '../services/scoringEngine';
import type { Answers } from '../types';
import { createId } from '../utils/ids';

export function DevTools() {
  const { aiProvider, storageProvider } = useAppServices();

  if (!import.meta.env.DEV) return null;

  const generateMocks = async () => {
    for (let index = 0; index < 8; index += 1) {
      const answers = questions.reduce((acc, question, questionIndex) => {
        const option = question.options[(index + questionIndex) % question.options.length];
        return { ...acc, [question.id]: option.id };
      }, {} as Answers);
      const scores = calculateScores(answers);
      const insight = await aiProvider.analyze({ scores, answers });
      storageProvider.saveSession({
        id: createId('session'),
        createdAt: new Date().toISOString(),
        answers,
        scores,
        totalScore: calculateTotalScore(scores),
        insight,
      });
    }
  };

  return (
    <div className="dev-tools">
      <button onClick={generateMocks}>Mock data</button>
      <button onClick={() => storageProvider.clearData()}>Clear</button>
    </div>
  );
}
