import JobEditPage from "@/components/recruiter/jobs/JobEditPage";

interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function Page({
  params,
}: PageProps) {
  const { jobId } = await params;

  return <JobEditPage jobId={jobId} />;
}