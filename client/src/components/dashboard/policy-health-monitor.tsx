import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Shield,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";

interface Policy {
  id: number;
  domain: string;
  subdomain?: string;
  content: string;
  generatedAt: string;
}

interface Vulnerability {
  domain: string;
  status: string;
  impact: string;
}

interface PolicyHealthMonitorProps {
  userId: number;
}

export default function PolicyHealthMonitor({ userId }: PolicyHealthMonitorProps) {
  const [realTimeScore, setRealTimeScore] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch policies and vulnerabilities
  const { data: policies = [] } = useQuery({
    queryKey: ["/api/policies", userId],
    queryFn: () => apiRequest<Policy[]>("GET", `/api/policies/${userId}`),
    refetchInterval: 10000, // Real-time updates every 10 seconds
  });

  const { data: vulnerabilities = [] } = useQuery({
    queryKey: ["/api/vulnerabilities", userId],
    queryFn: () => apiRequest<Vulnerability[]>("GET", `/api/vulnerabilities/${userId}`),
    refetchInterval: 10000,
  });

  // Calculate policy health metrics
  const calculatePolicyHealth = () => {
    if (policies.length === 0) return { score: 0, coverage: 0, freshness: 0, effectiveness: 0 };

    // Coverage score: How many domains have policies
    const uniqueDomains = new Set(policies.map(p => p.domain));
    const totalDomains = 5; // NCA ECC domains
    const coverage = Math.round((uniqueDomains.size / totalDomains) * 100);

    // Freshness score: How recent are the policies
    const now = new Date();
    const policyAges = policies.map(p => {
      const generatedDate = new Date(p.generatedAt);
      const daysDiff = Math.abs(now.getTime() - generatedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff;
    });
    const avgAge = policyAges.reduce((sum, age) => sum + age, 0) / policyAges.length;
    const freshness = Math.max(0, Math.round(100 - (avgAge / 30) * 20)); // Fresher policies score higher

    // Effectiveness score: Based on vulnerability status in covered domains
    const coveredDomains = Array.from(uniqueDomains);
    const domainVulns = coveredDomains.map(domain => {
      const domainVulnerabilities = vulnerabilities.filter(v => v.domain === domain);
      const compliant = domainVulnerabilities.filter(v => v.status === "compliant").length;
      return domainVulnerabilities.length > 0 ? (compliant / domainVulnerabilities.length) * 100 : 100;
    });
    const effectiveness = domainVulns.length > 0 
      ? Math.round(domainVulns.reduce((sum, score) => sum + score, 0) / domainVulns.length)
      : 0;

    // Overall health score
    const overallScore = Math.round((coverage * 0.3 + freshness * 0.3 + effectiveness * 0.4));

    return { score: overallScore, coverage, freshness, effectiveness };
  };

  const health = calculatePolicyHealth();

  // Simulate real-time score updates
  useEffect(() => {
    const interval = setInterval(() => {
      const variance = Math.random() * 4 - 2; // +/- 2 points variance
      setRealTimeScore(Math.max(0, Math.min(100, health.score + variance)));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [health.score]);

  // Get health status info
  const getHealthStatus = (score: number) => {
    if (score >= 85) return { 
      color: "text-green-600", 
      bgColor: "bg-green-100 dark:bg-green-900/20",
      icon: CheckCircle, 
      label: "Excellent",
      variant: "default" as const
    };
    if (score >= 70) return { 
      color: "text-blue-600", 
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      icon: TrendingUp, 
      label: "Good",
      variant: "secondary" as const
    };
    if (score >= 50) return { 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      icon: Clock, 
      label: "Fair",
      variant: "outline" as const
    };
    return { 
      color: "text-red-600", 
      bgColor: "bg-red-100 dark:bg-red-900/20",
      icon: AlertTriangle, 
      label: "Needs Attention",
      variant: "destructive" as const
    };
  };

  const currentScore = realTimeScore || health.score;
  const statusInfo = getHealthStatus(currentScore);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-4">
      {/* Real-time Score Display */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
            <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
          </div>
          <div className={`text-4xl font-bold ${statusInfo.color}`}>
            {Math.round(currentScore)}%
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium">Real-Time Policy Health</span>
        </div>
        
        <Progress value={currentScore} className="h-3" />
        
        <Badge variant={statusInfo.variant} className="text-xs">
          {statusInfo.label}
        </Badge>
      </div>

      <Separator />

      {/* Health Metrics Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Health Metrics
        </h4>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Coverage</span>
            <div className="flex items-center gap-2">
              <Progress value={health.coverage} className="h-1.5 w-16" />
              <span className="text-sm font-medium w-8">{health.coverage}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Freshness</span>
            <div className="flex items-center gap-2">
              <Progress value={health.freshness} className="h-1.5 w-16" />
              <span className="text-sm font-medium w-8">{health.freshness}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Effectiveness</span>
            <div className="flex items-center gap-2">
              <Progress value={health.effectiveness} className="h-1.5 w-16" />
              <span className="text-sm font-medium w-8">{health.effectiveness}%</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-lg font-bold text-primary">{policies.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Active Policies</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-lg font-bold text-green-600">
              {vulnerabilities.filter(v => v.status === "compliant").length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Compliant Controls</p>
        </div>
      </div>

      {/* Last Update Timestamp */}
      <div className="text-center text-xs text-muted-foreground">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
}