import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  Crown,
  Activity,
  Workflow
} from "lucide-react";

interface DocumentMetrics {
  totalDocuments: number;
  pendingApproval: number;
  approved: number;
  implemented: number;
  avgEffectiveness: number;
  avgApprovalTime: number;
  recentActivity: ActivityEvent[];
}

interface ActivityEvent {
  id: string;
  action: string;
  document: string;
  user: string;
  timestamp: string;
}

export default function DocumentLifecycleMetrics() {
  const [metrics, setMetrics] = useState<DocumentMetrics>({
    totalDocuments: 0,
    pendingApproval: 0,
    approved: 0,
    implemented: 0,
    avgEffectiveness: 0,
    avgApprovalTime: 0,
    recentActivity: []
  });

  // Load document metrics from localStorage
  useEffect(() => {
    const loadMetrics = () => {
      const stored = localStorage.getItem('document_lifecycle');
      if (stored) {
        const documents = JSON.parse(stored);
        
        const totalDocuments = documents.length;
        const pendingApproval = documents.filter((d: any) => d.status === 'pending_approval').length;
        const approved = documents.filter((d: any) => d.status === 'approved').length;
        const implemented = documents.filter((d: any) => d.status === 'implemented').length;
        
        const effectivenessList = documents
          .filter((d: any) => d.effectivenessScore)
          .map((d: any) => d.effectivenessScore);
        
        const avgEffectiveness = effectivenessList.length > 0 
          ? Math.round(effectivenessList.reduce((acc: number, score: number) => acc + score, 0) / effectivenessList.length)
          : 0;

        // Calculate recent activity from audit trails
        const recentActivity: ActivityEvent[] = [];
        documents.forEach((doc: any) => {
          if (doc.auditTrail && doc.auditTrail.length > 0) {
            doc.auditTrail.slice(-3).forEach((event: any) => {
              recentActivity.push({
                id: event.id,
                action: event.action,
                document: doc.title,
                user: event.user,
                timestamp: event.timestamp
              });
            });
          }
        });

        // Sort by timestamp and take latest 5
        recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const recentTop5 = recentActivity.slice(0, 5);

        setMetrics({
          totalDocuments,
          pendingApproval,
          approved,
          implemented,
          avgEffectiveness,
          avgApprovalTime: 2.3, // Simulated average approval time in days
          recentActivity: recentTop5
        });
      }
    };

    loadMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Document Created': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'Submitted for Approval': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Document Approved': return <Crown className="w-4 h-4 text-purple-500" />;
      case 'Implementation Started': return <Target className="w-4 h-4 text-green-500" />;
      case 'Document Downloaded': return <Activity className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Document Created': return 'text-blue-600';
      case 'Submitted for Approval': return 'text-yellow-600';
      case 'Document Approved': return 'text-purple-600';
      case 'Implementation Started': return 'text-green-600';
      case 'Document Downloaded': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const implementationRate = metrics.totalDocuments > 0 
    ? Math.round((metrics.implemented / metrics.totalDocuments) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{metrics.totalDocuments}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{metrics.pendingApproval}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Implemented</p>
                <p className="text-2xl font-bold text-green-600">{metrics.implemented}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Effectiveness</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.avgEffectiveness}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Document Lifecycle Progress
          </CardTitle>
          <CardDescription>
            Track document progression through approval and implementation phases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Implementation Rate</span>
              <span className="text-sm text-muted-foreground">{implementationRate}%</span>
            </div>
            <Progress value={implementationRate} className="h-3" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-500">{metrics.totalDocuments - metrics.pendingApproval - metrics.approved - metrics.implemented}</div>
                <div className="text-xs text-muted-foreground">Draft</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">{metrics.pendingApproval}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">{metrics.approved}</div>
                <div className="text-xs text-muted-foreground">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{metrics.implemented}</div>
                <div className="text-xs text-muted-foreground">Implemented</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Document Activity
          </CardTitle>
          <CardDescription>
            Latest actions in the document lifecycle management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentActivity.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No recent activity to display
              </div>
            ) : (
              metrics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getActionIcon(activity.action)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getActionColor(activity.action)}`}>
                        {activity.action}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {activity.user}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.document}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Document Lifecycle KPIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.avgApprovalTime}</div>
              <div className="text-sm text-muted-foreground">Avg Approval Time (days)</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{metrics.avgEffectiveness}%</div>
              <div className="text-sm text-muted-foreground">Avg Control Effectiveness</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{implementationRate}%</div>
              <div className="text-sm text-muted-foreground">Implementation Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}