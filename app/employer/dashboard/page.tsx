"use client"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Edit2, Trash2, Eye } from "lucide-react"
import useSWR from "swr"

const fetcher = async (userId: string) => {
  const supabase = createClient()
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", userId)
    .order("created_at", { ascending: false })
  return data || []
}

export default function EmployerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

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

  const { data: jobs } = useSWR(user?.id ? `jobs_${user.id}` : null, () => fetcher(user.id))

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId)
      if (error) throw error
      alert("Job deleted successfully")
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Job Postings</h1>
          <Link
            href="/employer/post-job"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </Link>
        </div>

        {!jobs || jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No job postings yet.</p>
            <Link href="/employer/post-job" className="text-primary hover:underline font-medium">
              Create your first job posting
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <div
                key={job.id}
                className="bg-card border border-border rounded-lg p-6 flex justify-between items-start"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{job.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {job.location} · {job.job_type.replace("_", " ")}
                  </p>
                  <p className="text-foreground text-sm">
                    Status:{" "}
                    <span className={`font-medium ${job.status === "open" ? "text-green-600" : "text-red-600"}`}>
                      {job.status}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/employer/applications/${job.id}`}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="View Applications"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/employer/edit-job/${job.id}`}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit Job"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-5 h-5" />
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
