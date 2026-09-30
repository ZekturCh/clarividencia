import { createContext, useContext } from 'react';
import { ENABLE_REMOTE_STORAGE } from '../config';
import { MockAIProvider } from '../providers/ai/MockAIProvider';
import type { AIProvider } from '../providers/ai/AIProvider';
import { FirebaseStorageProvider } from '../providers/storage/FirebaseStorageProvider';
import { LocalStorageProvider } from '../providers/storage/LocalStorageProvider';
import type { StorageProvider } from '../providers/storage/StorageProvider';

interface AppServices {
  aiProvider: AIProvider;
  storageProvider: StorageProvider;
}

const services: AppServices = {
  aiProvider: new MockAIProvider(),
  storageProvider: ENABLE_REMOTE_STORAGE ? new FirebaseStorageProvider() : new LocalStorageProvider(),
};

const AppServicesContext = createContext<AppServices>(services);

export function AppServicesProvider({ children }: { children: React.ReactNode }) {
  return <AppServicesContext.Provider value={services}>{children}</AppServicesContext.Provider>;
}

export function useAppServices() {
  return useContext(AppServicesContext);
}
