import { Upload, ScanLine, Target, FileText, ArrowUpRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Action = {
  label: string
  desc: string
  icon: LucideIcon
}

const actions: Action[] = [
  { label: "Upload Resume", desc: "Add a new document", icon: Upload },
  { label: "Analyze Resume", desc: "Run an ATS scan", icon: ScanLine },
  { label: "Match Job Description", desc: "Compare to a role", icon: Target },
  {
    label: "Generate Cover Letter",
    desc: "AI-written draft",
    icon: FileText,
  },
]

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
      <p className="text-xs text-muted-foreground">
        Jump straight into your workflow
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.label}
            className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3 text-left transition-all hover:border-primary/40 hover:bg-accent/50"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <action.icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {action.label}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {action.desc}
              </p>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </button>
        ))}
      </div>
    </div>
  )
}
