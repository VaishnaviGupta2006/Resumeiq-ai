"use client"

import { useId, useState } from "react"
import { atsTrend } from "@/lib/dashboard-data"

const W = 640
const H = 240
const PAD_X = 32
const PAD_Y = 28

export function AtsChart() {
  const gradientId = useId()
  const [hover, setHover] = useState<number | null>(null)

  const values = atsTrend.map((d) => d.score)
  const min = 50
  const max = 100
  const stepX = (W - PAD_X * 2) / (atsTrend.length - 1)

  const x = (i: number) => PAD_X + i * stepX
  const y = (v: number) => PAD_Y + (1 - (v - min) / (max - min)) * (H - PAD_Y * 2)

  const linePath = atsTrend
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.score)}`)
    .join(" ")
  const areaPath = `${linePath} L ${x(atsTrend.length - 1)} ${H - PAD_Y} L ${x(0)} ${H - PAD_Y} Z`

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            ATS Score Improvement
          </h3>
          <p className="text-xs text-muted-foreground">
            Average score over the last 8 months
          </p>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            {values[values.length - 1]}
          </span>
          <span className="text-xs font-medium text-primary">
            +{values[values.length - 1] - values[0]} pts
          </span>
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

          {atsTrend.map((d, i) => (
            <g key={d.month}>
              <text
                x={x(i)}
                y={H - 6}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={11}
              >
                {d.month}
              </text>
              {hover === i && (
                <line
                  x1={x(i)}
                  x2={x(i)}
                  y1={PAD_Y}
                  y2={H - PAD_Y}
                  stroke="var(--primary)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              )}
              <circle
                cx={x(i)}
                cy={y(d.score)}
                r={hover === i ? 6 : 3.5}
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth={2.5}
              />
              {hover === i && (
                <g>
                  <rect
                    x={x(i) - 22}
                    y={y(d.score) - 34}
                    width={44}
                    height={22}
                    rx={6}
                    fill="var(--foreground)"
                  />
                  <text
                    x={x(i)}
                    y={y(d.score) - 19}
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
                x={x(i) - stepX / 2}
                y={0}
                width={stepX}
                height={H}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
