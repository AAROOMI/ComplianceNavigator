import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  FileText, 
  Database, 
  AlertTriangle, 
  Users, 
  Bot,
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";

interface RiskRegisterEntry {
  id: number;
  category: string;
  riskLevel: string;
  isActive: boolean;
}

interface ApplicationMetricsProps {
  userId: number;
}

export default function ApplicationMetrics({ userId }: ApplicationMetricsProps) {
  // Fetch risk register data
  const { data: riskRegister = [] } = useQuery({
    queryKey: ["/api/risk-register"],
    queryFn: () => apiRequest<RiskRegisterEntry[]>("GET", "/api/risk-register"),
  });

  // Fetch vulnerabilities for recent activity
  const { data: vulnerabilities = [] } = useQuery({
    queryKey: ["/api/vulnerabilities", userId],
    queryFn: () => apiRequest<any[]>("GET", `/api/vulnerabilities/${userId}`),
  });

  // Fetch policies
  const { data: policies = [] } = useQuery({
    queryKey: ["/api/policies", userId],
    queryFn: () => apiRequest<any[]>("GET", `/api/policies/${userId}`),
  });

  // Calculate application metrics
  const totalRisks = riskRegister.filter(r => r.isActive).length;
  const criticalRisks = riskRegister.filter(r => r.isActive && r.riskLevel === "Critical").length;
  const highRisks = riskRegister.filter(r => r.isActive && r.riskLevel === "High").length;
  
  const riskCoverage = vulnerabilities.length > 0 && totalRisks > 0 
    ? Math.round((vulnerabilities.length / totalRisks) * 100) 
    : 0;

  const applicationFeatures = [
    {
      name: "Risk Register",
      icon: Database,
      count: totalRisks,
      status: totalRisks > 0 ? "active" : "inactive",
      description: "Built-in cybersecurity risks",
      progress: Math.min((totalRisks / 50) * 100, 100) // Assume 50 is target
    },
    {
      name: "Policy Management",
      icon: FileText,
      count: policies.length,
      status: policies.length > 0 ? "active" : "inactive", 
      description: "Generated security policies",
      progress: Math.min((policies.length / 20) * 100, 100) // Assume 20 is target
    },
    {
      name: "Vulnerability Tracking",
      icon: AlertTriangle,
      count: vulnerabilities.length,
      status: vulnerabilities.length > 0 ? "active" : "inactive",
      description: "Identified security gaps",
      progress: Math.min((vulnerabilities.length / 30) * 100, 100) // Assume 30 is target
    },
    {
      name: "AI Assistant",
      icon: Bot,
      count: 1,
      status: "active",
      description: "Compliance guidance",
      progress: 100
    }
  ];

  const getStatusInfo = (status: string, count: number) => {
    if (status === "active" && count > 0) {
      return { 
        color: "text-green-600", 
        bgColor: "bg-green-100 dark:bg-green-900/20",
        icon: CheckCircle,
        variant: "default" as const
      };
    }
    if (status === "active") {
      return { 
        color: "text-blue-600", 
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
        icon: TrendingUp,
        variant: "secondary" as const
      };
    }
    return { 
      color: "text-gray-500", 
      bgColor: "bg-gray-100 dark:bg-gray-900/20",
      icon: Clock,
      variant: "outline" as const
    };
  };

  return (
    <div className="space-y-6">
      {/* Application Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Database className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{totalRisks}</span>
            </div>
            <p className="text-sm text-muted-foreground">Risk Library</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{riskCoverage}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Level Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Critical Risks</span>
            <Badge variant="destructive">{criticalRisks}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">High Risks</span>
            <Badge variant="secondary">{highRisks}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Active</span>
            <Badge variant="outline">{totalRisks}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Application Features */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Platform Features
        </h4>
        
        {applicationFeatures.map((feature) => {
          const statusInfo = getStatusInfo(feature.status, feature.count);
          const FeatureIcon = feature.icon;
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={feature.name} className="p-0">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${statusInfo.bgColor}`}>
                      <FeatureIcon className={`w-4 h-4 ${statusInfo.color}`} />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium">{feature.name}</h5>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">{feature.count}</span>
                    <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                  </div>
                </div>
                
                <Progress value={feature.progress} className="h-1.5" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-medium">Platform Status</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div>
              <div className="font-medium text-primary">Multi-Role</div>
              <div className="text-muted-foreground">Policy Management</div>
            </div>
            <div>
              <div className="font-medium text-primary">AI-Powered</div>
              <div className="text-muted-foreground">Compliance Assistant</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}