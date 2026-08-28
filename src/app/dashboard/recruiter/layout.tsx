import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardRecruiterLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="recruiter">{children}</DashboardShell>;
}