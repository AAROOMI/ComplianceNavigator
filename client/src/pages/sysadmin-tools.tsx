import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Monitor, 
  Server, 
  Terminal, 
  Shield, 
  Database, 
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Wand2,
  MessageSquare,
  Archive
} from "lucide-react";
import SysAdminOnboarding from "@/components/ciso/sysadmin-onboarding";
import SysAdminDocumentGenerator from "@/components/sysadmin/policy-generator";
import SysAdminExpertConsultant from "@/components/sysadmin/expert-consultant";
import SysAdminDocumentLibrary from "@/components/sysadmin/document-library";

export default function SysAdminTools() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const systemHealth = {
    cpu: { usage: 45, status: "Normal" },
    memory: { usage: 68, status: "Normal" },
    disk: { usage: 78, status: "Warning" },
    network: { usage: 23, status: "Normal" }
  };

  const serverStatus = [
    { name: "Web Server 01", status: "Online", uptime: "99.9%", lastCheck: "2 min ago" },
    { name: "Database Primary", status: "Online", uptime: "99.8%", lastCheck: "1 min ago" },
    { name: "API Gateway", status: "Online", uptime: "99.7%", lastCheck: "30 sec ago" },
    { name: "Backup Server", status: "Maintenance", uptime: "98.5%", lastCheck: "5 min ago" }
  ];

  const recentLogs = [
    { timestamp: "09:15:32", level: "INFO", message: "Database backup completed successfully", source: "DB-01" },
    { timestamp: "09:12:45", level: "WARN", message: "High disk usage detected on /var/log", source: "WEB-01" },
    { timestamp: "09:10:12", level: "INFO", message: "Security scan completed - no threats found", source: "SEC-01" },
    { timestamp: "09:08:33", level: "ERROR", message: "Failed to connect to external API", source: "API-01" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online": return "text-green-600";
      case "Warning": return "text-yellow-600";
      case "Maintenance": return "text-blue-600";
      case "Offline": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Online": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "Maintenance": return <Clock className="w-4 h-4 text-blue-500" />;
      case "Offline": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "ERROR": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "WARN": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "INFO": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return "text-red-600";
    if (usage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('sysadmin-onboarding-completed', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('sysadmin-onboarding-completed', 'true');
  };

  return (
    <div className="space-y-6" data-testid="sysadmin-tools">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Monitor className="h-8 w-8 text-primary" />
            System Administrator Portal
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-Powered System Administration, Documentation & Expert Support
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => setShowOnboarding(true)}
            variant="outline"
            className="flex items-center gap-2"
            data-testid="button-start-onboarding"
          >
            <Terminal className="h-4 w-4" />
            Admin Tour
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setActiveTab("generator")}
          >
            <Wand2 className="w-4 h-4" />
            Generate Admin Document
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-600" />
                <span className="font-medium">CPU</span>
              </div>
              <span className={`font-bold ${getUsageColor(systemHealth.cpu.usage)}`}>
                {systemHealth.cpu.usage}%
              </span>
            </div>
            <Progress value={systemHealth.cpu.usage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{systemHealth.cpu.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-5 w-5 text-green-600" />
                <span className="font-medium">Memory</span>
              </div>
              <span className={`font-bold ${getUsageColor(systemHealth.memory.usage)}`}>
                {systemHealth.memory.usage}%
              </span>
            </div>
            <Progress value={systemHealth.memory.usage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{systemHealth.memory.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Disk</span>
              </div>
              <span className={`font-bold ${getUsageColor(systemHealth.disk.usage)}`}>
                {systemHealth.disk.usage}%
              </span>
            </div>
            <Progress value={systemHealth.disk.usage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{systemHealth.disk.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Network</span>
              </div>
              <span className={`font-bold ${getUsageColor(systemHealth.network.usage)}`}>
                {systemHealth.network.usage}%
              </span>
            </div>
            <Progress value={systemHealth.network.usage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{systemHealth.network.status}</p>
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
          {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common system administration tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Server className="h-6 w-6" />
              <span className="text-sm">Restart Services</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Database className="h-6 w-6" />
              <span className="text-sm">Backup Database</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm">Security Scan</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Activity className="h-6 w-6" />
              <span className="text-sm">Performance Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Server Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Server Status
          </CardTitle>
          <CardDescription>
            Real-time status of all servers and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serverStatus.map((server, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(server.status)}
                  <div>
                    <p className="font-medium">{server.name}</p>
                    <p className="text-sm text-muted-foreground">Last check: {server.lastCheck}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(server.status)} variant="outline">
                    {server.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">Uptime: {server.uptime}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Recent System Logs
          </CardTitle>
          <CardDescription>
            Latest system events and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLogs.map((log, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg text-sm">
                <span className="text-muted-foreground font-mono">{log.timestamp}</span>
                <Badge className={getLogLevelColor(log.level)} variant="outline">
                  {log.level}
                </Badge>
                <span className="flex-1">{log.message}</span>
                <span className="text-muted-foreground">{log.source}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

        </TabsContent>

        {/* Document Generator Tab */}
        <TabsContent value="generator">
          <SysAdminDocumentGenerator />
        </TabsContent>

        {/* Expert Consultant Tab */}
        <TabsContent value="consultant">
          <SysAdminExpertConsultant />
        </TabsContent>

        {/* Document Library Tab */}
        <TabsContent value="library">
          <SysAdminDocumentLibrary />
        </TabsContent>
      </Tabs>

      {/* System Admin Onboarding */}
      <SysAdminOnboarding
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
}