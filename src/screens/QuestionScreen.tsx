import { questions } from '../data/questions';
import type { Answers } from '../types';

export function QuestionScreen({
  index,
  answers,
  onAnswer,
}: {
  index: number;
  answers: Answers;
  onAnswer: (questionId: keyof Answers, optionId: string) => void;
}) {
  const question = questions[index];

  return (
    <section className="screen question-screen">
      <div className="step-indicator">
        <span>Pregunta {index + 1}</span>
        <strong>{index + 1}/{questions.length}</strong>
      </div>
      <h2>{question.title}</h2>
      <div className="option-grid">
        {question.options.map((option) => (
          <button
            className={answers[question.id] === option.id ? 'option-card selected' : 'option-card'}
            key={option.id}
            onClick={() => onAnswer(question.id, option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
