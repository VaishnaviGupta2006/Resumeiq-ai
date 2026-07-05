import { Gauge, ScanSearch, PenLine, Target, ShieldCheck, LineChart } from "lucide-react"

const features = [
  {
    icon: Gauge,
    title: "Instant ATS scoring",
    desc: "Get a real-time compatibility score that mirrors how applicant tracking systems actually rank your resume.",
  },
  {
    icon: ScanSearch,
    title: "Keyword gap analysis",
    desc: "See exactly which skills and terms the job wants — and which ones your resume is missing.",
  },
  {
    icon: PenLine,
    title: "AI rewrite suggestions",
    desc: "Turn weak bullet points into quantified, impact-driven achievements with one click.",
  },
  {
    icon: Target,
    title: "Job-specific tailoring",
    desc: "Paste any job description and instantly tailor your resume to match the role's requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Format checker",
    desc: "Catch layout issues, unreadable fonts, and parsing errors before a recruiter ever sees them.",
  },
  {
    icon: LineChart,
    title: "Progress tracking",
    desc: "Watch your score climb as you apply improvements and compare versions side by side.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">Features</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to beat the bots
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          A complete toolkit that reads your resume like a recruiter and a machine — then tells you how to win both.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
