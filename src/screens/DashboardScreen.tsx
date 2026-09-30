import { useEffect, useMemo, useState } from 'react';
import { EVENT_NAME, EVENT_YEAR, STORAGE_EVENT_NAME } from '../config';
import { ProgressBar } from '../components/ProgressBar';
import { questions } from '../data/questions';
import { dimensions, dimensionLabels, radarDimensions } from '../data/scoringRules';
import { useAppServices } from '../context/AppServicesContext';
import type { AggregateStats, LeadRecord, QuestionId, Scores, SessionRecord } from '../types';

interface DashboardData {
  stats: AggregateStats;
  sessions: SessionRecord[];
  leads: LeadRecord[];
  source: 'firestore' | 'local';
}

const emptyScores = dimensions.reduce((acc, dimension) => ({ ...acc, [dimension]: 0 }), {} as Scores);

export function DashboardScreen() {
  const { storageProvider } = useAppServices();
  const [data, setData] = useState<DashboardData>(() => ({
    stats: storageProvider.getAggregateStats(),
    sessions: storageProvider.getSessions(),
    leads: storageProvider.getLeads(),
    source: 'local',
  }));
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      setStatus('loading');
      const localData = {
        stats: storageProvider.getAggregateStats(),
        sessions: storageProvider.getSessions(),
        leads: storageProvider.getLeads(),
        source: 'local' as const,
      };

      if (!storageProvider.getRemoteSessions || !storageProvider.getRemoteLeads) {
        if (active) {
          setData(localData);
          setStatus('ready');
        }
        return;
      }

      const [remoteSessions, remoteLeads] = await Promise.all([
        storageProvider.getRemoteSessions(),
        storageProvider.getRemoteLeads(),
      ]);

      if (!active) return;

      if (remoteSessions.length || remoteLeads.length) {
        setData({
          stats: buildAggregateStats(remoteSessions),
          sessions: remoteSessions,
          leads: remoteLeads,
          source: 'firestore',
        });
      } else {
        setData(localData);
      }

      setStatus('ready');
    };

    void refresh();

    const channel = 'BroadcastChannel' in window ? new BroadcastChannel(STORAGE_EVENT_NAME) : null;
    const handleRefresh = () => void refresh();

    window.addEventListener('storage', handleRefresh);
    window.addEventListener(STORAGE_EVENT_NAME, handleRefresh);
    channel?.addEventListener('message', handleRefresh);

    return () => {
      active = false;
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener(STORAGE_EVENT_NAME, handleRefresh);
      channel?.close();
    };
  }, [storageProvider]);

  const leadsBySession = useMemo(() => new Map(data.leads.map((lead) => [lead.sessionId, lead])), [data.leads]);
  const conversionRate = data.sessions.length ? Math.round((data.leads.length / data.sessions.length) * 100) : 0;
  const latestLeads = data.leads.slice(0, 14);
  const latestSessions = data.sessions.slice(0, 10);

  return (
    <main className="dashboard-page dashboard-admin-page">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">ClarividencIA Data</p>
          <h1>Registros y pulso en vivo</h1>
          <h2>{EVENT_NAME} {EVENT_YEAR}</h2>
        </div>
        <div className="dashboard-source">
          <span>{status === 'loading' ? 'Sincronizando' : data.source === 'firestore' ? 'Firestore activo' : 'Vista local'}</span>
          <strong>{data.leads.length}</strong>
          <small>registros capturados</small>
        </div>
      </div>

      <section className="metric-card-grid">
        <MetricCard label="Participantes" value={data.stats.totalParticipants} detail="Diagnósticos completados" />
        <MetricCard label="Registros" value={data.leads.length} detail="Personas que dejaron datos" />
        <MetricCard label="Conversión" value={`${conversionRate}%`} detail="Registro sobre diagnóstico" />
        <MetricCard label="Pulso promedio" value={data.stats.averageScore} detail="Score cultural general" />
      </section>

      <section className="dashboard-grid">
        <div>
          <h3>Principal reto</h3>
          {(data.stats.challengeDistribution.length ? data.stats.challengeDistribution : [{ label: 'Sin datos todavía', percentage: 0, count: 0 }]).map((item) => (
            <ProgressBar key={item.label} label={`${item.percentage}% ${item.label}`} value={item.percentage} />
          ))}
        </div>
        <div>
          <h3>Qué quieren generar más</h3>
          {(data.stats.desiredOutcomeTop.length ? data.stats.desiredOutcomeTop : [{ label: 'Sin datos todavía', percentage: 0, count: 0 }]).map((item) => (
            <ProgressBar key={item.label} label={`${item.percentage}% ${item.label}`} value={item.percentage} />
          ))}
        </div>
        <div className="wide-panel">
          <h3>Pulso promedio por dimensión</h3>
          {radarDimensions.map((dimension) => (
            <ProgressBar key={dimension} label={dimensionLabels[dimension]} value={data.stats.averageScores[dimension]} />
          ))}
        </div>
      </section>

      <section className="dashboard-records">
        <div className="records-panel">
          <div className="records-heading">
            <h3>Registrados</h3>
            <span>{latestLeads.length} visibles</span>
          </div>
          <div className="records-table leads-table">
            {latestLeads.length ? (
              latestLeads.map((lead) => (
                <article key={lead.id} className="record-row">
                  <div>
                    <strong>{lead.fullName}</strong>
                    <span>{lead.company || 'Sin empresa'} · {lead.role || 'Sin cargo'}</span>
                  </div>
                  <div>
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    <span>{lead.whatsapp || 'Sin WhatsApp'}</span>
                  </div>
                  <div>
                    <small>{lead.interests?.length ? lead.interests.join(', ') : 'Sin intereses marcados'}</small>
                    <time>{formatDate(lead.createdAt)}</time>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-state">Todavía no hay registros guardados.</p>
            )}
          </div>
        </div>

        <div className="records-panel">
          <div className="records-heading">
            <h3>Últimos diagnósticos</h3>
            <span>{latestSessions.length} visibles</span>
          </div>
          <div className="records-table">
            {latestSessions.length ? (
              latestSessions.map((session) => {
                const lead = leadsBySession.get(session.id);
                return (
                  <article key={session.id} className="record-row compact">
                    <div>
                      <strong>{lead?.fullName ?? 'Participante sin registro'}</strong>
                      <span>{formatAnswer(session, 'mainChallenge')} · {formatAnswer(session, 'desiredOutcome')}</span>
                    </div>
                    <div>
                      <strong>{session.totalScore}</strong>
                      <span>{formatDate(session.createdAt)}</span>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="empty-state">Todavía no hay diagnósticos guardados.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: number | string; detail: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function buildAggregateStats(sessions: SessionRecord[]): AggregateStats {
  const totalParticipants = sessions.length;

  if (!totalParticipants) {
    return {
      totalParticipants,
      averageScore: 0,
      averageScores: emptyScores,
      challengeDistribution: [],
      desiredOutcomeTop: [],
    };
  }

  const averageScores = dimensions.reduce((acc, dimension) => {
    const total = sessions.reduce((sum, session) => sum + (session.scores?.[dimension] ?? 0), 0);
    return { ...acc, [dimension]: Math.round(total / totalParticipants) };
  }, {} as Scores);

  return {
    totalParticipants,
    averageScore: Math.round(sessions.reduce((sum, session) => sum + (session.totalScore ?? 0), 0) / totalParticipants),
    averageScores,
    challengeDistribution: buildDistribution(sessions, 'mainChallenge'),
    desiredOutcomeTop: buildDistribution(sessions, 'desiredOutcome').slice(0, 3),
  };
}

function buildDistribution(sessions: SessionRecord[], questionId: 'mainChallenge' | 'desiredOutcome') {
  const question = questions.find((item) => item.id === questionId);
  const counts = new Map<string, { label: string; count: number }>();

  sessions.forEach((session) => {
    const answerId = session.answers?.[questionId];
    const option = question?.options.find((item) => item.id === answerId);
    const label = option?.category ?? option?.label ?? 'Otros';
    const current = counts.get(label) ?? { label, count: 0 };
    counts.set(label, { label, count: current.count + 1 });
  });

  return [...counts.values()]
    .map((item) => ({ ...item, percentage: Math.round((item.count / sessions.length) * 100) }))
    .sort((a, b) => b.count - a.count);
}

function formatAnswer(session: SessionRecord, questionId: QuestionId) {
  const question = questions.find((item) => item.id === questionId);
  const option = question?.options.find((item) => item.id === session.answers?.[questionId]);
  return option?.label ?? 'Sin respuesta';
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
