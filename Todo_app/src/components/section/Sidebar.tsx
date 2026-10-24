import { useState, type FormEvent } from "react"
import { ArrowUp, Check, CheckCheck, ChevronDown, Circle, Clock3, ListTodo, LogOut, Settings2, Target, UserRound } from "lucide-react"
import { todoFilters, type TodoFilter } from "@/lib/todos"

type SidebarProps = {
  username: string
  onUsernameChange: (username: string) => void | Promise<void>
  filter: TodoFilter
  onFilterChange: (filter: TodoFilter) => void
  counts: Record<TodoFilter, number>
  completedCount: number
  progress: number
  onLogout?: () => void
}

export function Sidebar({ username, onUsernameChange, filter, onFilterChange, counts, completedCount, progress, onLogout }: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [nameDraft, setNameDraft] = useState(username)
  async function saveProfile(event: FormEvent) {
    event.preventDefault()
    await onUsernameChange(nameDraft.trim() || "Visal")
    setProfileOpen(false)
  }
  const initials = username.split(" ").map((part) => part[0]).join("").slice(0, 2)

  return (
    <aside className="sidebar">
      <a className="brand" href="#home" aria-label="Tver home"><span className="brand-mark"><CheckCheck size={19} strokeWidth={2.6} /></span><span>Tver<span className="brand-period">.</span></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace-switch" onClick={() => { setNameDraft(username); setProfileOpen((open) => !open) }}><span className="workspace-avatar">{username.slice(0, 1)}</span><span className="workspace-copy"><strong>{username.split(" ")[0]}’s space</strong><small>Personal workspace</small></span><ChevronDown size={15} className="workspace-chevron" /></button>
      {profileOpen && <form className="profile-card" onSubmit={saveProfile}><label htmlFor="username">Your display name</label><div className="profile-input"><UserRound size={15} /><input id="username" value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} maxLength={32} /></div><button className="profile-save">Save profile</button></form>}
      <div className="nav-heading">MENU</div>
      <nav className="side-nav" aria-label="Task filters">{todoFilters.map((item, index) => <button key={item} className={`nav-item ${filter === item ? "active" : ""}`} onClick={() => onFilterChange(item)}><span className="nav-icon">{index === 0 ? <ListTodo size={17} /> : index === 1 ? <Circle size={16} /> : index === 2 ? <Clock3 size={17} /> : <Check size={17} />}</span><span>{item}</span><span className="nav-count">{counts[item]}</span></button>)}</nav>
      <div className="sidebar-spacer" />
      <div className="focus-card"><div className="focus-card-top"><span className="focus-icon"><Target size={16} /></span><span className="focus-percent">{progress}%</span></div><strong>Daily progress</strong><p>You’ve completed {completedCount} of {counts["All tasks"]} tasks. Keep it up!</p><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
      <button className="settings-link" onClick={() => { setNameDraft(username); setProfileOpen((open) => !open) }}><Settings2 size={17} /><span>Profile settings</span><ArrowUp size={14} className="settings-arrow" /></button>
      <div className="sidebar-footer"><span className="footer-avatar">{initials}</span><div className="footer-user"><strong>{username}</strong><small>Free plan</small></div><button aria-label="Sign out" className="logout-button" onClick={onLogout}><LogOut size={16} /></button></div>
    </aside>
  )
}
