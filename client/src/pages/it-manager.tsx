import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Server, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Database,
  Network,
  Activity,
  FileText,
  Wand2,
  MessageSquare,
  Archive
} from "lucide-react";
import ITManagerOnboarding from "@/components/ciso/it-manager-onboarding";
import ITDocumentGenerator from "@/components/it-manager/policy-generator";
import ITManagerExpertConsultant from "@/components/it-manager/expert-consultant";
import ITDocumentLibrary from "@/components/it-manager/document-library";

export default function ITManagerPortal() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const systemStats = {
    activeServers: 12,
    pendingUpdates: 5,
    securityAlerts: 3,
    networkHealth: 98
  };

  const recentTasks = [
    { id: 1, title: "Deploy Security Patches", status: "In Progress", priority: "High" },
    { id: 2, title: "Backup Database Systems", status: "Completed", priority: "Medium" },
    { id: 3, title: "Review Access Controls", status: "Pending", priority: "High" },
    { id: 4, title: "Update Firewall Rules", status: "Completed", priority: "Low" }
  ];

  const documentStats = {
    totalDocuments: 16,
    approved: 8,
    inReview: 4,
    draft: 4
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "In Progress": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Pending": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('it-manager-onboarding-completed', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('it-manager-onboarding-completed', 'true');
  };

  return (
    <div className="space-y-6" data-testid="it-manager-portal">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            IT Manager Portal
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-Powered IT Management, Documentation & Expert Consultation
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => setShowOnboarding(true)}
            variant="outline"
            className="flex items-center gap-2"
            data-testid="button-start-onboarding"
          >
            <Activity className="h-4 w-4" />
            Start Tour
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setActiveTab("generator")}
          >
            <Wand2 className="w-4 h-4" />
            Generate Document
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total IT Documents</p>
                <p className="text-2xl font-bold">{documentStats.totalDocuments}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-500">{documentStats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Review</p>
                <p className="text-2xl font-bold text-yellow-500">{documentStats.inReview}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Servers</p>
                <p className="text-2xl font-bold">{systemStats.activeServers}</p>
              </div>
              <Server className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="generator">Document Generator</TabsTrigger>
          <TabsTrigger value="consultant">Expert Consultant</TabsTrigger>
          <TabsTrigger value="library">Document Library</TabsTrigger>
        </TabsList>

        {/* System Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Health Details */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Servers</p>
                    <p className="text-2xl font-bold">{systemStats.activeServers}</p>
                  </div>
                  <Server className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Updates</p>
                    <p className="text-2xl font-bold">{systemStats.pendingUpdates}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Security Alerts</p>
                    <p className="text-2xl font-bold">{systemStats.securityAlerts}</p>
                  </div>
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Network Health</p>
                    <p className="text-2xl font-bold">{systemStats.networkHealth}%</p>
                  </div>
                  <Network className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common IT management tasks and system administration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Database className="h-6 w-6" />
                  <span>Database Backup</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Shield className="h-6 w-6" />
                  <span>Security Scan</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>User Access Review</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Tasks
              </CardTitle>
              <CardDescription>
                Track progress on IT management and security tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">Status: {task.status}</p>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Document Generator Tab */}
        <TabsContent value="generator">
          <ITDocumentGenerator />
        </TabsContent>

        {/* Expert Consultant Tab */}
        <TabsContent value="consultant">
          <ITManagerExpertConsultant />
        </TabsContent>

        {/* Document Library Tab */}
        <TabsContent value="library">
          <ITDocumentLibrary />
        </TabsContent>
      </Tabs>

      {/* IT Manager Onboarding */}
      <ITManagerOnboarding
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
}