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
        const sine = Math.sin(angle);

        const isTop = index === 0;
        const isRight = index === 1 || index === 2;
        const isLeft = index === 3 || index === 4;
        const labelRadius = isTop ? 108 : 116;

        let x = center + cosine * labelRadius;
        let y = center + sine * labelRadius;

        if (index === 1) x += 8;
        if (index === 2) {
          x += 10;
          y += 4;
        }
        if (index === 3) {
          x -= 10;
          y += 4;
        }
        if (index === 4) x -= 8;

        const textAnchor = isRight ? 'start' : isLeft ? 'end' : 'middle';

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
