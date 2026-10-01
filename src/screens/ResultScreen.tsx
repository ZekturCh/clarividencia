import { RadarChart } from '../components/RadarChart';
import type { AIInsight, Scores } from '../types';

export function ResultScreen({
  scores,
  totalScore,
  insight,
  onLead,
}: {
  scores: Scores;
  totalScore: number;
  insight: AIInsight;
  onLead: () => void;
}) {
  return (
    <section className="screen result-screen">
      <p className="eyebrow">Tu pulso cultural</p>
      <div className="result-layout">
        <div className="score-column">
          <div className="score-panel">
            <RadarChart scores={scores} />
            <div className="score-badge">
              <strong>{totalScore}</strong>
              <span>/100</span>
            </div>
          </div>
          <button className="primary-button result-cta" onClick={onLead}>QUIERO RECIBIR MIS IDEAS</button>
        </div>

        <div className="result-content">
          <div className="insight-stack">
            <p className="summary">{insight.summary}</p>
            <article><span>FORTALEZA</span>{insight.strength}</article>
            <article><span>OPORTUNIDAD</span>{insight.opportunity}</article>
            <article><span>PRIORIDAD</span>{insight.priority}</article>
          </div>

          <div className="ideas">
            <h3>3 ideas sugeridas para tu organización</h3>
            {insight.recommendedIdeas.map((idea) => (
              <p key={idea}>{idea}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
