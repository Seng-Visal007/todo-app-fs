import { CalendarDays } from "lucide-react"

type DashboardHeaderProps = {
  username: string
  backendConnected?: boolean
}

export function DashboardHeader({ username, backendConnected = true }: DashboardHeaderProps) {
  const initials = username.split(" ").map((part) => part[0]).join("").slice(0, 2)
  const today = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date())
  return (
    <>
      <header className="topbar">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-slash">/</span>
          <strong>My tasks</strong>
        </div>
        <div className="topbar-right">
          <span
            className={`backend-status-pill ${backendConnected ? "" : "error"}`}
            title="Backend endpoint: http://localhost:3000/todos"
          >
            <span className={`pulse-dot ${backendConnected ? "" : "error"}`} />
            {backendConnected ? "Backend :3000 connected" : "Backend offline"}
          </span>
          <span className="today-date">
            <CalendarDays size={15} /> {today}
          </span>
          <button className="top-avatar" title={username}>
            {initials}
          </button>
        </div>
      </header>
      <div className="greeting-row">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> YOUR PERSONAL DASHBOARD
          </div>
          <h1>
            Good morning, {username.split(" ")[0]}
            <span className="wave">✳</span>
          </h1>
          <p className="intro">A little progress each day adds up to big results.</p>
        </div>
      </div>
    </>
  )
}

