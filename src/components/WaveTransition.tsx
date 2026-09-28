import symbol from '../assets/brand/clarividencia-symbol.png';

export function WaveTransition({
  active,
  message: _message,
}: {
  active: boolean;
  message: string;
}) {
  return (
    <div className={active ? 'wave-transition active' : 'wave-transition'} aria-hidden={!active}>
      <div className="wave-surface" />
      <div className="digital-sweep" />
      <img className="transition-line-symbol transition-line-symbol-one" src={symbol} alt="" />
      <img className="transition-line-symbol transition-line-symbol-two" src={symbol} alt="" />
      <img className="transition-brand-symbol" src={symbol} alt="" />
    </div>
  );
}
