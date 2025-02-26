import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComplianceScore from "@/components/dashboard/compliance-score";
import DomainScores from "@/components/dashboard/domain-scores";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplianceScore />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Domain Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <DomainScores />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
