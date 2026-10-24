import { Check, CheckSquare2 } from "lucide-react"
import type { ReactNode } from "react"

type AuthLayoutProps = { children: ReactNode }

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-intro">
        <a className="auth-brand" href="#top" aria-label="Todo home">
          <span className="auth-brand-mark"><CheckSquare2 size={18} strokeWidth={2.5} /></span>
          todo<span>.</span>
        </a>
        <div className="auth-intro-copy">
          <p className="auth-kicker">YOUR DAY, IN FOCUS</p>
          <h1>Make space for<br /><em>what matters.</em></h1>
          <p>Plan your tasks, keep your momentum, and finish every day feeling lighter.</p>
        </div>
        <div className="auth-preview" aria-hidden="true">
          <div className="preview-top"><span>Today&apos;s focus</span><strong>3 of 5</strong></div>
          <div className="preview-progress"><span /></div>
          <div className="preview-task done"><i><Check size={11} /></i> Review project brief</div>
          <div className="preview-task"><i /> Outline tomorrow&apos;s priorities</div>
          <div className="preview-task"><i /> Book a little time for you</div>
        </div>
        <p className="auth-quote">“Small steps, every day.”</p>
      </section>
      <section className="auth-panel" id="top">{children}</section>
    </main>
  )
}
