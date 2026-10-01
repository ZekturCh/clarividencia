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
  source: 'firebase' | 'local' | 'hybrid';
}

const emptyScores = dimensions.reduce((acc, dimension) => ({ ...acc, [dimension]: 0 }), {} as Scores);

const answerFields: Array<{ id: QuestionId; label: string }> = [
  { id: 'mainChallenge', label: 'Reto principal' },
  { id: 'teamState', label: 'Estado del equipo' },
  { id: 'desiredOutcome', label: 'Objetivo' },
  { id: 'orgSize', label: 'Tamaño' },
  { id: 'experienceFocus', label: 'Experiencia a mejorar' },
];

export function DashboardScreen() {
  const { storageProvider } = useAppServices();
  const [data, setData] = useState<DashboardData>(() => ({
    stats: storageProvider.getAggregateStats(),
    sessions: storageProvider.getSessions(),
    leads: storageProvider.getLeads(),
    source: 'local',
  }));
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

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
        const mergedSessions = mergeById(remoteSessions, localData.sessions);
        const mergedLeads = mergeById(remoteLeads, localData.leads);
        const hasLocalOnlyData =
          mergedSessions.length > remoteSessions.length || mergedLeads.length > remoteLeads.length;

        setData({
          stats: buildAggregateStats(mergedSessions),
          sessions: mergedSessions,
          leads: mergedLeads,
          source: hasLocalOnlyData ? 'hybrid' : 'firebase',
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

  const syncLocalData = async () => {
    if (!storageProvider.syncLocalToRemote || syncing) return;

    setSyncing(true);
    setSyncMessage('Comparando datos locales con Firebase...');

    try {
      const result = await storageProvider.syncLocalToRemote();
      const failures = result.sessionsFailed + result.leadsFailed;

      if (failures) {
        setSyncMessage(
          `Firebase: ${result.leadsSynced} leads nuevos, ${result.leadsSkipped} ya estaban; ${result.sessionsSynced} diagnósticos nuevos, ${result.sessionsSkipped} ya estaban. ${failures} fallaron.`,
        );
      } else if (result.leadsSynced === 0 && result.sessionsSynced === 0) {
        setSyncMessage(
          `Sin pendientes: ${result.leadsSkipped} leads y ${result.sessionsSkipped} diagnósticos ya estaban en Firebase.`,
        );
      } else {
        setSyncMessage(
          `Firebase actualizado: ${result.leadsSynced} leads nuevos y ${result.sessionsSynced} diagnósticos nuevos. ${result.leadsSkipped + result.sessionsSkipped} registros ya estaban en la nube.`,
        );
      }

      window.dispatchEvent(new Event(STORAGE_EVENT_NAME));
    } catch (error) {
      console.warn('Could not synchronize local Clarividencia data', error);
      setSyncMessage('No se pudo completar la sincronización. Los datos locales siguen intactos.');
    } finally {
      setSyncing(false);
    }
  };

  const sessionsById = useMemo(() => new Map(data.sessions.map((session) => [session.id, session])), [data.sessions]);
  const leadsBySession = useMemo(() => new Map(data.leads.map((lead) => [lead.sessionId, lead])), [data.leads]);
  const unregisteredSessions = useMemo(
    () => data.sessions.filter((session) => !leadsBySession.has(session.id)),
    [data.sessions, leadsBySession],
  );
  const conversionRate = data.sessions.length ? Math.round((data.leads.length / data.sessions.length) * 100) : 0;

  return (
    <main className="dashboard-page dashboard-admin-page">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">ClarividencIA Data</p>
          <h1>Registros y pulso en vivo</h1>
          <h2>{EVENT_NAME} {EVENT_YEAR}</h2>
        </div>
        <div className="dashboard-source">
          <span>
            {status === 'loading'
              ? 'Sincronizando'
              : data.source === 'firebase'
                ? 'Firebase activo'
                : data.source === 'hybrid'
                  ? 'Firebase + datos locales'
                  : 'Vista local'}
          </span>
          <strong>{data.leads.length}</strong>
          <small>leads capturados</small>
        </div>
      </div>

      {storageProvider.syncLocalToRemote && (
        <section className="dashboard-sync-panel">
          <div>
            <strong>Respaldo en la nube</strong>
            <span>Sube únicamente los registros locales que todavía no existen en Firebase Realtime Database.</span>
          </div>
          <button className="dashboard-sync-button" type="button" onClick={() => void syncLocalData()} disabled={syncing}>
            {syncing ? 'SINCRONIZANDO...' : 'SUBIR PENDIENTES A FIREBASE'}
          </button>
          {syncMessage && <small className="dashboard-sync-message">{syncMessage}</small>}
        </section>
      )}

      <section className="dashboard-leads-primary">
        <div className="records-heading">
          <div>
            <p className="dashboard-section-kicker">Base comercial</p>
            <h3>Leads registrados</h3>
          </div>
          <span>{data.leads.length} registros</span>
        </div>

        <div className="dashboard-lead-list">
          {data.leads.length ? (
            data.leads.map((lead) => {
              const session = sessionsById.get(lead.sessionId);
              return (
                <article key={lead.id} className="dashboard-lead-card">
                  <header className="dashboard-lead-head">
                    <div className="dashboard-lead-identity">
                      <strong>{lead.fullName || 'Sin nombre'}</strong>
                      <span className="dashboard-role">{lead.role || 'Sin cargo'}</span>
                      <span className="dashboard-company">{lead.company || 'Sin empresa'}</span>
                    </div>
                    <time>{formatDate(lead.createdAt)}</time>
                  </header>

                  <div className="dashboard-contact-row">
                    <a href={`mailto:${lead.email}`}>{lead.email || 'Sin correo'}</a>
                    <a href={buildWhatsAppUrl(lead)} target="_blank" rel="noreferrer">
                      {lead.whatsapp || 'Sin teléfono'}
                    </a>
                  </div>

                  <div className="dashboard-answer-grid">
                    {answerFields.map((field) => (
                      <div key={field.id} className="dashboard-answer-item">
                        <span>{field.label}</span>
                        <strong>{session ? formatAnswer(session, field.id) : 'Sin diagnóstico vinculado'}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="dashboard-interest-row">
                    <span>Marcó al enviar sus datos</span>
                    <strong>{lead.interests?.length ? lead.interests.join(' · ') : 'Sin intereses marcados'}</strong>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="empty-state">Todavía no hay leads registrados.</p>
          )}
        </div>
      </section>

      <section className="dashboard-unregistered">
        <div className="records-heading">
          <div>
            <p className="dashboard-section-kicker">Sin datos de contacto</p>
            <h3>Usaron la plataforma pero no dejaron datos</h3>
          </div>
          <span>{unregisteredSessions.length} participantes</span>
        </div>

        <div className="dashboard-unregistered-list">
          {unregisteredSessions.length ? (
            unregisteredSessions.map((session) => (
              <article key={session.id} className="dashboard-unregistered-card">
                <div className="dashboard-unregistered-main">
                  <strong>Participante sin registro</strong>
                  <span>{formatDate(session.createdAt)} · Score {session.totalScore}</span>
                </div>
                <div className="dashboard-unregistered-answers">
                  {answerFields.map((field) => (
                    <span key={field.id}>
                      <b>{field.label}:</b> {formatAnswer(session, field.id)}
                    </span>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <p className="empty-state">Todos los diagnósticos actuales tienen datos de contacto asociados.</p>
          )}
        </div>
      </section>

      <section className="metric-card-grid dashboard-secondary-metrics">
        <MetricCard label="Participantes" value={data.stats.totalParticipants} detail="Diagnósticos completados" />
        <MetricCard label="Registros" value={data.leads.length} detail="Personas que dejaron datos" />
        <MetricCard label="Conversión" value={`${conversionRate}%`} detail="Registro sobre diagnóstico" />
        <MetricCard label="Pulso promedio" value={data.stats.averageScore} detail="Score cultural general" />
      </section>

      <section className="dashboard-grid dashboard-secondary-metrics">
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
    </main>
  );
}

function mergeById<T extends { id: string }>(remote: T[], local: T[]) {
  const merged = new Map<string, T>();
  local.forEach((item) => merged.set(item.id, item));
  remote.forEach((item) => merged.set(item.id, item));
  return [...merged.values()].sort((a, b) => {
    const aDate = 'createdAt' in a ? new Date((a as { createdAt?: string }).createdAt ?? 0).getTime() : 0;
    const bDate = 'createdAt' in b ? new Date((b as { createdAt?: string }).createdAt ?? 0).getTime() : 0;
    return bDate - aDate;
  });
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
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function buildWhatsAppUrl(lead: LeadRecord) {
  const phone = lead.whatsapp?.replace(/\D/g, '') ?? '';
  const message = encodeURIComponent(
    `Hola ${lead.fullName || ''}, aquí está tu expediente ClarividencIA de ${lead.company || 'tu organización'}.`,
  );

  if (!phone) return `https://wa.me/?text=${message}`;
  return `https://wa.me/${phone}?text=${message}`;
}
