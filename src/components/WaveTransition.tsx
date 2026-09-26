import type { CSSProperties } from 'react';

export function WaveTransition({
  active,
  message,
}: {
  active: boolean;
  message: string;
}) {
  const wavePixels = Array.from({ length: 132 }, (_, index) => {
    const column = index % 22;
    const row = Math.floor(index / 22);
    const drift = ((index * 17) % 11) - 5;
    const size = 10 + ((index * 7) % 22);

    return {
      id: index,
      style: {
        '--x': `${column * 4.7 + drift}%`,
        '--y': `${row * 17 + ((index * 13) % 9)}%`,
        '--size': `${size}px`,
        '--delay': `${column * 42 + row * 24}ms`,
      } as CSSProperties,
    };
  });

  return (
    <div className={active ? 'wave-transition active' : 'wave-transition'} aria-hidden={!active}>
      <div className="wave-surface" />
      <div className="digital-sweep" />
      <div className="pixel-wave">
        {wavePixels.map((pixel) => (
          <span key={pixel.id} style={pixel.style} />
        ))}
      </div>
      <div className="pixel-field">
        {Array.from({ length: 36 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="ai-loader-grid" />
      <div className="transition-copy">
        <span className="loader-kicker">ClarividencIA / motor local</span>
        <div className="loader-core" aria-hidden="true">
          <span />
          <span />
          <span />
          <i />
        </div>
        <strong>{message}</strong>
        <div className="loader-progress" aria-hidden="true">
          <span />
        </div>
        <div className="loader-telemetry" aria-hidden="true">
          <small>Analizando patrones</small>
          <small>Leyendo opciones</small>
          <small>Preparando siguiente pulso</small>
        </div>
      </div>
    </div>
  );
}
