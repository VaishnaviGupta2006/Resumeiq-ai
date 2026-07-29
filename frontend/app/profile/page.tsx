import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <User className="size-10" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Profile
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">Coming Soon</p>
          <p className="mt-2 max-w-md text-muted-foreground">
            Manage your personal information, preferences, and account settings in one place.
          </p>
          <Link href="/dashboard">
            <Button className="mt-8">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
