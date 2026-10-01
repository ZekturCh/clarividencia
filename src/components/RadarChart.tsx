import { dimensionLabels, radarDimensions } from '../data/scoringRules';
import type { Scores } from '../types';

export function RadarChart({ scores }: { scores: Scores }) {
  const center = 120;
  const radius = 92;
  const points = radarDimensions.map((dimension, index) => {
    const angle = (Math.PI * 2 * index) / radarDimensions.length - Math.PI / 2;
    const distance = (scores[dimension] / 100) * radius;
    return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`;
  });

  const web = [0.35, 0.7, 1].map((scale) =>
    radarDimensions
      .map((_, index) => {
        const angle = (Math.PI * 2 * index) / radarDimensions.length - Math.PI / 2;
        return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
      })
      .join(' '),
  );

  return (
    <svg className="radar" viewBox="0 0 240 240" role="img" aria-label="Radar de pulso cultural">
      {web.map((shape) => (
        <polygon key={shape} points={shape} className="radar-grid" />
      ))}
      {radarDimensions.map((dimension, index) => {
        const angle = (Math.PI * 2 * index) / radarDimensions.length - Math.PI / 2;
        const cosine = Math.cos(angle);
        const x = center + cosine * 108;
        const y = center + Math.sin(angle) * 108;
        const textAnchor = cosine > 0.35 ? 'end' : cosine < -0.35 ? 'start' : 'middle';

        return (
          <text key={dimension} x={x} y={y} textAnchor={textAnchor} dominantBaseline="middle">
            {dimensionLabels[dimension]}
          </text>
        );
      })}
      <polygon points={points.join(' ')} className="radar-shape" />
    </svg>
  );
}
