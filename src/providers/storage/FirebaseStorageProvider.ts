import { questions } from '../../data/questions';
import type { Answers, LeadRecord, SessionRecord } from '../../types';
import { LocalStorageProvider } from './LocalStorageProvider';
import type { RemoteSyncResult, StorageProvider } from './StorageProvider';

const firebaseConfig = {
  apiKey: 'AIzaSyBiqqTAaogq4Pk1MaOUvr9YgXq2brqkzqU',
  authDomain: 'dbdosparax.firebaseapp.com',
  databaseURL: 'https://dbdosparax-default-rtdb.firebaseio.com',
  projectId: 'dbdosparax',
  storageBucket: 'dbdosparax.firebasestorage.app',
  messagingSenderId: '786506932905',
  appId: '1:786506932905:web:7035619466fd130252ffb8',
  measurementId: 'G-CZEML31FL8',
};

export class FirebaseStorageProvider extends LocalStorageProvider implements StorageProvider {
  async saveSession(session: SessionRecord) {
    super.saveSession(session);
    return saveRemoteRecord('culturePulseSessions', session.id, {
      ...session,
      answerLabels: buildAnswerLabels(session.answers),
    });
  }

  async saveLead(lead: LeadRecord) {
    super.saveLead(lead);
    return saveRemoteRecord('culturePulseLeads', lead.id, lead);
  }

  async getRemoteSessions() {
    return readRemoteCollection<SessionRecord>('culturePulseSessions');
  }

  async getRemoteLeads() {
    return readRemoteCollection<LeadRecord>('culturePulseLeads');
  }

  async syncLocalToRemote(): Promise<RemoteSyncResult> {
    const sessions = this.getSessions();
    const leads = this.getLeads();

    let sessionsSynced = 0;
    let sessionsFailed = 0;
    let leadsSynced = 0;
    let leadsFailed = 0;

    for (const session of sessions) {
      const ok = await saveRemoteRecord('culturePulseSessions', session.id, {
        ...session,
        answerLabels: buildAnswerLabels(session.answers),
      });
      if (ok) sessionsSynced += 1;
      else sessionsFailed += 1;
    }

    for (const lead of leads) {
      const ok = await saveRemoteRecord('culturePulseLeads', lead.id, lead);
      if (ok) leadsSynced += 1;
      else leadsFailed += 1;
    }

    return {
      sessionsFound: sessions.length,
      sessionsSynced,
      sessionsFailed,
      leadsFound: leads.length,
      leadsSynced,
      leadsFailed,
    };
  }
}

async function getFirestoreDb() {
  const [{ getApp, getApps, initializeApp }, { getFirestore }] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
  ]);
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}

async function saveRemoteRecord(collectionName: string, id: string, payload: object): Promise<boolean> {
  try {
    const [{ doc, serverTimestamp, setDoc }, db] = await Promise.all([import('firebase/firestore'), getFirestoreDb()]);

    await setDoc(doc(db, collectionName, id), {
      ...payload,
      savedAt: serverTimestamp(),
      source: 'github-pages-demo',
    });
    return true;
  } catch (error) {
    console.warn(`Could not save ${collectionName} record to Firestore`, error);
    return false;
  }
}

async function readRemoteCollection<T extends { createdAt?: string }>(collectionName: string): Promise<T[]> {
  try {
    const [{ collection, getDocs, orderBy, query }, db] = await Promise.all([import('firebase/firestore'), getFirestoreDb()]);
    const snapshot = await getDocs(query(collection(db, collectionName), orderBy('createdAt', 'desc')));

    return snapshot.docs.map((item) => normalizeFirestoreRecord({ id: item.id, ...item.data() }) as T);
  } catch (error) {
    console.warn(`Could not read ${collectionName} records from Firestore`, error);
    return [];
  }
}

function normalizeFirestoreRecord(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => {
      if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
        return [key, value.toDate().toISOString()];
      }
      return [key, value];
    }),
  );
}

function buildAnswerLabels(answers: Answers) {
  return questions.reduce<Record<string, string>>((acc, question) => {
    const answerId = answers[question.id];
    const option = question.options.find((item) => item.id === answerId);
    if (option) acc[question.id] = option.label;
    return acc;
  }, {});
}
