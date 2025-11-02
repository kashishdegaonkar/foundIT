"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { MapPin, DollarSign, Briefcase, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user)

      const { data: jobData } = await supabase.from("jobs").select("*").eq("id", params.id).single()

      setJob(jobData)

      if (userData.user) {
        const { data: appData } = await supabase
          .from("applications")
          .select("id")
          .eq("job_id", params.id)
          .eq("applicant_id", userData.user.id)
          .single()

        setHasApplied(!!appData)
      }

      setLoading(false)
    }

    fetchData()
  }, [params.id])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsApplying(true)

    try {
      const { error } = await supabase.from("applications").insert({
        job_id: params.id,
        applicant_id: user.id,
        cover_letter: coverLetter || null,
      })

      if (error) throw error

      setHasApplied(true)
      setCoverLetter("")
      alert("Application submitted successfully!")
    } catch (error) {
      console.error("Error applying:", error)
    } finally {
      setIsApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-muted-foreground">Job not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/jobs" className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{job.title}</h1>
              <p className="text-lg text-muted-foreground">{job.company_name}</p>
            </div>
            <span className="bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full">
              {job.job_type.replace("_", " ")}
            </span>
          </div>

          <div className="flex flex-wrap gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              {job.location}
              {job.is_remote && " (Remote)"}
            </div>
            {job.salary_min && (
              <div className="flex items-center gap-2 text-foreground">
                <DollarSign className="w-5 h-5 text-primary" />${job.salary_min.toLocaleString()} - $
                {job.salary_max?.toLocaleString()}
              </div>
            )}
            <div className="flex items-center gap-2 text-foreground">
              <Briefcase className="w-5 h-5 text-primary" />
              {job.category}
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Job Description</h2>
            <p className="text-foreground whitespace-pre-line mb-8">{job.description}</p>

            <h2 className="text-2xl font-bold text-foreground mb-4">Requirements</h2>
            <p className="text-foreground whitespace-pre-line mb-8">{job.requirements}</p>

            {job.skills_required?.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  {job.skills_required.map((skill: string) => (
                    <span key={skill} className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Application Section */}
        <div className="bg-card border border-border rounded-lg p-8">
          {hasApplied ? (
            <div className="text-center py-8">
              <p className="text-lg text-foreground mb-2">You've already applied for this job.</p>
              <p className="text-muted-foreground">We'll notify you if the employer is interested.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-6">Apply for This Job</h2>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label htmlFor="cover-letter" className="block text-sm font-medium text-foreground mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    id="cover-letter"
                    placeholder="Tell the employer why you're a great fit for this role..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isApplying || !user}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {isApplying ? "Submitting..." : user ? "Submit Application" : "Sign in to Apply"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
