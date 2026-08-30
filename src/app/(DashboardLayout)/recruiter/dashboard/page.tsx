import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RecruiterDashboard } from "@/features/recruiter/recruiter-workspace";

export default function RecruiterDashboardPage() {
  return (
    <DashboardShell role="recruiter">
      <RecruiterDashboard />
    </DashboardShell>
  );
}