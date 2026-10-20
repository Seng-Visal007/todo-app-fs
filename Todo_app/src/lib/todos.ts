export type TodoStatus = "To do" | "In progress" | "Done"

export type Todo = {
  id: number
  title: string
  status: TodoStatus
  priority: boolean
}

export const todoFilters = ["All tasks", "To do", "In progress", "Done"] as const
export type TodoFilter = (typeof todoFilters)[number]

export const initialTodos: Todo[] = [
  { id: 1, title: "Review the latest product designs", status: "In progress", priority: true },
  { id: 2, title: "Prepare a project proposal", status: "To do", priority: false },
  { id: 3, title: "Send the weekly update to the team", status: "To do", priority: true },
  { id: 4, title: "Organize notes from the workshop", status: "Done", priority: false },
  { id: 5, title: "Plan content for next week", status: "In progress", priority: false },
]
