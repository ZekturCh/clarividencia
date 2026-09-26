import { useEffect, useState } from 'react';
import { ProgressBar } from '../components/ProgressBar';
import { dimensionLabels, radarDimensions } from '../data/scoringRules';
import type { Scores } from '../types';

const messages = ['Identificando patrones...', 'Comparando prioridades...', 'Generando ideas para tu organización...'];

export function AnalysisScreen({ scores }: { scores: Scores }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((current) => Math.min(current + 1, messages.length - 1));
    }, 950);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="screen analysis-screen">
      <p className="eyebrow">Análisis con IA</p>
      <h2>Estamos leyendo el pulso de tu organización</h2>
      <div className="analysis-panel">
        {radarDimensions.map((dimension) => (
          <ProgressBar key={dimension} label={dimensionLabels[dimension].toUpperCase()} value={scores[dimension]} />
        ))}
      </div>
      <p className="status-message">{messages[messageIndex]}</p>
    </section>
  );
}
