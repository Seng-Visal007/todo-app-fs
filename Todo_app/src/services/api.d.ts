export type ApiOptions = RequestInit

export function apiRequest<T = unknown>(path: string, options?: ApiOptions): Promise<T>
export function signIn(credentials: { email: string; password: string }): Promise<{ access_token: string }>
export function signUp(credentials: { email: string; password: string }): Promise<{ id: number; email: string }>

export const api: {
  get: <T = unknown>(path: string, options?: ApiOptions) => Promise<T>
  post: <T = unknown>(path: string, body?: unknown, options?: ApiOptions) => Promise<T>
  patch: <T = unknown>(path: string, body?: unknown, options?: ApiOptions) => Promise<T>
  put: <T = unknown>(path: string, body?: unknown, options?: ApiOptions) => Promise<T>
  delete: <T = unknown>(path: string, options?: ApiOptions) => Promise<T>
}
