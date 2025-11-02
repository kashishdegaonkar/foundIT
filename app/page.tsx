import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { ArrowRight, Search, User, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Find Your Next Opportunity with <span className="text-primary">foundIT</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover roles that match your skills. Whether you're looking to advance your
            career or find the perfect candidate, foundIT makes it simple.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Search className="w-5 h-5" />
              Browse Jobs
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center gap-2 border border-border bg-card text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
            >
              Post a Job
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
            <p className="text-muted-foreground">Active Job Listings</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">5K+</div>
            <p className="text-muted-foreground">Successful Placements</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">2K+</div>
            <p className="text-muted-foreground">Active Employers</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why Choose foundIT?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-8 h-8 text-primary" />,
                title: "Smart Search",
                description: "Find jobs that match your skills and preferences with our advanced filtering system.",
              },
              {
                icon: <User className="w-8 h-8 text-accent" />,
                title: "Easy Profiles",
                description: "Create a compelling profile and let employers discover you based on your expertise.",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-secondary" />,
                title: "Growth Focus",
                description: "Connect with opportunities that help you grow your career and reach your goals.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-background border border-border rounded-lg p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Role?</h2>
          <p className="text-lg opacity-90 mb-6">
            Join thousands of professionals who found their perfect match on foundIT.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 bg-primary-foreground text-primary px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Start Your Search
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2025 foundIT. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                About
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
