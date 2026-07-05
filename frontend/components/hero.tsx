import { ArrowRight, CheckCircle2, Sparkles, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* grid pattern with radial fade */}
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      {/* subtle blue gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-accent/60 via-background to-background"
      />
      <div
        aria-hidden
        className="animate-float-slow pointer-events-none absolute left-1/2 top-[-120px] -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-rise mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered resume intelligence
          </div>

          <h1 className="animate-rise text-balance text-4xl font-semibold tracking-tight sm:text-6xl [animation-delay:60ms]">
            Analyze. Optimize. <span className="text-primary">Get Hired.</span>
          </h1>

          <p className="animate-rise mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground [animation-delay:120ms]">
            ResumeIQ AI scans your resume against any job description, delivers an instant ATS score, and
            rewrites the gaps — so you get past the filters and in front of real people.
          </p>

          <div className="animate-rise mt-8 flex flex-col items-center justify-center gap-3 [animation-delay:180ms] sm:flex-row">
            <Button
              size="lg"
              className="group rounded-full px-6 text-base transition-transform hover:scale-[1.03] active:scale-95"
            >
              Analyze Resume
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-6 text-base transition-transform hover:scale-[1.03] active:scale-95"
            >
              Watch demo
            </Button>
          </div>

          <div className="animate-rise mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground [animation-delay:240ms]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> No credit card required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Free ATS check
            </span>
          </div>
        </div>

        {/* Hero preview card */}
        <div className="animate-rise mx-auto mt-16 max-w-4xl [animation-delay:300ms]">
          <div className="rounded-3xl border border-border bg-card p-2 shadow-2xl shadow-primary/5">
            <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4 sm:p-6">
              <div className="grid items-center gap-4 sm:grid-cols-3">
                {/* Animated ATS score ring illustration */}
                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="relative h-20 w-20 shrink-0">
                    <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="9" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="9"
                        strokeLinecap="round"
                        className="animate-ring"
                        style={{ ["--dash" as string]: "264", ["--offset" as string]: "21" }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold tracking-tight">
                      92
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">ATS Score</span>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                      <TrendingUp className="h-3.5 w-3.5" /> +18 after optimizing
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Keywords</span>
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-3 text-4xl font-semibold tracking-tight">24/26</p>
                  <p className="mt-1 text-xs text-muted-foreground">Matched to job</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Fixes</span>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-3 text-4xl font-semibold tracking-tight">7</p>
                  <p className="mt-1 text-xs text-muted-foreground">1-click improvements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
