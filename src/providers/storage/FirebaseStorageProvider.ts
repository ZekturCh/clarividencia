import { questions } from '../../data/questions';
import type { Answers, LeadRecord, SessionRecord } from '../../types';
import { LocalStorageProvider } from './LocalStorageProvider';
import type { StorageProvider } from './StorageProvider';

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
  saveSession(session: SessionRecord) {
    super.saveSession(session);
    void saveRemoteRecord('culturePulseSessions', session.id, {
      ...session,
      answerLabels: buildAnswerLabels(session.answers),
    });
  }

  saveLead(lead: LeadRecord) {
    super.saveLead(lead);
    void saveRemoteRecord('culturePulseLeads', lead.id, lead);
  }
}

async function saveRemoteRecord(collectionName: string, id: string, payload: object) {
  try {
    const [{ getApp, getApps, initializeApp }, { doc, getFirestore, serverTimestamp, setDoc }] = await Promise.all([
      import('firebase/app'),
      import('firebase/firestore'),
    ]);
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);

    await setDoc(doc(db, collectionName, id), {
      ...payload,
      savedAt: serverTimestamp(),
      source: 'github-pages-demo',
    });
  } catch (error) {
    console.warn(`Could not save ${collectionName} record to Firestore`, error);
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
