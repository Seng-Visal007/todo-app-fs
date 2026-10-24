
import { useState, type FormEvent } from "react"
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"

import { AuthLayout } from "./AuthLayout"
import { signIn } from "@/services/api.js"

type SignInPageProps = { onSignUp: () => void; onSuccess: () => void }

export function SignInPage({ onSignUp, onSuccess }: SignInPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError("")
    setIsSubmitting(true)
    try {
      const session = await signIn({ email: String(form.get("email")), password: String(form.get("password")) })
      localStorage.setItem("access_token", session.access_token)
      if (!localStorage.getItem("profile_name")) {
        localStorage.setItem("profile_name", String(form.get("email")).split("@")[0])
      }
      onSuccess()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return <AuthLayout><div className="auth-card">
    <div className="auth-heading"><h2>Welcome back</h2><p>Sign in to pick up right where you left off.</p></div>
    <form className="auth-form" onSubmit={submit}>
      <label>Email address<span className="auth-input"><Mail size={16} /><input name="email" required type="email" placeholder="you@example.com" autoComplete="email" /></span></label>
      <label>Password<span className="auth-input"><LockKeyhole size={16} /><input name="password" required type={showPassword ? "text" : "password"} placeholder="••••••••" minLength={8} autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
      <div className="auth-options"><label className="remember"><input type="checkbox" /> <span>Remember me</span></label><a href="#forgot">Forgot password?</a></div>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Sign in"} <ArrowRight size={16} /></button>
    </form>
    <AuthFooter onSwitch={onSignUp} switchText="Create an account" question="New here?" />
  </div></AuthLayout>
}

export function AuthFooter({ question, switchText, onSwitch }: { question: string; switchText: string; onSwitch: () => void }) {
  return <><div className="auth-divider"><span>or continue with</span></div><button className="google-button" type="button"><b>G</b> Google</button><p className="auth-alternate">{question} <button onClick={onSwitch}>{switchText}</button></p></>
}
