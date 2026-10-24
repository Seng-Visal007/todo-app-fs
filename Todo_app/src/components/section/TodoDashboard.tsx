import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useTodos } from "@/hooks/useTodos"
import { createProfile, getProfileById, updateProfile } from "@/lib/api"
import { type TodoFilter } from "@/lib/todos"
import { AddTodoDialog } from "@/components/section/AddTodoDialog"
import { DashboardHeader } from "@/components/section/DashboardHeader"
import { FloatingAddButton } from "@/components/section/FloatingAddButton"
import { OverviewCard } from "@/components/section/OverviewCard"
import { Sidebar } from "@/components/section/Sidebar"
import { TaskSection } from "@/components/section/TaskSection"

type TodoDashboardProps = {
  onLogout?: () => void
  initialUsername?: string
}

export function TodoDashboard({ onLogout, initialUsername = "User" }: TodoDashboardProps) {
  // ── UI-only state ──────────────────────────────────────────────────
  const [filter, setFilter] = useState<TodoFilter>("All tasks")
  const [username, setUsername] = useState(initialUsername)
  const [profileId, setProfileId] = useState<number | null>(null)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState("")

  // ── Data layer (custom hook) ───────────────────────────────────────
  const {
    todos,
    isLoading,
    error,
    completedCount,
    progress,
    counts,
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
  } = useTodos()

  // ── Event handlers ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    async function loadProfile() {
      try {
        const savedProfileId = Number(localStorage.getItem("profile_id"))
        const profile = savedProfileId
          ? await getProfileById(savedProfileId)
          : await createProfile(initialUsername)
        if (!cancelled) {
          setProfileId(profile.id)
          setUsername(profile.name)
          localStorage.setItem("profile_id", String(profile.id))
          localStorage.setItem("profile_name", profile.name)
        }
      } catch (error) {
        console.error("Could not load profile from backend", error)
      }
    }
    void loadProfile()
    return () => { cancelled = true }
  }, [initialUsername])

  const saveProfileName = useCallback(async (name: string) => {
    const profile = profileId === null
      ? await createProfile(name)
      : await updateProfile(profileId, name)
    setProfileId(profile.id)
    setUsername(profile.name)
    localStorage.setItem("profile_name", profile.name)
  }, [profileId])

  async function handleAddTodo(event: FormEvent) {
    event.preventDefault()
    const title = draft.trim()
    if (!title) return
    try {
      await addTodo(title)
      setDraft("")
      setAdding(false)
    } catch {
      // Error already set inside the hook
    }
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="app-shell">
      <Sidebar
        username={username}
        onUsernameChange={saveProfileName}
        filter={filter}
        onFilterChange={setFilter}
        counts={counts}
        completedCount={completedCount}
        progress={progress}
        onLogout={onLogout}
      />
      <main className="main-content" id="home">
        <div className="page-content">
          <DashboardHeader username={username} backendConnected={!error} />
          <OverviewCard totalCount={todos.length} completedCount={completedCount} progress={progress} />
          <TaskSection
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onAddTask={() => setAdding(true)}
            onStatusChange={updateStatus}
            onEditTitle={updateTitle}
            onTogglePriority={togglePriority}
            onDelete={deleteTodo}
            onBulkDone={markDone}
            onBulkDelete={deleteSelected}
            onReorder={reorderTodos}
            onSort={sortTodos}
            isLoading={isLoading}
            error={error}
            onRefresh={refreshTodos}
          />
          <footer className="page-footer">
            <span>
              Made for meaningful days<span className="footer-spark">✳</span>
            </span>
            <span>One thing at a time.</span>
          </footer>
        </div>
      </main>
      <FloatingAddButton onClick={() => setAdding(true)} />
      <AddTodoDialog
        open={adding}
        title={draft}
        onTitleChange={setDraft}
        onClose={() => setAdding(false)}
        onSubmit={handleAddTodo}
      />
    </div>
  )
}
