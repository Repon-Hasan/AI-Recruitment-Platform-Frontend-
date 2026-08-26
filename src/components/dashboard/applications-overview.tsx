import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const applications = [
  { label: "Applied", value: 12, color: "bg-primary" },
  { label: "Interview", value: 3, color: "bg-blue-500" },
  { label: "Offer", value: 1, color: "bg-emerald-500" },
];

export function ApplicationsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications overview</CardTitle>
        <CardDescription>Your application activity this month.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        {applications.map((application) => (
          <div key={application.label} className="rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`size-2 rounded-full ${application.color}`} aria-hidden="true" />
              {application.label}
            </div>
            <p className="mt-2 text-2xl font-semibold">{application.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
