import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";


export const metadata: Metadata = {
  title: {
    default: "Recruiter Dashboard | HireAI",
    template: "%s | HireAI",
  },
  description: "HireAI recruiter workspace",
};

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell role="recruiter">
      {children}
    </DashboardShell>
  );
}