import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { bulkUpdateStatus, createTodo, deleteTodoRequest, getTodos, updateTodo, updateTodoOrder } from "@/lib/api"
import { type Todo, type TodoFilter, type TodoStatus } from "@/lib/todos"

export function useTodos() {
  // ── State ────────────────────────────────────────────────────────────
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Keep a ref so callbacks can read the latest todos without re-creating
  const todosRef = useRef(todos)
  useEffect(() => {
    todosRef.current = todos
  }, [todos])

  // ── Derived values ───────────────────────────────────────────────────
  const completedCount = useMemo(
    () => todos.filter((todo) => todo.status === "Done").length,
    [todos]
  )

  const progress = useMemo(
    () => (todos.length ? Math.round((completedCount / todos.length) * 100) : 0),
    [todos.length, completedCount]
  )

  const counts: Record<TodoFilter, number> = useMemo(
    () => ({
      "All tasks": todos.length,
      "To do": todos.filter((todo) => todo.status === "To do").length,
      "In progress": todos.filter((todo) => todo.status === "In progress").length,
      Done: completedCount,
    }),
    [todos, completedCount]
  )

  // ── Effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    let ignore = false

    async function loadTodos() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getTodos()
        if (!ignore) setTodos(data)
      } catch (err: unknown) {
        if (!ignore) {
          const message =
            err instanceof Error ? err.message : "Failed to load tasks from backend"
          console.error("Could not load tasks from backend", err)
          setError(
            `${message}. Ensure your backend server is running on http://localhost:3000`
          )
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadTodos()
    return () => {
      ignore = true
    }
  }, [])

  // ── Data fetching ────────────────────────────────────────────────────
  const refreshTodos = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getTodos()
      setTodos(data)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load tasks from backend"
      console.error("Could not load tasks from backend", err)
      setError(
        `${message}. Ensure your backend server is running on http://localhost:3000`
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ── CRUD operations ──────────────────────────────────────────────────
  const addTodo = useCallback(async (title: string) => {
    try {
      const todo = await createTodo({ title, status: "To do", priority: false })
      setTodos((current) => [todo, ...current])
    } catch (err) {
      console.error("Could not create task", err)
      setError("Failed to create task on the backend.")
      throw err
    }
  }, [])

  const updateStatus = useCallback(async (id: number, status: TodoStatus) => {
    const currentItem = todosRef.current.find((item) => item.id === id)
    if (!currentItem) return
    try {
      const updated = await updateTodo(id, { status }, currentItem)
      setTodos((current) => current.map((todo) => (todo.id === id ? updated : todo)))
    } catch (err) {
      console.error("Could not update task status", err)
      setError("Failed to update status on the backend.")
    }
  }, [])

  const updateTitle = useCallback(async (id: number, title: string) => {
    const currentItem = todosRef.current.find((item) => item.id === id)
    if (!currentItem) return
    try {
      const updated = await updateTodo(id, { title }, currentItem)
      setTodos((current) => current.map((todo) => (todo.id === id ? updated : todo)))
    } catch (err) {
      console.error("Could not update task title", err)
      setError("Failed to update title on the backend.")
    }
  }, [])

  const togglePriority = useCallback(async (id: number) => {
    const currentItem = todosRef.current.find((item) => item.id === id)
    if (!currentItem) return
    try {
      const updated = await updateTodo(
        id,
        { priority: !currentItem.priority },
        currentItem
      )
      setTodos((current) =>
        current.map((item) => (item.id === id ? updated : item))
      )
    } catch (err) {
      console.error("Could not update task priority", err)
    }
  }, [])

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await deleteTodoRequest(id)
      setTodos((current) => current.filter((todo) => todo.id !== id))
    } catch (err) {
      console.error("Could not delete task", err)
      setError("Failed to delete task on the backend.")
    }
  }, [])

  // ── Bulk operations ──────────────────────────────────────────────────
  const markDone = useCallback(async (ids: number[]) => {
    try {
      await bulkUpdateStatus(ids, "Done")
      setTodos((current) =>
        current.map((todo) =>
          ids.includes(todo.id) ? { ...todo, status: "Done" as const } : todo
        )
      )
    } catch (err) {
      console.error("Could not mark tasks done", err)
      setError("Failed to mark tasks done on the backend.")
    }
  }, [])

  const deleteSelected = useCallback(async (ids: number[]) => {
    try {
      await Promise.all(ids.map(deleteTodoRequest))
      setTodos((current) => current.filter((todo) => !ids.includes(todo.id)))
    } catch (err) {
      console.error("Could not delete selected tasks", err)
      setError("Failed to delete selected tasks on the backend.")
    }
  }, [])

  // ── Local-only operations ────────────────────────────────────────────
  const persistOrder = useCallback(async (ordered: Todo[]) => {
    setTodos(ordered)
    try {
      await updateTodoOrder(ordered.map((todo) => todo.id))
    } catch (err) {
      console.error("Could not save task order", err)
      setError("Failed to save task order on the backend.")
      await refreshTodos()
    }
  }, [refreshTodos])

  const reorderTodos = useCallback((fromId: number, toId: number) => {
    const reordered = [...todosRef.current]
    const fromIndex = reordered.findIndex((todo) => todo.id === fromId)
    const toIndex = reordered.findIndex((todo) => todo.id === toId)
    if (fromIndex < 0 || toIndex < 0) return
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    void persistOrder(reordered)
  }, [persistOrder])

  const sortTodos = useCallback(() => {
    void persistOrder([...todosRef.current].reverse())
  }, [persistOrder])

  // ── Public API ───────────────────────────────────────────────────────
  return {
    // State
    todos,
    isLoading,
    error,

    // Derived
    completedCount,
    progress,
    counts,

    // Actions
    refreshTodos,
    addTodo,
    updateStatus,
    updateTitle,
    togglePriority,
    deleteTodo,
    markDone,
    deleteSelected,
    reorderTodos,
    sortTodos,
  }
}
