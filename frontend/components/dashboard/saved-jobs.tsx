import { Building2, MapPin } from "lucide-react"

export function SavedJobs() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Saved Job Descriptions
          </h3>
          <p className="text-xs text-muted-foreground">
            Roles matched to your resume
          </p>
        </div>
      </div>

      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No saved jobs yet
      </div>
    </div>
  )
}
