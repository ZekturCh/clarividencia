import symbol from '../assets/brand/clarividencia-symbol.png';

export function AmbientLines() {
  return (
    <div className="ambient-lines" aria-hidden="true">
      <span />
      <span />
      <span />
      <img className="ambient-symbol ambient-symbol-one" src={symbol} alt="" />
      <img className="ambient-symbol ambient-symbol-two" src={symbol} alt="" />
    </div>
  );
}
