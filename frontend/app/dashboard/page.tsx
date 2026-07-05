"use client"

import { useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopNav } from "@/components/dashboard/top-nav"
import { StatCards } from "@/components/dashboard/stat-cards"
import { AtsChart } from "@/components/dashboard/ats-chart"
import { UploadsChart } from "@/components/dashboard/uploads-chart"
import { RecentAnalyses } from "@/components/dashboard/recent-analyses"
import { SavedJobs } from "@/components/dashboard/saved-jobs"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Upload } from "lucide-react"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-balance text-foreground">
                Welcome back, Alex
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Here&apos;s how your resumes are performing today.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <Upload className="size-4" />
              Upload Resume
            </Link>
          </div>

          <StatCards />

          {/* Charts */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <AtsChart />
            <UploadsChart />
          </div>

          {/* Sections */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RecentAnalyses />
            </div>
            <div className="space-y-4">
              <QuickActions />
              <SavedJobs />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
