import { useMemo, useState, type DragEvent, type FormEvent } from "react"
import { AlertCircle, ArrowUpDown, Check, CheckCheck, ChevronDown, Command, GripVertical, Pencil, Plus, RotateCw, Search, Star, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { todoFilters, type Todo, type TodoFilter, type TodoStatus } from "@/lib/todos"

type TaskSectionProps = {
  todos: Todo[]
  filter: TodoFilter
  onFilterChange: (filter: TodoFilter) => void
  onAddTask: () => void
  onStatusChange: (id: number, status: TodoStatus) => void
  onEditTitle: (id: number, title: string) => void
  onTogglePriority: (id: number) => void
  onDelete: (id: number) => void
  onBulkDone: (ids: number[]) => void
  onBulkDelete: (ids: number[]) => void
  onReorder: (fromId: number, toId: number) => void
  onSort: () => void
  isLoading?: boolean
  error?: string | null
  onRefresh?: () => void
}

export function TaskSection({
  todos,
  filter,
  onFilterChange,
  onAddTask,
  onStatusChange,
  onEditTitle,
  onTogglePriority,
  onDelete,
  onBulkDone,
  onBulkDelete,
  onReorder,
  onSort,
  isLoading = false,
  error = null,
  onRefresh,
}: TaskSectionProps) {

  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<number[]>([])
  const [editing, setEditing] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [dragId, setDragId] = useState<number | null>(null)
  const visible = useMemo(() => todos.filter((todo) => (filter === "All tasks" || todo.status === filter) && todo.title.toLowerCase().includes(search.toLowerCase())), [todos, filter, search])
  const counts: Record<TodoFilter, number> = { "All tasks": todos.length, "To do": todos.filter((todo) => todo.status === "To do").length, "In progress": todos.filter((todo) => todo.status === "In progress").length, Done: todos.filter((todo) => todo.status === "Done").length }

  function saveEdit(event: FormEvent) {
    event.preventDefault()
    const title = editTitle.trim()
    if (editing === null || !title) return
    onEditTitle(editing, title)
    setEditing(null)
  }
  function toggleSelected(id: number) { setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]) }
  function handleDrop(event: DragEvent<HTMLElement>, targetId: number) {
    event.preventDefault()
    if (dragId !== null && dragId !== targetId) onReorder(dragId, targetId)
    setDragId(null)
  }

  return (
    <section className="tasks-section">
      <div className="section-heading">
        <div>
          <div className="section-kicker">THE GAME PLAN</div>
          <h2>
            Your tasks <span className="task-total">{todos.length}</span>
          </h2>
        </div>
        <div className="section-tools">
          <label className="search-box">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks..."
              aria-label="Search tasks"
            />
            <kbd>
              <Command size={11} /> K
            </kbd>
          </label>
          {onRefresh && (
            <button className="sort-button" onClick={onRefresh} title="Sync with backend">
              <RotateCw size={14} className={isLoading ? "animate-spin" : ""} /> Sync
            </button>
          )}
          <button className="sort-button" onClick={onSort}>
            <ArrowUpDown size={15} /> Sort
          </button>
        </div>
      </div>

      {error && (
        <div className="backend-error-banner">
          <AlertCircle size={16} />
          <div className="backend-error-text">
            <strong>Backend Connection Issue</strong>
            <span>{error}</span>
          </div>
          {onRefresh && (
            <button onClick={onRefresh} className="backend-retry-btn">
              Retry
            </button>
          )}
        </div>
      )}

      <div className="filter-tabs">
        {todoFilters.map((item) => (
          <button
            key={item}
            onClick={() => onFilterChange(item)}
            className={`filter-tab ${filter === item ? "selected" : ""}`}
          >
            {item}
            <span>{counts[item]}</span>
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="bulk-bar">
          <span>{selected.length} selected</span>
          <button
            onClick={() => {
              onBulkDone(selected)
              setSelected([])
            }}
          >
            <Check size={15} /> Mark done
          </button>
          <button
            className="bulk-delete"
            onClick={() => {
              onBulkDelete(selected)
              setSelected([])
            }}
          >
            <Trash2 size={15} /> Delete
          </button>
          <button
            className="bulk-clear"
            aria-label="Clear selection"
            onClick={() => setSelected([])}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="todo-list" onDragOver={(event) => event.preventDefault()}>
        {isLoading && todos.length === 0 ? (
          <div className="loading-state">
            <RotateCw size={22} className="animate-spin" />
            <strong>Loading tasks from backend...</strong>
            <span>Connecting to http://localhost:3000/todos</span>
          </div>
        ) : (
          <>
            {visible.map((todo, index) => (
              <article
                key={todo.id}
                className={`todo-row ${todo.status === "Done" ? "is-done" : ""} ${
                  dragId === todo.id ? "is-dragging" : ""
                }`}
                draggable
                onDragStart={() => setDragId(todo.id)}
                onDrop={(event) => handleDrop(event, todo.id)}
                onDragEnd={() => setDragId(null)}
              >
                <button className="drag-handle" aria-label="Drag to reorder">
                  <GripVertical size={17} />
                </button>
                <button
                  aria-label={`${selected.includes(todo.id) ? "Deselect" : "Select"} ${todo.title}`}
                  className={`select-box ${selected.includes(todo.id) ? "checked" : ""}`}
                  onClick={() => toggleSelected(todo.id)}
                >
                  {selected.includes(todo.id) && <Check size={12} strokeWidth={3} />}
                </button>
                <span className={`row-index ${todo.status === "Done" ? "index-done" : ""}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="todo-title-wrap">
                  {editing === todo.id ? (
                    <form onSubmit={saveEdit} className="edit-form">
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        onKeyDown={(event) => event.key === "Escape" && setEditing(null)}
                        aria-label="Edit task title"
                      />
                      <button type="submit" aria-label="Save task">
                        <Check size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label="Cancel edit"
                        onClick={() => setEditing(null)}
                      >
                        <X size={15} />
                      </button>
                    </form>
                  ) : (
                    <span
                      className="todo-title"
                      onDoubleClick={() => {
                        setEditing(todo.id)
                        setEditTitle(todo.title)
                      }}
                      title="Double click to edit"
                    >
                      {todo.title}
                    </span>
                  )}
                </div>
                <button
                  aria-label={todo.priority ? "Remove priority" : "Mark priority"}
                  className={`priority-button ${todo.priority ? "is-priority" : ""}`}
                  onClick={() => onTogglePriority(todo.id)}
                >
                  <Star size={16} fill={todo.priority ? "currentColor" : "none"} />
                </button>
                <label className={`status-pill ${todo.status.toLowerCase().replace(" ", "-")}`}>
                  <span />
                  {todo.status}
                  <select
                    aria-label={`Change status for ${todo.title}`}
                    value={todo.status}
                    onChange={(event) => onStatusChange(todo.id, event.target.value as TodoStatus)}
                  >
                    <option>To do</option>
                    <option>In progress</option>
                    <option>Done</option>
                  </select>
                  <ChevronDown size={12} />
                </label>
                <div className="row-actions">
                  <button
                    title="Edit title"
                    aria-label={`Edit ${todo.title}`}
                    onClick={() => {
                      setEditing(todo.id)
                      setEditTitle(todo.title)
                    }}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    title="Delete task"
                    aria-label={`Delete ${todo.title}`}
                    onClick={() => {
                      onDelete(todo.id)
                      setSelected((current) => current.filter((id) => id !== todo.id))
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
            {visible.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">
                  <CheckCheck size={22} />
                </span>
                <strong>
                  {search
                    ? "No matching tasks"
                    : filter === "All tasks"
                    ? "Your list is looking fresh"
                    : `No ${filter.toLowerCase()} tasks`}
                </strong>
                <p>
                  {search
                    ? "Try another search term."
                    : "Add a task to get the ball rolling."}
                </p>
                {!search && (
                  <Button variant="ghost" onClick={onAddTask}>
                    <Plus size={15} /> Add your first task
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className="list-footer">
        <span>
          Showing <strong>{visible.length}</strong> of <strong>{todos.length}</strong> tasks
        </span>
        <span className="drag-hint">
          <GripVertical size={14} /> Drag to reorder
        </span>
      </div>
    </section>
  )
}

