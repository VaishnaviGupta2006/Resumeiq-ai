import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnalysisPreview() {
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="text-sm font-semibold text-primary">Resume analysis</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Rewrite weak lines into recruiter-ready wins
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            ResumeIQ reads every bullet point, spots vague or passive language, and suggests a stronger,
            quantified version you can accept in a single click.
          </p>
          <Button className="mt-8 rounded-full px-6">
            See a full analysis
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-7">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-destructive">Before</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              Responsible for managing the team and helping with various marketing tasks and campaigns.
            </p>
          </div>

          <div className="my-3 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> AI optimized
            </span>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">After</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              Led a 6-person marketing team to launch 12 campaigns, lifting qualified leads 43% and cutting
              cost-per-acquisition by 28% in two quarters.
            </p>
          </div>

          <div className="mt-5 flex gap-2">
            <Button size="sm" className="flex-1 rounded-full">
              Accept
            </Button>
            <Button size="sm" variant="outline" className="flex-1 rounded-full">
              Regenerate
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
