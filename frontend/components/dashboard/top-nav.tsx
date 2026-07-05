"use client"

import { Bell, Menu, Search } from "lucide-react"

export function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search resumes, jobs, or analyses..."
          className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/15"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <button
          className="relative rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-background" />
        </button>

        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card py-1.5 pl-1.5 pr-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
            AK
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold text-foreground">Alex Kim</p>
            <p className="text-[11px] text-muted-foreground">Pro plan</p>
          </div>
        </div>
      </div>
    </header>
  )
}
