import { DashboardShell } from "@/components/layout/dashboard-shell";


export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell role="candidate">
      {children}
    </DashboardShell>
  );
}