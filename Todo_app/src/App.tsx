import { useState } from "react"

import { SignInPage } from "@/pages/auth/SignInPage"
import { SignUpPage } from "@/pages/auth/SignUpPage"
import { TodoDashboard } from "@/components/section/TodoDashboard"

type AuthPage = "signin" | "signup"

function App() {
  const [page, setPage] = useState<AuthPage>("signin")
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem("access_token")))

  if (isAuthenticated) return <TodoDashboard initialUsername={localStorage.getItem("profile_name") ?? "User"} onLogout={() => {
    localStorage.removeItem("access_token")
    setPage("signin")
    setIsAuthenticated(false)
  }} />

  return page === "signin" ? (
    <SignInPage onSignUp={() => setPage("signup")} onSuccess={() => setIsAuthenticated(true)} />
  ) : (
    <SignUpPage onSignIn={() => setPage("signin")} />
  )
}

export default App
