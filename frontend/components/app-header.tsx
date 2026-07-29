import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4.5" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            ResumeIQ<span className="text-primary"> AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/upload"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Upload
          </Link>
          <Link
            href="/history"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            History
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="lg"
              className="hidden text-muted-foreground sm:inline-flex"
              asChild
            >
              <span>Sign in</span>
            </Button>
          </Link>
          <Link href="/upload">
            <Button
              size="lg"
              className="rounded-full px-4 shadow-sm"
              asChild
            >
              <span>Get started</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
