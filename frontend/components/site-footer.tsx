import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const columns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "ATS Score", "Cover Letters", "Changelog"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Press", "Contact"],
  },
  {
    title: "Resources",
    links: ["Resume tips", "Templates", "Help center", "Community", "Status"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies"],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      {/* CTA */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center shadow-xl sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-foreground/10 blur-3xl"
          />
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to get hired faster?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80">
            Run your free analysis today and see exactly what&apos;s holding your resume back.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" variant="secondary" className="group rounded-full px-6 text-base">
              Analyze Resume
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-10 border-t border-border py-12 md:grid-cols-6">
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-lg font-semibold tracking-tight">ResumeIQ AI</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Analyze. Optimize. Get Hired. The AI copilot for your job search.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ResumeIQ AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">Made for job seekers, everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
