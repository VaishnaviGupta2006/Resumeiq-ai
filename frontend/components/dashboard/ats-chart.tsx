"use client"

import { useId, useState } from "react"

interface AtsChartProps {
  data: Array<{ date: string | null; score: number }>
}

const W = 640
const H = 240
const PAD_X = 32
const PAD_Y = 28

export function AtsChart({ data }: AtsChartProps) {
  const gradientId = useId()
  const [hover, setHover] = useState<number | null>(null)

  // Format and validate data for chart
  const chartData = data
    .map((d) => ({
      month: d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short' }) : 'N/A',
      score: typeof d.score === 'number' && !isNaN(d.score) ? d.score : 0,
    }))
    .filter(d => d.score >= 0)

  // If no data, show empty state
  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            ATS Score Trend
          </h3>
          <p className="text-xs text-muted-foreground">
            Average score over the last 30 days
          </p>
        </div>
        <div className="mt-4 flex h-56 items-center justify-center text-sm text-muted-foreground">
          No data available
        </div>
      </div>
    )
  }

  const values = chartData.map((d) => isNaN(d.score) ? 0 : d.score)
  const min = 50
  const max = 100
  const stepX = chartData.length > 1 ? (W - PAD_X * 2) / (chartData.length - 1) : 0

  const x = (i: number) => PAD_X + i * stepX
  const y = (v: number) => {
    const safeScore = isNaN(v) ? 0 : Math.max(0, Math.min(100, v))
    return PAD_Y + (1 - (safeScore - min) / (max - min)) * (H - PAD_Y * 2)
  }

  const linePath = chartData
    .map((d, i) => {
      const xPos = isNaN(x(i)) ? PAD_X : x(i)
      const yPos = isNaN(y(d.score)) ? PAD_Y : y(d.score)
      return `${i === 0 ? "M" : "L"} ${xPos} ${yPos}`
    })
    .join(" ")
  const areaPath = `${linePath} L ${x(chartData.length - 1)} ${H - PAD_Y} L ${x(0)} ${H - PAD_Y} Z`

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            ATS Score Trend
          </h3>
          <p className="text-xs text-muted-foreground">
            Average score over the last 30 days
          </p>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            {values[values.length - 1]}
          </span>
          {values.length > 1 && (
            <span className="text-xs font-medium text-primary">
              {values[values.length - 1] - values[0] > 0 ? '+' : ''}
              {values[values.length - 1] - values[0]} pts
            </span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-56 w-full"
          role="img"
          aria-label="Line chart of ATS score improvement over time"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={PAD_X}
              x2={W - PAD_X}
              y1={PAD_Y + t * (H - PAD_Y * 2)}
              y2={PAD_Y + t * (H - PAD_Y * 2)}
              stroke="var(--border)"
              strokeWidth={1}
            />
          ))}

          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chartData.map((d, i) => {
            const xPos = isNaN(x(i)) ? PAD_X : x(i)
            const yPos = isNaN(y(d.score)) ? PAD_Y : y(d.score)
            
            return (
              <g key={`${d.month}-${i}`}>
                <text
                  x={xPos}
                  y={H - 6}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize={11}
                >
                  {d.month}
                </text>
                {hover === i && (
                  <line
                    x1={xPos}
                    x2={xPos}
                    y1={PAD_Y}
                    y2={H - PAD_Y}
                    stroke="var(--primary)"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                )}
                <circle
                  cx={xPos}
                  cy={yPos}
                  r={hover === i ? 6 : 3.5}
                  fill="var(--card)"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                />
                {hover === i && (
                  <g>
                    <rect
                      x={xPos - 22}
                      y={yPos - 34}
                      width={44}
                      height={22}
                      rx={6}
                      fill="var(--foreground)"
                    />
                    <text
                      x={xPos}
                      y={yPos - 19}
                      textAnchor="middle"
                      fill="var(--background)"
                      fontSize={11}
                      fontWeight={600}
                    >
                      {d.score}
                    </text>
                  </g>
                )}
                <rect
                  x={xPos - stepX / 2}
                  y={0}
                  width={stepX}
                  height={H}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
