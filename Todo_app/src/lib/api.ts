import type { Todo, TodoStatus } from "@/lib/todos"

const PRIORITY_KEY = "todo_priorities_v1"

// Get priority IDs stored locally
function getPrioritySet(): Set<number> {
  if (typeof window === "undefined" || !window.localStorage) {
    return new Set()
  }
  try {
    const raw = localStorage.getItem(PRIORITY_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

export function isLocalPriority(id: number): boolean {
  return getPrioritySet().has(id)
}

export function setLocalPriority(id: number, priority: boolean): void {
  if (typeof window === "undefined" || !window.localStorage) return
  try {
    const set = getPrioritySet()
    if (priority) {
      set.add(id)
    } else {
      set.delete(id)
    }
    localStorage.setItem(PRIORITY_KEY, JSON.stringify(Array.from(set)))
  } catch (error) {
    console.error("Could not save priority state", error)
  }
}

// In development, "/todos" is proxied by Vite to http://localhost:3000/todos
// This completely avoids browser CORS restrictions.
// VITE_TODOS_API_URL can be provided to override.
export const TODOS_ENDPOINT = import.meta.env.VITE_TODOS_API_URL || "/todos"
export const PROFILES_ENDPOINT = import.meta.env.VITE_PROFILES_API_URL || "/profile"

export type BackendStatus = "TODO" | "IN_PROGRESS" | "DONE"

export type BackendTodo = {
  id: number
  title: string
  status: BackendStatus | TodoStatus
  starred?: boolean
  sortOrder?: number
}

export function toAppStatus(status: BackendStatus | TodoStatus | string): TodoStatus {
  switch (status) {
    case "TODO":
    case "To do":
      return "To do"
    case "IN_PROGRESS":
    case "In progress":
      return "In progress"
    case "DONE":
    case "Done":
      return "Done"
    default:
      return "To do"
  }
}

export function toBackendStatus(status: TodoStatus): BackendStatus {
  switch (status) {
    case "To do":
      return "TODO"
    case "In progress":
      return "IN_PROGRESS"
    case "Done":
      return "DONE"
    default:
      return "TODO"
  }
}

export function toAppTodo(todo: BackendTodo): Todo {
  return {
    id: todo.id,
    title: todo.title,
    status: toAppStatus(todo.status),
    priority: todo.starred ?? isLocalPriority(todo.id),
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "")
    throw new Error(`Request failed (${response.status}): ${errorText || response.statusText}`)
  }

  // Handle empty bodies (e.g. 204 No Content)
  if (response.status === 204) {
    return {} as T
  }

  const text = await response.text()
  if (!text) {
    return {} as T
  }

  return JSON.parse(text) as T
}

export async function getTodos(): Promise<Todo[]> {
  const data = await request<BackendTodo[]>(TODOS_ENDPOINT)
  return data.map(toAppTodo)
}

export async function createTodo(newTodo: Omit<Todo, "id">): Promise<Todo> {
  const payload = {
    title: newTodo.title.trim(),
    status: toBackendStatus(newTodo.status),
    starred: newTodo.priority,
  }

  const data = await request<BackendTodo>(TODOS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  })

  if (newTodo.priority) {
    setLocalPriority(data.id, true)
  }

  return toAppTodo(data)
}

export async function updateTodo(
  id: number,
  changes: Partial<Omit<Todo, "id">>,
  current?: Todo
): Promise<Todo> {
  const payload: { title?: string; status?: BackendStatus; starred?: boolean } = {}

  if (changes.title !== undefined) {
    payload.title = changes.title
  }

  if (changes.status !== undefined) {
    payload.status = toBackendStatus(changes.status)
  }
  if (changes.priority !== undefined) {
    payload.starred = changes.priority
  }

  // Persist title, status, and starred changes in the backend.
  if (Object.keys(payload).length > 0) {
    await request<unknown>(`${TODOS_ENDPOINT}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  }

  if (changes.priority !== undefined) {
    setLocalPriority(id, changes.priority)
  }

  return {
    id,
    title: changes.title ?? current?.title ?? "",
    status: changes.status ?? current?.status ?? "To do",
    priority: changes.priority ?? current?.priority ?? isLocalPriority(id),
  }
}

export async function deleteTodoRequest(id: number): Promise<void> {
  const response = await fetch(`${TODOS_ENDPOINT}/${id}`, {
    method: "DELETE",
  })

  if (!response.ok && response.status !== 404) {
    throw new Error(`Delete failed (${response.status})`)
  }

  setLocalPriority(id, false)
}


export async function bulkUpdateStatus(ids: number[], status: TodoStatus): Promise<void> {
  await request(`${TODOS_ENDPOINT}/bulk`, {
    method: "PATCH",
    body: JSON.stringify({ ids, status: toBackendStatus(status) }),
  })
}

export async function updateTodoOrder(ids: number[]): Promise<void> {
  await request(`${TODOS_ENDPOINT}/order`, {
    method: "PATCH",
    body: JSON.stringify({ ids }),
  })
}

export type Profile = { id: number; name: string }

export async function getProfile(): Promise<Profile | null> {
  const profiles = await request<Profile[]>(PROFILES_ENDPOINT)
  return profiles[0] ?? null
}

export async function createProfile(name: string): Promise<Profile> {
  return request<Profile>(PROFILES_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export async function updateProfile(id: number, name: string): Promise<Profile> {
  return request<Profile>(`${PROFILES_ENDPOINT}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  })
}
