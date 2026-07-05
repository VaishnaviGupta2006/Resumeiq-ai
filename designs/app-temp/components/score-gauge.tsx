export function ScoreGauge({ score }: { score: number }) {
  const radius = 76
  const stroke = 12
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="-rotate-90"
        role="img"
        aria-label={`Overall resume score: ${clamped} out of 100`}
      >
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tracking-tight text-foreground tabular-nums">
          {clamped}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          out of 100
        </span>
      </div>
    </div>
  )
}
