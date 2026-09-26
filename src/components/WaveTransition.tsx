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
        {Array.from({ length: 24 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="transition-copy">
        <span>ClarividencIA</span>
        <strong>{message}</strong>
      </div>
    </div>
  );
}
