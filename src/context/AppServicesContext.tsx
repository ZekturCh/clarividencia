import { createContext, useContext } from 'react';
import { MockAIProvider } from '../providers/ai/MockAIProvider';
import type { AIProvider } from '../providers/ai/AIProvider';
import { LocalStorageProvider } from '../providers/storage/LocalStorageProvider';
import type { StorageProvider } from '../providers/storage/StorageProvider';

interface AppServices {
  aiProvider: AIProvider;
  storageProvider: StorageProvider;
}

const services: AppServices = {
  aiProvider: new MockAIProvider(),
  storageProvider: new LocalStorageProvider(),
};

const AppServicesContext = createContext<AppServices>(services);

export function AppServicesProvider({ children }: { children: React.ReactNode }) {
  return <AppServicesContext.Provider value={services}>{children}</AppServicesContext.Provider>;
}

export function useAppServices() {
  return useContext(AppServicesContext);
}
