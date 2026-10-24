const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

/**
 * Shared HTTP client for application services.
 * Pass a path such as "/auth/sign-in" or a complete URL.
 */
export async function apiRequest(path, options = {}) {
  const { headers, ...requestOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    ...requestOptions,
  })

  if (!response.ok) {
    const message = await response.text().catch(() => "")
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  if (response.status === 204) return null

  const body = await response.text()
  return body ? JSON.parse(body) : null
}

export async function signIn(credentials) {
  return api.post("/auth/login", credentials)
}

export async function signUp(credentials) {
  return api.post("/auth/signup", credentials)
}

export const api = {
  get: (path, options) => apiRequest(path, options),
  post: (path, body, options) => apiRequest(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  patch: (path, body, options) => apiRequest(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  put: (path, body, options) => apiRequest(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" }),
}
