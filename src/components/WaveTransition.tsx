export function WaveTransition({
  active,
  message,
}: {
  active: boolean;
  message: string;
}) {
  return (
    <div className={active ? 'wave-transition active' : 'wave-transition'} aria-hidden={!active}>
      <div className="wave-surface" />
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
