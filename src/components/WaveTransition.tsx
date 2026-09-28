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
      className={active ? 'wave-transition active' : 'wave-transition'}
      style={{ '--question-transition-duration': `${durationMs}ms` } as CSSProperties}
      aria-hidden={!active}
    >
      <div className="wave-surface" />
      <div className="digital-sweep" />
      <div className="processing-scan" />
      <img className="transition-line-symbol transition-line-symbol-one" src={symbol} alt="" />
      <img className="transition-line-symbol transition-line-symbol-two" src={symbol} alt="" />
      <img className="transition-brand-symbol" src={symbol} alt="" />
    </div>
  );
}
