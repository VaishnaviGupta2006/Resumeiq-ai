export const atsTrend = [
  { month: "Jan", score: 62 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 65 },
  { month: "Apr", score: 74 },
  { month: "May", score: 79 },
  { month: "Jun", score: 83 },
  { month: "Jul", score: 88 },
  { month: "Aug", score: 92 },
]

export const weeklyUploads = [
  { day: "Mon", uploads: 4 },
  { day: "Tue", uploads: 7 },
  { day: "Wed", uploads: 5 },
  { day: "Thu", uploads: 9 },
  { day: "Fri", uploads: 12 },
  { day: "Sat", uploads: 6 },
  { day: "Sun", uploads: 3 },
]

export type Analysis = {
  id: string
  name: string
  role: string
  score: number
  status: "Excellent" | "Good" | "Needs work"
  date: string
}

export const recentAnalyses: Analysis[] = [
  {
    id: "1",
    name: "Senior_Product_Designer.pdf",
    role: "Product Designer",
    score: 92,
    status: "Excellent",
    date: "2h ago",
  },
  {
    id: "2",
    name: "Frontend_Engineer_v3.pdf",
    role: "Frontend Engineer",
    score: 85,
    status: "Good",
    date: "5h ago",
  },
  {
    id: "3",
    name: "Marketing_Lead_2025.docx",
    role: "Marketing Lead",
    score: 78,
    status: "Good",
    date: "Yesterday",
  },
  {
    id: "4",
    name: "Data_Analyst_Resume.pdf",
    role: "Data Analyst",
    score: 64,
    status: "Needs work",
    date: "2 days ago",
  },
  {
    id: "5",
    name: "PM_Resume_Final.pdf",
    role: "Product Manager",
    score: 88,
    status: "Good",
    date: "3 days ago",
  },
]

export type SavedJob = {
  id: string
  title: string
  company: string
  location: string
  match: number
}

export const savedJobs: SavedJob[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    company: "Linear",
    location: "Remote",
    match: 94,
  },
  {
    id: "2",
    title: "Staff Frontend Engineer",
    company: "Vercel",
    location: "San Francisco, CA",
    match: 87,
  },
  {
    id: "3",
    title: "Design Systems Lead",
    company: "Stripe",
    location: "New York, NY",
    match: 81,
  },
  {
    id: "4",
    title: "Product Manager, Growth",
    company: "Notion",
    location: "Remote",
    match: 76,
  },
]
