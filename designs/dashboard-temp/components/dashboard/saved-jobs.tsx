import { Building2, MapPin } from "lucide-react"
import { savedJobs } from "@/lib/dashboard-data"

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
        <button className="text-xs font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <ul className="divide-y divide-border">
        {savedJobs.map((job) => (
          <li
            key={job.id}
            className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Building2 className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {job.title}
              </p>
              <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                {job.company}
                <span aria-hidden="true">·</span>
                <MapPin className="size-3" />
                {job.location}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-semibold tabular-nums text-primary">
                {job.match}%
              </span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${job.match}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
