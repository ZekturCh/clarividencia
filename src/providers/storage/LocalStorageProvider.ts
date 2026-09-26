import { questions } from '../../data/questions';
import { dimensions } from '../../data/scoringRules';
import { STORAGE_EVENT_NAME } from '../../config';
import type { AggregateStats, LeadRecord, Scores, SessionRecord } from '../../types';
import type { StorageProvider } from './StorageProvider';

const SESSIONS_KEY = 'culture-pulse-sessions';
const LEADS_KEY = 'culture-pulse-leads';

function readCollection<T>(key: string): T[] {
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function emitStorageUpdate() {
  window.dispatchEvent(new Event(STORAGE_EVENT_NAME));
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(STORAGE_EVENT_NAME) : null;
  channel?.postMessage({ type: STORAGE_EVENT_NAME });
  channel?.close();
}

export class LocalStorageProvider implements StorageProvider {
  saveSession(session: SessionRecord) {
    const sessions = this.getSessions();
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify([...sessions, session]));
    emitStorageUpdate();
  }

  saveLead(lead: LeadRecord) {
    const leads = this.getLeads();
    window.localStorage.setItem(LEADS_KEY, JSON.stringify([...leads, lead]));
    emitStorageUpdate();
  }

  getSessions() {
    return readCollection<SessionRecord>(SESSIONS_KEY);
  }

  getLeads() {
    return readCollection<LeadRecord>(LEADS_KEY);
  }

  getAggregateStats(): AggregateStats {
    const sessions = this.getSessions();
    const totalParticipants = sessions.length;
    const emptyScores = dimensions.reduce((acc, dimension) => ({ ...acc, [dimension]: 0 }), {} as Scores);

    if (totalParticipants === 0) {
      return {
        totalParticipants,
        averageScore: 0,
        averageScores: emptyScores,
        challengeDistribution: [],
        desiredOutcomeTop: [],
      };
    }

    const averageScores = dimensions.reduce((acc, dimension) => {
      const total = sessions.reduce((sum, session) => sum + session.scores[dimension], 0);
      return { ...acc, [dimension]: Math.round(total / totalParticipants) };
    }, {} as Scores);

    return {
      totalParticipants,
      averageScore: Math.round(sessions.reduce((sum, session) => sum + session.totalScore, 0) / totalParticipants),
      averageScores,
      challengeDistribution: buildDistribution(sessions, 'mainChallenge'),
      desiredOutcomeTop: buildDistribution(sessions, 'desiredOutcome').slice(0, 3),
    };
  }

  clearData() {
    window.localStorage.removeItem(SESSIONS_KEY);
    window.localStorage.removeItem(LEADS_KEY);
    emitStorageUpdate();
  }
}

function buildDistribution(sessions: SessionRecord[], questionId: 'mainChallenge' | 'desiredOutcome') {
  const question = questions.find((item) => item.id === questionId);
  const counts = new Map<string, { label: string; count: number }>();

  sessions.forEach((session) => {
    const answerId = session.answers[questionId];
    const option = question?.options.find((item) => item.id === answerId);
    const label = option?.category ?? option?.label ?? 'Otros';
    const current = counts.get(label) ?? { label, count: 0 };
    counts.set(label, { label, count: current.count + 1 });
  });

  return [...counts.values()]
    .map((item) => ({ ...item, percentage: Math.round((item.count / sessions.length) * 100) }))
    .sort((a, b) => b.count - a.count);
}
