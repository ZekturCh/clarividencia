import type { CSSProperties } from 'react';
import symbol from '../assets/brand/clarividencia-symbol.png';

export function WaveTransition({
  active,
  message: _message,
}: {
  active: boolean;
  message: string;
}) {
  const wavePixels = Array.from({ length: 216 }, (_, index) => {
    const column = index % 24;
    const row = Math.floor(index / 24);
    const drift = ((index * 17) % 9) - 4;
    const size = 12 + ((index * 7) % 26);

    return {
      id: index,
      style: {
        '--x': `${column * 4.35 + drift}%`,
        '--y': `${row * 12.2 + ((index * 13) % 7)}%`,
        '--size': `${size}px`,
        '--delay': `${column * 18 + row * 16}ms`,
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
      <img className="transition-brand-symbol" src={symbol} alt="" />
    </div>
  );
}
