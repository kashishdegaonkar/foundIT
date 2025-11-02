"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import useSWR from "swr"

const fetcher = async (jobId: string) => {
  const supabase = createClient()
  const { data } = await supabase
    .from("applications")
    .select("*, profiles!applicant_id(full_name, email, location, skills)")
    .eq("job_id", jobId)
    .order("applied_at", { ascending: false })
  return data || []
}

export default function ApplicationsPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const { data: applications } = useSWR(params.jobId ? `apps_${params.jobId}` : null, () =>
    fetcher(params.jobId as string),
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", userData.user.id).single()

      if (profile?.user_type !== "employer") {
        router.push("/")
        return
      }

      setUser(userData.user)
      setLoading(false)
    }

    checkUser()
  }, [])

  const handleStatusUpdate = async (appId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", appId)

      if (error) throw error
      alert("Application status updated!")
    } catch (error) {
      console.error("Error updating application:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/employer/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Applications</h1>

        {!applications || applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No applications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => (
              <div key={app.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{app.profiles?.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{app.profiles?.email}</p>
                    {app.profiles?.location && <p className="text-sm text-muted-foreground">{app.profiles.location}</p>}
                  </div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      app.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : app.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {app.profiles?.skills?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {app.profiles.skills.map((skill: string) => (
                        <span key={skill} className="bg-secondary/20 text-secondary text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {app.cover_letter && (
                  <div className="mb-4 p-4 bg-background rounded border border-border">
                    <p className="text-sm font-medium text-foreground mb-2">Cover Letter:</p>
                    <p className="text-sm text-muted-foreground">{app.cover_letter}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(app.id, "accepted")}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(app.id, "rejected")}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
