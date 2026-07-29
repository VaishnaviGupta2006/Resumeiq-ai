import { Target } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { ResumeUpload } from '@/components/resume-upload'

export default function JobMatchPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-14 sm:pt-20">
        <section className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Target className="size-3.5 text-primary" />
            AI-powered job matching
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Match your resume to any job
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Upload your resume and paste a job description to see how well you match,
            identify skill gaps, and get tailored recommendations.
          </p>
        </section>

        <ResumeUpload requireJobDescription={true} />
      </main>
    </div>
  )
}
