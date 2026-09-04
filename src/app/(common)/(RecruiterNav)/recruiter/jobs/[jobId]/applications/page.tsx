import JobApplicationsPage from "@/components/recruiter/jobs/JobApplicationsPage";


interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function Page({
  params,
}: PageProps) {
  const { jobId } = await params;

  return (
    <JobApplicationsPage
      jobId={jobId}
    />
  );
}