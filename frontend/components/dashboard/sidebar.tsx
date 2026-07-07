"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  Upload,
  History,
  Target,
  FileText,
  User,
  Settings,
  Sparkles,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Upload Resume", icon: Upload, href: "/upload" },
  { label: "Resume History", icon: History, href: "/history" },
  { label: "Job Match", icon: Target, href: "/dashboard" },
  { label: "Cover Letter Generator", icon: FileText, href: "/dashboard" },
  { label: "Profile", icon: User, href: "/dashboard" },
  { label: "Settings", icon: Settings, href: "/dashboard" },
]

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-sidebar-foreground">
                ResumeIQ
              </p>
              <p className="text-xs text-muted-foreground">AI Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
              aria-current={item.active ? "page" : undefined}
            >
              <item.icon className="size-[18px] shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3">
          <div className="rounded-2xl border border-sidebar-border bg-gradient-to-b from-accent to-card p-4">
            <p className="text-sm font-semibold text-sidebar-foreground">
              Upgrade to Pro
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Unlimited analyses, priority AI, and advanced ATS insights.
            </p>
            <button className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              Upgrade now
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
