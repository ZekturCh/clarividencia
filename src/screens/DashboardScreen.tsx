import { useEffect, useState } from 'react';
import { EVENT_NAME, EVENT_YEAR, STORAGE_EVENT_NAME } from '../config';
import { ProgressBar } from '../components/ProgressBar';
import { dimensionLabels, radarDimensions } from '../data/scoringRules';
import { useAppServices } from '../context/AppServicesContext';

export function DashboardScreen() {
  const { storageProvider } = useAppServices();
  const [stats, setStats] = useState(() => storageProvider.getAggregateStats());

  useEffect(() => {
    const refresh = () => setStats(storageProvider.getAggregateStats());
    const channel = 'BroadcastChannel' in window ? new BroadcastChannel(STORAGE_EVENT_NAME) : null;

    window.addEventListener('storage', refresh);
    window.addEventListener(STORAGE_EVENT_NAME, refresh);
    channel?.addEventListener('message', refresh);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(STORAGE_EVENT_NAME, refresh);
      channel?.close();
    };
  }, [storageProvider]);

  return (
    <main className="dashboard-page">
      <p className="eyebrow">Culture Pulse AI</p>
      <h1>El pulso de los líderes de personas</h1>
      <h2>{EVENT_NAME} {EVENT_YEAR}</h2>
      <div className="dashboard-number">
        <strong>{stats.totalParticipants}</strong>
        <span>participantes</span>
      </div>
      <section className="dashboard-grid">
        <div>
          <h3>Distribución de principal reto</h3>
          {(stats.challengeDistribution.length ? stats.challengeDistribution : [{ label: 'Sin datos todavía', percentage: 0, count: 0 }]).map((item) => (
            <ProgressBar key={item.label} label={`${item.percentage}% ${item.label}`} value={item.percentage} />
          ))}
        </div>
        <div>
          <h3>¿Qué quieren generar más?</h3>
          {(stats.desiredOutcomeTop.length ? stats.desiredOutcomeTop : [{ label: 'Sin datos todavía', percentage: 0, count: 0 }]).map((item) => (
            <ProgressBar key={item.label} label={`${item.percentage}% ${item.label}`} value={item.percentage} />
          ))}
        </div>
        <div className="wide-panel">
          <h3>Pulso promedio</h3>
          {radarDimensions.map((dimension) => (
            <ProgressBar key={dimension} label={dimensionLabels[dimension]} value={stats.averageScores[dimension]} />
          ))}
        </div>
      </section>
    </main>
  );
}
