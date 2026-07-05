import { Mail, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CoverLetter() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
      {/* Preview card first on large screens */}
      <div className="order-2 lg:order-1">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Cover letter · Senior Product Designer</p>
              <p className="text-xs text-muted-foreground">Generated for Northwind Labs</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>Dear Hiring Manager,</p>
            <p>
              As a product designer with seven years shipping consumer apps used by millions, I was thrilled to
              see Northwind&apos;s focus on human-centered AI. My work redesigning onboarding at Lumen lifted
              activation by 34% — the exact outcome your role is built around.
            </p>
            <p className="text-muted-foreground/70">
              I&apos;d love to bring that same rigor to your design team and help scale a product people
              genuinely enjoy using…
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <Button size="sm" className="rounded-full">
              Copy
            </Button>
            <Button size="sm" variant="outline" className="rounded-full">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Adjust tone
            </Button>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <p className="text-sm font-semibold text-primary">AI cover letters</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          A tailored cover letter for every application
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Generate a personalized cover letter in seconds. ResumeIQ pulls from your resume and the job
          description to write something that sounds like you — not a template.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Matches the role, company, and your real experience
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Adjustable tone: confident, warm, or concise
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Export to PDF or copy in one click
          </li>
        </ul>
        <Button className="mt-8 rounded-full px-6">
          Generate a cover letter
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
