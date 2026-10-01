import { useEffect, useState } from 'react';
import symbol from '../assets/brand/clarividencia-symbol.png';

const analysisMessages = [
  'Leyendo respuestas...',
  'Interpretando señales culturales...',
  'Conectando hallazgos...',
  'Generando propuesta creativa...',
  'Preparando recomendaciones...',
];

export function AnalysisScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % analysisMessages.length);
    }, 1050);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="analysis-thinking-screen">
      <div className="analysis-thinking-inner">
        <img className="analysis-thinking-symbol" src={symbol} alt="" aria-hidden="true" />
        <p className="analysis-thinking-kicker">ClarividencIA</p>
        <h2 key={messageIndex} className="analysis-thinking-message">{analysisMessages[messageIndex]}</h2>
        <div className="analysis-thinking-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
