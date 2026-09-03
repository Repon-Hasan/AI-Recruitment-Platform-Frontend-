import CandidateRankingPage from "@/components/recruiter/candidate-ranking/CandidateRankingPage";

interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function RankCandidatesPage({
  params,
}: PageProps) {
  const { jobId } = await params;

  return <CandidateRankingPage jobId={jobId} />;
}