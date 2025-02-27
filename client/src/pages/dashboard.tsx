import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ComplianceScore from "@/components/dashboard/compliance-score";
import DomainScores from "@/components/dashboard/domain-scores";
import { Shield, Bot } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/assistant">
            <Button variant="outline" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Assistant
            </Button>
          </Link>
          <Link href="/nca-ecc">
            <Button className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              NCA ECC Framework
            </Button>
          </Link>
        </div>
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