import type { CSSProperties } from 'react';
import symbol from '../assets/brand/clarividencia-symbol.png';

export function WaveTransition({
  active,
  durationMs,
  message: _message,
}: {
  active: boolean;
  durationMs: number;
  message: string;
}) {
  return (
    <div
      className={active ? 'wave-transition active simple-question-transition' : 'wave-transition simple-question-transition'}
      style={{ '--question-transition-duration': `${durationMs}ms` } as CSSProperties}
      aria-hidden={!active}
    >
      <img className="transition-pulse-symbol" src={symbol} alt="" />
    </div>
  );
}
