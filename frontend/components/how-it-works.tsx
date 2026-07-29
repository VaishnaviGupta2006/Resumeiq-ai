import { Upload, Cpu, Rocket } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload your resume",
    desc: "Drop in your PDF or DOCX and paste the job description you're targeting. Takes about ten seconds.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI analyzes everything",
    desc: "ResumeIQ scores your ATS compatibility, finds keyword gaps, and drafts stronger, tailored bullet points.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Apply with confidence",
    desc: "Accept the fixes, export a polished resume, and generate a matching cover letter — then hit apply.",
  },
]

export function HowItWorks() {
  return (
    <section id="about" className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            From upload to hired in three steps
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="relative rounded-2xl border border-border bg-card p-7 shadow-sm">
              <span className="text-sm font-semibold text-primary/50">{s.step}</span>
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
