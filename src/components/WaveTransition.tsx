import type { CSSProperties } from 'react';
import symbol from '../assets/brand/clarividencia-symbol.png';

export function WaveTransition({
  active,
  message: _message,
}: {
  active: boolean;
  message: string;
}) {
  const lineFragments = Array.from({ length: 14 }, (_, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const width = 34 + ((index * 11) % 26);
    const height = 12 + ((index * 7) % 16);

    return {
      id: index,
      style: {
        '--x': `${column * 28 - 10 + ((index * 9) % 12)}%`,
        '--y': `${row * 24 + ((index * 13) % 18)}%`,
        '--w': `${width}vw`,
        '--h': `${height}vw`,
        '--rot': `${-22 + ((index * 17) % 44)}deg`,
        '--delay': `${index * 52}ms`,
      } as CSSProperties,
    };
  });

  return (
    <div className={active ? 'wave-transition active' : 'wave-transition'} aria-hidden={!active}>
      <div className="wave-surface" />
      <div className="digital-sweep" />
      <div className="brand-line-wave">
        {lineFragments.map((fragment) => (
          <span key={fragment.id} style={fragment.style} />
        ))}
      </div>
      <img className="transition-line-symbol transition-line-symbol-one" src={symbol} alt="" />
      <img className="transition-line-symbol transition-line-symbol-two" src={symbol} alt="" />
      <img className="transition-brand-symbol" src={symbol} alt="" />
    </div>
  );
}
