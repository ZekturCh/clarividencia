export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomUUID()}`;
}
