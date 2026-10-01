import { questions } from '../../data/questions';
import type { Answers, LeadRecord, SessionRecord } from '../../types';
import { LocalStorageProvider } from './LocalStorageProvider';
import type { RemoteSyncResult, StorageProvider } from './StorageProvider';

const firebaseConfig = {
  databaseURL: 'https://dbdosparax-default-rtdb.firebaseio.com',
};

const remoteItemsPath = 'led-wall/clarividencia/items';

type RemoteKind = 'lead' | 'session';

export class FirebaseStorageProvider extends LocalStorageProvider implements StorageProvider {
  async saveSession(session: SessionRecord) {
    super.saveSession(session);
    return saveRemoteRecord('session', session.id, {
      ...session,
      answerLabels: buildAnswerLabels(session.answers),
    });
  }

  async saveLead(lead: LeadRecord) {
    super.saveLead(lead);
    return saveRemoteRecord('lead', lead.id, lead);
  }

  async getRemoteSessions() {
    return readRemoteCollection<SessionRecord>('session');
  }

  async getRemoteLeads() {
    return readRemoteCollection<LeadRecord>('lead');
  }

  async syncLocalToRemote(): Promise<RemoteSyncResult> {
    const sessions = this.getSessions();
    const leads = this.getLeads();

    const [remoteSessions, remoteLeads] = await Promise.all([
      this.getRemoteSessions(),
      this.getRemoteLeads(),
    ]);

    const remoteSessionIds = new Set(remoteSessions.map((session) => session.id));
    const remoteLeadIds = new Set(remoteLeads.map((lead) => lead.id));

    const pendingSessions = sessions.filter((session) => !remoteSessionIds.has(session.id));
    const pendingLeads = leads.filter((lead) => !remoteLeadIds.has(lead.id));

    let sessionsSynced = 0;
    let sessionsFailed = 0;
    let leadsSynced = 0;
    let leadsFailed = 0;

    for (const session of pendingSessions) {
      const ok = await saveRemoteRecord('session', session.id, {
        ...session,
        answerLabels: buildAnswerLabels(session.answers),
      });
      if (ok) sessionsSynced += 1;
      else sessionsFailed += 1;
    }

    for (const lead of pendingLeads) {
      const ok = await saveRemoteRecord('lead', lead.id, lead);
      if (ok) leadsSynced += 1;
      else leadsFailed += 1;
    }

    return {
      sessionsFound: sessions.length,
      sessionsSynced,
      sessionsFailed,
      sessionsSkipped: sessions.length - pendingSessions.length,
      leadsFound: leads.length,
      leadsSynced,
      leadsFailed,
      leadsSkipped: leads.length - pendingLeads.length,
    };
  }
}

async function saveRemoteRecord(kind: RemoteKind, id: string, payload: object): Promise<boolean> {
  const url = `${firebaseConfig.databaseURL}/${remoteItemsPath}/${encodeURIComponent(id)}.json`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        kind,
        savedAt: new Date().toISOString(),
        source: 'clarividencia-github-pages',
      }),
    });

    if (!response.ok) {
      const detail = await safeResponseText(response);
      throw new Error(`Realtime Database ${response.status}: ${detail || response.statusText}`);
    }

    return true;
  } catch (error) {
    console.warn(`Could not save Clarividencia ${kind} to Firebase Realtime Database`, error);
    return false;
  }
}

async function readRemoteCollection<T extends { id: string; createdAt?: string }>(kind: RemoteKind): Promise<T[]> {
  const url = `${firebaseConfig.databaseURL}/${remoteItemsPath}.json`;

  try {
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      const detail = await safeResponseText(response);
      throw new Error(`Realtime Database ${response.status}: ${detail || response.statusText}`);
    }

    const payload = await response.json() as Record<string, T & { kind?: string }> | null;
    if (!payload || typeof payload !== 'object') return [];

    return Object.entries(payload)
      .filter(([, value]) => value?.kind === kind)
      .map(([id, value]) => {
        const { kind: _kind, ...record } = value;
        return { ...record, id } as T;
      })
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
  } catch (error) {
    console.warn(`Could not read Clarividencia ${kind} records from Firebase Realtime Database`, error);
    return [];
  }
}

async function safeResponseText(response: Response) {
  try {
    return (await response.text()).slice(0, 240);
  } catch {
    return '';
  }
}

function buildAnswerLabels(answers: Answers) {
  return questions.reduce<Record<string, string>>((acc, question) => {
    const answerId = answers[question.id];
    const option = question.options.find((item) => item.id === answerId);
    if (option) acc[question.id] = option.label;
    return acc;
  }, {});
}
