import type { AggregateStats, LeadRecord, SessionRecord } from '../../types';

export interface StorageProvider {
  saveSession(session: SessionRecord): void;
  saveLead(lead: LeadRecord): void;
  getSessions(): SessionRecord[];
  getLeads(): LeadRecord[];
  getRemoteSessions?(): Promise<SessionRecord[]>;
  getRemoteLeads?(): Promise<LeadRecord[]>;
  getAggregateStats(): AggregateStats;
  clearData(): void;
}
