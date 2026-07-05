import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "I went from zero callbacks to four interviews in a week. The ATS score alone showed me why my old resume was invisible.",
    name: "Priya Sharma",
    role: "Software Engineer · hired at Stripe",
    initials: "PS",
  },
  {
    quote:
      "The rewrite suggestions are shockingly good. It turned my flat bullet points into achievements that actually got noticed.",
    name: "Marcus Webb",
    role: "Product Manager · hired at Notion",
    initials: "MW",
  },
  {
    quote:
      "As a new grad I had no idea what recruiters wanted. ResumeIQ walked me through every fix and I landed my first offer.",
    name: "Ava Chen",
    role: "New Grad · hired at Airtable",
    initials: "AC",
  },
  {
    quote:
      "The cover letter generator saved me hours every application. Each one felt personal instead of copy-pasted.",
    name: "Diego Martins",
    role: "Data Analyst · hired at Ramp",
    initials: "DM",
  },
  {
    quote:
      "Tailoring my resume per job used to take forever. Now it's a two-minute task and my response rate doubled.",
    name: "Sarah Okafor",
    role: "UX Designer · hired at Figma",
    initials: "SO",
  },
  {
    quote:
      "Clean, fast, and genuinely useful. It's the first resume tool that felt like it was built by people who care about design.",
    name: "Liam Nguyen",
    role: "Marketing Lead · hired at Vercel",
    initials: "LN",
  },
]

export function Testimonials() {
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">Testimonials</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Loved by job seekers everywhere
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
