'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  UploadCloud,
  X,
  CheckCircle2,
  Loader2,
  Shield,
  Zap,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Stage = 'idle' | 'ready' | 'analyzing'

const highlights = [
  {
    icon: Zap,
    title: 'Instant scoring',
    description: 'Get an ATS compatibility score in seconds.',
  },
  {
    icon: Target,
    title: 'Tailored insights',
    description: 'Role-specific feedback on every section.',
  },
  {
    icon: Shield,
    title: 'Private & secure',
    description: 'Your resume is never shared or stored.',
  },
]

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ResumeUpload() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [stage, setStage] = useState<Stage>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [role, setRole] = useState('Senior Product Designer')

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    setFile(files[0])
    setStage('ready')
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const startAnalysis = useCallback(() => {
    setStage('analyzing')
    setTimeout(() => router.push('/analysis'), 2200)
  }, [router])

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      {/* Upload panel */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)] sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Upload your resume
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            PDF, DOCX or TXT up to 10 MB. We&apos;ll do the rest.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-accent'
              : 'border-border bg-muted/40 hover:bg-muted/70'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UploadCloud className="size-7" />
          </span>
          <p className="text-[15px] font-medium text-foreground">
            Drag &amp; drop your resume here
          </p>
          <p className="mt-1 text-sm text-muted-foreground">or</p>
          <Button
            size="lg"
            variant="outline"
            className="mt-3 rounded-full px-5"
            onClick={() => inputRef.current?.click()}
          >
            Browse files
          </Button>
        </div>

        {/* Selected file */}
        {file && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
              <FileText className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatSize(file.size)} · Ready to analyze
              </p>
            </div>
            {stage === 'analyzing' ? (
              <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
            ) : (
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => {
                  setFile(null)
                  setStage('idle')
                }}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        )}

        {/* Target role */}
        <div className="mt-6">
          <label
            htmlFor="role"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Target role{' '}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Product Designer"
            className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
        </div>

        {/* Action */}
        <Button
          size="lg"
          className="mt-6 h-12 w-full rounded-full text-[15px] shadow-sm"
          disabled={stage === 'idle' || stage === 'analyzing'}
          onClick={startAnalysis}
        >
          {stage === 'analyzing' ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing your resume…
            </>
          ) : (
            <>
              <Zap className="size-4" />
              Analyze with AI
            </>
          )}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-chart-3" />
          No account required · Results in under 30 seconds
        </p>
      </div>

      {/* Info side */}
      <div className="flex flex-col gap-4">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <item.icon className="size-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-primary/20 bg-accent/60 p-5">
          <p className="text-sm leading-relaxed text-accent-foreground">
            <span className="font-semibold">Trusted by 240,000+ job seekers.</span>{' '}
            Our AI benchmarks your resume against thousands of successful hires in
            your field.
          </p>
        </div>
      </div>
    </div>
  )
}
