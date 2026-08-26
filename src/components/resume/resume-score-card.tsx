import { FileCheck2, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";

const resumeScore = 86;

export function ResumeScoreCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Resume score</CardTitle>
            <CardDescription>
              How well your resume matches current opportunities.
            </CardDescription>
          </div>
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <FileCheck2 className="size-5" aria-hidden="true" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-tight">
            {resumeScore}%
          </span>
          <span className="pb-1 text-sm text-muted-foreground">Excellent</span>
        </div>

        <Progress value={resumeScore} aria-label={`Resume score: ${resumeScore}%`}>
          <div className="flex w-full items-center">
            <ProgressLabel className="sr-only">Resume score</ProgressLabel>
            <ProgressValue className="sr-only" />
          </div>
        </Progress>

        <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p>Add measurable achievements to improve your score.</p>
        </div>
      </CardContent>
    </Card>
  );
}
