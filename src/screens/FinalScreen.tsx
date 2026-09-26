import type { AggregateStats } from '../types';

export function FinalScreen({ stats, onRestart }: { stats: AggregateStats; onRestart: () => void }) {
  return (
    <section className="screen final-screen">
      <p className="eyebrow">¡Gracias por participar!</p>
      <h2>Tu resultado fue registrado con éxito.</h2>
      <p>Ahora ya formas parte del Pulso GDP 2026.</p>
      <div className="collective-card">
        <span>Pulso colectivo</span>
        <strong>{stats.averageScore || 0}</strong>
        <small>{stats.totalParticipants} participaciones locales</small>
      </div>
      <button className="primary-button" onClick={onRestart}>NUEVA PARTICIPACIÓN</button>
    </section>
  );
}
