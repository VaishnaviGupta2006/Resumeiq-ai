"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface UploadsChartProps {
  data?: Array<{ day: string; uploads: number }>
}

export function UploadsChart({ data }: UploadsChartProps) {
  const [hover, setHover] = useState<number | null>(null)

  // Use mock data if no data provided (for now)
  const chartData = data || [
    { day: 'Mon', uploads: 3 },
    { day: 'Tue', uploads: 5 },
    { day: 'Wed', uploads: 2 },
    { day: 'Thu', uploads: 4 },
    { day: 'Fri', uploads: 6 },
    { day: 'Sat', uploads: 1 },
    { day: 'Sun', uploads: 0 },
  ]

  const validData = chartData.filter(d => d.uploads >= 0)
  const max = validData.length > 0 ? Math.max(...validData.map((d) => d.uploads)) : 1
  const total = validData.reduce((sum, d) => sum + d.uploads, 0)

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

      {validData.length === 0 ? (
        <div className="mt-6 flex h-48 items-center justify-center text-sm text-muted-foreground">
          No data available
        </div>
      ) : (
        <div className="mt-6 flex h-48 items-end justify-between gap-2 sm:gap-3">
          {chartData.map((d, i) => {
            const height = max > 0 ? (d.uploads / max) * 100 : 0
            const safeHeight = isNaN(height) ? 0 : Math.max(0, Math.min(100, height))
            
            return (
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
                    style={{ height: `${safeHeight}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {d.day}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
