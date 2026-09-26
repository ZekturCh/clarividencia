import type { StorageProvider } from './StorageProvider';

export class FirebaseStorageProvider implements StorageProvider {
  saveSession(): void {
    throw new Error('FirebaseStorageProvider is reserved for a future Firebase integration.');
  }

  saveLead(): void {
    throw new Error('FirebaseStorageProvider is reserved for a future Firebase integration.');
  }

  getSessions(): never {
    throw new Error('FirebaseStorageProvider is reserved for a future Firebase integration.');
  }

  getLeads(): never {
    throw new Error('FirebaseStorageProvider is reserved for a future Firebase integration.');
  }

  getAggregateStats(): never {
    throw new Error('FirebaseStorageProvider is reserved for a future Firebase integration.');
  }

  clearData(): void {
    throw new Error('FirebaseStorageProvider is reserved for a future Firebase integration.');
  }
}
