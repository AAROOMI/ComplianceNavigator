import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ncaEccDomains } from "@shared/schema";
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";

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
}

interface Policy {
  id: number;
  domain: string;
}

interface NCADomainMatrixProps {
  userId: number;
}

export default function NCADomainMatrix({ userId }: NCADomainMatrixProps) {
  // Fetch data
  const { data: vulnerabilities = [] } = useQuery({
    queryKey: ["/api/vulnerabilities", userId],
    queryFn: () => apiRequest<Vulnerability[]>("GET", `/api/vulnerabilities/${userId}`),
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ["/api/assessments", userId],
    queryFn: () => apiRequest<Assessment[]>("GET", `/api/assessments/${userId}`),
  });

  const { data: policies = [] } = useQuery({
    queryKey: ["/api/policies", userId],
    queryFn: () => apiRequest<Policy[]>("GET", `/api/policies/${userId}`),
  });

  // Calculate domain-specific metrics
  const getDomainMetrics = (domain: string) => {
    const domainVulnerabilities = vulnerabilities.filter(v => v.domain === domain);
    const domainAssessments = assessments.filter(a => a.domain === domain);
    const domainPolicies = policies.filter(p => p.domain === domain);

    const totalVulns = domainVulnerabilities.length;
    const compliantVulns = domainVulnerabilities.filter(v => v.status === "compliant").length;
    const criticalVulns = domainVulnerabilities.filter(v => v.impact === "critical").length;
    
    const complianceScore = totalVulns > 0 ? Math.round((compliantVulns / totalVulns) * 100) : 0;
    const avgAssessmentScore = domainAssessments.length > 0 
      ? Math.round(domainAssessments.reduce((sum, a) => sum + a.score, 0) / domainAssessments.length)
      : 0;

    return {
      complianceScore,
      avgAssessmentScore,
      totalVulnerabilities: totalVulns,
      criticalVulnerabilities: criticalVulns,
      policyCount: domainPolicies.length,
      assessmentCount: domainAssessments.length
    };
  };

  // Get status color and icon
  const getStatusInfo = (score: number) => {
    if (score >= 80) {
      return { 
        color: "bg-green-500", 
        textColor: "text-green-700", 
        icon: CheckCircle,
        label: "Excellent",
        variant: "default" as const
      };
    }
    if (score >= 60) {
      return { 
        color: "bg-yellow-500", 
        textColor: "text-yellow-700", 
        icon: Clock,
        label: "Good",
        variant: "secondary" as const
      };
    }
    if (score >= 40) {
      return { 
        color: "bg-orange-500", 
        textColor: "text-orange-700", 
        icon: TrendingUp,
        label: "Needs Attention",
        variant: "outline" as const
      };
    }
    return { 
      color: "bg-red-500", 
      textColor: "text-red-700", 
      icon: AlertTriangle,
      label: "Critical",
      variant: "destructive" as const
    };
  };

  // Simplify domain names for display
  const getDomainDisplayName = (domain: string) => {
    const nameMap: Record<string, string> = {
      "Governance": "Governance",
      "Cybersecurity Defence": "Defence",
      "Cybersecurity Resilience": "Resilience", 
      "Third Party Cloud Computing Cybersecurity": "Cloud Security",
      "Industrial Control System (ICS)": "ICS"
    };
    return nameMap[domain] || domain;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">NCA ECC Domain Compliance</h3>
      </div>

      <div className="grid gap-3">
        {ncaEccDomains.map((domain) => {
          const metrics = getDomainMetrics(domain);
          const statusInfo = getStatusInfo(metrics.complianceScore);
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={domain} className="p-0 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
                    <h4 className="font-medium text-sm">{getDomainDisplayName(domain)}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusInfo.variant} className="text-xs">
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {metrics.complianceScore}%
                    </Badge>
                  </div>
                </div>

                <Progress value={metrics.complianceScore} className="h-2 mb-3" />

                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-primary">{metrics.totalVulnerabilities}</div>
                    <p className="text-xs text-muted-foreground">Controls</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-red-600">{metrics.criticalVulnerabilities}</div>
                    <p className="text-xs text-muted-foreground">Critical</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-blue-600">{metrics.policyCount}</div>
                    <p className="text-xs text-muted-foreground">Policies</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-green-600">{metrics.assessmentCount}</div>
                    <p className="text-xs text-muted-foreground">Assessed</p>
                  </div>
                </div>

                {metrics.avgAssessmentScore > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Assessment Score</span>
                      <span className={`font-medium ${getStatusInfo(metrics.avgAssessmentScore).textColor}`}>
                        {metrics.avgAssessmentScore}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">Framework Overview</h4>
            <Badge variant="outline" className="text-primary border-primary">
              NCA ECC
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">{ncaEccDomains.length}</div>
              <p className="text-xs text-muted-foreground">Domains</p>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">{vulnerabilities.length}</div>
              <p className="text-xs text-muted-foreground">Total Controls</p>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">
                {vulnerabilities.length > 0 
                  ? Math.round((vulnerabilities.filter(v => v.status === "compliant").length / vulnerabilities.length) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Overall</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}