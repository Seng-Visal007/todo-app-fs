import { Sparkles } from "lucide-react"

type OverviewCardProps = { totalCount: number; completedCount: number; progress: number }

export function OverviewCard({ totalCount, completedCount, progress }: OverviewCardProps) {
  const remaining = totalCount - completedCount
  return <section className="overview-card"><div className="overview-main"><div className="overview-copy"><div className="overview-label"><Sparkles size={14} /> YOUR OVERVIEW</div><h2>You’re making moves.</h2><p>You have <strong>{remaining} {remaining === 1 ? "task" : "tasks"}</strong> left to tackle. Let’s make today count.</p></div><div className="overview-metrics"><div className="metric"><span className="metric-label">TOTAL TASKS</span><strong>{String(totalCount).padStart(2, "0")}</strong></div><span className="metric-divider" /><div className="metric"><span className="metric-label">COMPLETED</span><strong>{String(completedCount).padStart(2, "0")}<small> / {String(totalCount).padStart(2, "0")}</small></strong></div><span className="metric-divider" /><div className="metric"><span className="metric-label">COMPLETION</span><strong>{progress}<small>%</small></strong></div></div></div><div className="overview-bottom"><div className="overview-progress"><span style={{ width: `${progress}%` }} /></div><span>{progress === 100 ? "Everything done. Brilliant work!" : "You’re on your way — keep the momentum going."}</span></div><span className="overview-decoration deco-one" /><span className="overview-decoration deco-two" /></section>
}
