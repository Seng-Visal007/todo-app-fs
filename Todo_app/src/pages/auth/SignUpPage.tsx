import { useState, type FormEvent } from "react"
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react"

import { AuthLayout } from "./AuthLayout"
import { AuthFooter } from "./SignInPage"
import { signUp } from "@/services/api.js"

type SignUpPageProps = { onSignIn: () => void }

export function SignUpPage({ onSignIn }: SignUpPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError("")
    setIsSubmitting(true)
    try {
      await signUp({ email: String(form.get("email")), password: String(form.get("password")) })
      localStorage.setItem("profile_name", String(form.get("name")))
      localStorage.removeItem("profile_id")
      onSignIn()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create your account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return <AuthLayout><div className="auth-card">
    <div className="auth-heading"><h2>Create your account</h2><p>Start organizing your days with a little more ease.</p></div>
    <form className="auth-form" onSubmit={submit}>
      <label>Full name<span className="auth-input"><UserRound size={16} /><input name="name" required placeholder="Jane Cooper" autoComplete="name" /></span></label>
      <label>Email address<span className="auth-input"><Mail size={16} /><input name="email" required type="email" placeholder="you@example.com" autoComplete="email" /></span></label>
      <label>Password<span className="auth-input"><LockKeyhole size={16} /><input name="password" required type={showPassword ? "text" : "password"} placeholder="••••••••" minLength={8} autoComplete="new-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
      <p className="auth-terms">By creating an account, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account…" : "Create account"} <ArrowRight size={16} /></button>
    </form>
    <AuthFooter onSwitch={onSignIn} switchText="Sign in" question="Already have an account?" />
  </div></AuthLayout>
}
