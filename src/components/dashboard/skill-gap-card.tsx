import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const skills = [
  { name: "TypeScript", progress: 82 },
  { name: "System design", progress: 64 },
  { name: "Cloud architecture", progress: 48 },
];

export function SkillGapCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill gaps</CardTitle>
        <CardDescription>Focus on these skills to improve your matches.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{skill.name}</span>
              <span className="text-muted-foreground">{skill.progress}%</span>
            </div>
            <Progress value={skill.progress} aria-label={`${skill.name}: ${skill.progress}%`} />
          </div>
        ))}
        <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          View learning plan <ArrowUpRight className="size-4" aria-hidden="true" />
        </button>
      </CardContent>
    </Card>
  );
}
