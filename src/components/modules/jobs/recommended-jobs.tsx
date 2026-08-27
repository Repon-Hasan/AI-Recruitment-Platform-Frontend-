import { ArrowUpRight, MapPin } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const jobs = [
  { title: "Senior Frontend Engineer", company: "Northstar Labs", location: "Remote", match: "94% match" },
  { title: "Product Engineer", company: "Vertex Systems", location: "New York, NY", match: "89% match" },
  { title: "Full-stack Developer", company: "Brightside", location: "Remote", match: "86% match" },
];

export function RecommendedJobs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended jobs</CardTitle>
        <CardDescription>Roles selected for your experience and skills.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.map((job) => (
          <div key={job.title} className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{job.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" aria-hidden="true" /> {job.location}
              </p>
            </div>
            <span className="shrink-0 text-xs font-medium text-emerald-600">{job.match}</span>
          </div>
        ))}
        <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Browse all jobs <ArrowUpRight className="size-4" aria-hidden="true" />
        </button>
      </CardContent>
    </Card>
  );
}
