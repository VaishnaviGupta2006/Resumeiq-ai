"use client"

import { useState } from "react"
import { weeklyUploads } from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

export function UploadsChart() {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...weeklyUploads.map((d) => d.uploads))
  const total = weeklyUploads.reduce((sum, d) => sum + d.uploads, 0)

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Weekly Resume Uploads
          </h3>
          <p className="text-xs text-muted-foreground">Uploads per day</p>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            {total}
          </span>
          <span className="text-xs text-muted-foreground">this week</span>
        </div>
      </div>

      <div className="mt-6 flex h-48 items-end justify-between gap-2 sm:gap-3">
        {weeklyUploads.map((d, i) => (
          <div
            key={d.day}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="relative flex w-full flex-1 items-end justify-center">
              {hover === i && (
                <div className="absolute -top-1 rounded-md bg-foreground px-2 py-0.5 text-[11px] font-semibold text-background">
                  {d.uploads}
                </div>
              )}
              <div
                className={cn(
                  "w-full max-w-10 rounded-t-lg transition-all duration-300",
                  hover === i ? "bg-primary" : "bg-primary/25",
                )}
                style={{ height: `${(d.uploads / max) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              {d.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
