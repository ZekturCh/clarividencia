import type { StorageProvider } from './StorageProvider';

export class ApiStorageProvider implements StorageProvider {
  saveSession(): void {
    throw new Error('ApiStorageProvider is reserved for a future backend integration.');
  }

  saveLead(): void {
    throw new Error('ApiStorageProvider is reserved for a future backend integration.');
  }

  getSessions(): never {
    throw new Error('ApiStorageProvider is reserved for a future backend integration.');
  }

  getLeads(): never {
    throw new Error('ApiStorageProvider is reserved for a future backend integration.');
  }

  getAggregateStats(): never {
    throw new Error('ApiStorageProvider is reserved for a future backend integration.');
  }

  clearData(): void {
    throw new Error('ApiStorageProvider is reserved for a future backend integration.');
  }
}
