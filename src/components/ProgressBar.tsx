export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="metric-row">
      <div className="metric-top">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
