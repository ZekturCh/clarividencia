import { BrandMark } from '../components/BrandMark';

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="screen start-screen">
      <BrandMark />
      <div className="hero-copy">
        <p className="eyebrow">Culture Pulse AI</p>
        <h1>¿Qué necesita hoy la cultura de tu empresa?</h1>
        <p>Descúbrelo con IA en 60 segundos.</p>
      </div>
      <button className="primary-button" onClick={onStart}>
        COMENZAR
      </button>
    </section>
  );
}
