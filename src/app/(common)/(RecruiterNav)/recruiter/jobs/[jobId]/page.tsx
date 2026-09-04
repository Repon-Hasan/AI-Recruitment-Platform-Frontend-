import JobDetailsPage from "@/components/recruiter/jobs/JobDetailsPage";

interface JobDetailsRouteProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function JobDetailsRoute({
  params,
}: JobDetailsRouteProps) {
  const { jobId } = await params;

  return <JobDetailsPage jobId={jobId} />;
}