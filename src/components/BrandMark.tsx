import logoWide from '../assets/brand/clarividencia-logo-wide.png';

export function BrandMark() {
  return (
    <div className="brand-mark" aria-label="Clarividencia Agencia Creativa">
      <img src={logoWide} alt="" />
      <span className="sr-only">Clarividencia Agencia Creativa</span>
    </div>
  );
}
