import type { AggregateStats, LeadRecord, SessionRecord } from '../../types';

export interface RemoteSyncResult {
  sessionsFound: number;
  sessionsSynced: number;
  sessionsFailed: number;
  leadsFound: number;
  leadsSynced: number;
  leadsFailed: number;
}

export interface StorageProvider {
  saveSession(session: SessionRecord): void | Promise<boolean>;
  saveLead(lead: LeadRecord): void | Promise<boolean>;
  getSessions(): SessionRecord[];
  getLeads(): LeadRecord[];
  getRemoteSessions?(): Promise<SessionRecord[]>;
  getRemoteLeads?(): Promise<LeadRecord[]>;
  syncLocalToRemote?(): Promise<RemoteSyncResult>;
  getAggregateStats(): AggregateStats;
  clearData(): void;
}
