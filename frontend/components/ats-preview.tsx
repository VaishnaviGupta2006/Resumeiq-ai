import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

const breakdown = [
  { label: "Keyword match", value: 94 },
  { label: "Formatting", value: 88 },
  { label: "Readability", value: 90 },
  { label: "Skills coverage", value: 82 },
]

const findings = [
  { icon: CheckCircle2, tone: "text-primary", text: "Strong quantified achievements detected" },
  { icon: CheckCircle2, tone: "text-primary", text: "Contact info parses cleanly" },
  { icon: AlertTriangle, tone: "text-amber-500", text: "Add 2 missing keywords: “Kubernetes”, “CI/CD”" },
  { icon: XCircle, tone: "text-destructive", text: "Remove the two-column layout for ATS safety" },
]

function ScoreRing({ score }: { score: number }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  return (
    <div className="relative h-40 w-40">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--muted)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tracking-tight">{score}</span>
        <span className="text-xs font-medium text-muted-foreground">ATS Score</span>
      </div>
    </div>
  )
}

export function AtsPreview() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">ATS Score</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Know your score before recruiters do
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          A live, section-by-section breakdown of how your resume performs against automated screening.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-5">
        {/* Score card */}
        <div className="lg:col-span-2">
          <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
            <ScoreRing score={92} />
            <p className="mt-6 text-lg font-semibold">Excellent match</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your resume is highly optimized for this role. Apply a few fixes to reach a perfect score.
            </p>
          </div>
        </div>

        {/* Breakdown + findings */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              {breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{b.label}</span>
                    <span className="font-semibold text-muted-foreground">{b.value}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${b.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-sm font-semibold text-foreground">Key findings</p>
              <ul className="mt-4 space-y-3">
                {findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <f.icon className={`mt-0.5 h-4 w-4 shrink-0 ${f.tone}`} />
                    <span className="text-muted-foreground">{f.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
