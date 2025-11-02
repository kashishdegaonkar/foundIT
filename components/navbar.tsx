"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Briefcase, LogOut, Settings } from "lucide-react"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">foundIT</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/jobs" className="nav-link text-sm font-medium">
              Browse Jobs
            </Link>
            {user && user.user_metadata?.user_type === "employer" && (
              <Link href="/employer/dashboard" className="nav-link text-sm font-medium">
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!loading && !user ? (
              <>
                <Link href="/auth/login" className="nav-link text-sm font-medium">
                  Login
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Sign up
                </Link>
              </>
            ) : loading ? (
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="nav-link">
                  <Settings className="w-5 h-5" />
                </Link>
                <button onClick={handleLogout} className="nav-link" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
