import type { AIProvider } from './AIProvider';

export class RemoteAIProvider implements AIProvider {
  async analyze(): ReturnType<AIProvider['analyze']> {
    throw new Error('RemoteAIProvider is reserved for a future backend integration.');
  }
}
