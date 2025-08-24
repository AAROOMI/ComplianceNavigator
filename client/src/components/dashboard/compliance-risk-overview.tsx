import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Vulnerability {
  id: number;
  domain: string;
  subdomain: string;
  status: string;
  impact: string;
  risk: string;
}

interface Assessment {
  id: number;
  domain: string;
  score: number;
  completedAt: string;
}

interface Policy {
  id: number;
  domain: string;
  subdomain?: string;
}

interface ComplianceRiskOverviewProps {
  userId: number;
}

export default function ComplianceRiskOverview({ userId }: ComplianceRiskOverviewProps) {
  // Fetch vulnerabilities
  const { data: vulnerabilities = [] } = useQuery({
    queryKey: ["/api/vulnerabilities", userId],
    queryFn: () => apiRequest<Vulnerability[]>("GET", `/api/vulnerabilities/${userId}`),
  });

  // Fetch assessments
  const { data: assessments = [] } = useQuery({
    queryKey: ["/api/assessments", userId],
    queryFn: () => apiRequest<Assessment[]>("GET", `/api/assessments/${userId}`),
  });

  // Fetch policies
  const { data: policies = [] } = useQuery({
    queryKey: ["/api/policies", userId],
    queryFn: () => apiRequest<Policy[]>("GET", `/api/policies/${userId}`),
  });

  // Calculate compliance metrics
  const totalVulnerabilities = vulnerabilities.length;
  const compliantVulnerabilities = vulnerabilities.filter(v => v.status === "compliant").length;
  const nonCompliantVulnerabilities = vulnerabilities.filter(v => v.status === "non-compliant").length;
  const partiallyCompliantVulnerabilities = vulnerabilities.filter(v => v.status === "partially-compliant").length;

  // Calculate overall compliance score
  const complianceScore = totalVulnerabilities > 0 
    ? Math.round(((compliantVulnerabilities + (partiallyCompliantVulnerabilities * 0.5)) / totalVulnerabilities) * 100)
    : 0;

  // Calculate risk distribution
  const criticalRisks = vulnerabilities.filter(v => v.impact === "critical").length;
  const highRisks = vulnerabilities.filter(v => v.impact === "high").length;
  const mediumRisks = vulnerabilities.filter(v => v.impact === "medium").length;
  const lowRisks = vulnerabilities.filter(v => v.impact === "low").length;

  // Get risk level color
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // Get risk badge variant
  const getRiskBadge = (count: number, type: string) => {
    if (count === 0) return null;
    
    const variants = {
      critical: "destructive",
      high: "secondary",
      medium: "outline",
      low: "default"
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || "default"} className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {count} {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Compliance Score */}
      <div className="text-center space-y-2">
        <div className={`text-5xl font-bold ${getRiskColor(complianceScore)}`}>
          {complianceScore}%
        </div>
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Compliance Score</span>
        </div>
        <Progress value={complianceScore} className="h-3 w-full" />
      </div>

      {/* Compliance Status Breakdown */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{compliantVulnerabilities}</span>
          </div>
          <p className="text-xs text-muted-foreground">Compliant</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-600">{partiallyCompliantVulnerabilities}</span>
          </div>
          <p className="text-xs text-muted-foreground">Partial</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-2xl font-bold text-red-600">{nonCompliantVulnerabilities}</span>
          </div>
          <p className="text-xs text-muted-foreground">Non-Compliant</p>
        </div>
      </div>

      {/* Risk Distribution */}
      {totalVulnerabilities > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Distribution
          </h4>
          <div className="flex flex-wrap gap-2">
            {getRiskBadge(criticalRisks, "critical")}
            {getRiskBadge(highRisks, "high")}
            {getRiskBadge(mediumRisks, "medium")}
            {getRiskBadge(lowRisks, "low")}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{assessments.length}</div>
          <p className="text-xs text-muted-foreground">Assessments</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{policies.length}</div>
          <p className="text-xs text-muted-foreground">Policies</p>
        </div>
      </div>
    </div>
  );
}