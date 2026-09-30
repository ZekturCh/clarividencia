import { useEffect, useState } from 'react';
import { ProgressBar } from '../components/ProgressBar';
import { dimensionLabels, radarDimensions } from '../data/scoringRules';
import { getSelectedOptionLabel } from '../services/scoringEngine';
import type { Answers, Scores } from '../types';

function buildAnalysisMessages(answers: Answers) {
  const desiredOutcome = getSelectedOptionLabel(answers, 'desiredOutcome').toLowerCase();
  const orgSize = getSelectedOptionLabel(answers, 'orgSize');

  return [
    'ClarividencIA está actuando para ti...',
    'Leyendo opciones seleccionadas...',
    'Calculando según magnitud de la organización...',
    `Ajustando lectura para equipos de ${orgSize} personas...`,
    `Optimizando recomendaciones orientadas a ${desiredOutcome}...`,
    `Cruzando señales culturales con foco en ${desiredOutcome}...`,
    'Comparando señales de equipo...',
    'Priorizando oportunidades accionables...',
    'Generando ideas para tu organización...',
  ];
}

export function AnalysisScreen({ answers, scores }: { answers: Answers; scores: Scores }) {
  const messages = buildAnalysisMessages(answers);
  const [messageIndex, setMessageIndex] = useState(0);
  const [messageRunId, setMessageRunId] = useState(0);

  useEffect(() => {
    let timer: number;

    const scheduleNextMessage = () => {
      const delay = 1500 + Math.random() * 1400;
      timer = window.setTimeout(() => {
        setMessageRunId((current) => current + 1);
        setMessageIndex((current) => {
          if (messages.length < 2) return 0;
          const next = Math.floor(Math.random() * messages.length);
          return next === current ? (next + 1) % messages.length : next;
        });
        scheduleNextMessage();
      }, delay);
    };

    scheduleNextMessage();
    return () => window.clearTimeout(timer);
  }, [messages.length]);

  return (
    <section className="screen analysis-screen">
      <p className="eyebrow">ClarividencIA</p>
      <h2>Estamos leyendo el pulso de tu organización</h2>
      <div className="ai-thinking-stage">
        <div className="ai-thinking-core" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p key={messageRunId} className="status-message">{messages[messageIndex]}</p>
      </div>
      <div className="analysis-panel">
        {radarDimensions.map((dimension) => (
          <ProgressBar key={dimension} label={dimensionLabels[dimension].toUpperCase()} value={scores[dimension]} />
        ))}
      </div>
    </section>
  );
}
