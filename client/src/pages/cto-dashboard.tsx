import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  TrendingUp, 
  Target, 
  Users, 
  Code, 
  GitBranch,
  BarChart,
  Lightbulb,
  Clock,
  CheckCircle
} from "lucide-react";
import CTOOnboarding from "@/components/ciso/cto-onboarding";

export default function CTODashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const metrics = {
    activeProjects: 8,
    teamMembers: 24,
    deploymentsThisMonth: 12,
    systemUptime: 99.8
  };

  const strategicInitiatives = [
    { id: 1, title: "Cloud Migration Strategy", progress: 75, status: "On Track" },
    { id: 2, title: "AI/ML Integration", progress: 40, status: "In Progress" },
    { id: 3, title: "Security Architecture Redesign", progress: 90, status: "Nearly Complete" },
    { id: 4, title: "DevOps Transformation", progress: 60, status: "On Track" }
  ];

  const technologyStack = [
    { name: "Frontend", technologies: ["React", "TypeScript", "Tailwind CSS"] },
    { name: "Backend", technologies: ["Node.js", "Express", "PostgreSQL"] },
    { name: "Infrastructure", technologies: ["AWS", "Docker", "Kubernetes"] },
    { name: "Security", technologies: ["OAuth", "JWT", "SSL/TLS"] }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "In Progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Nearly Complete": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('cto-onboarding-completed', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('cto-onboarding-completed', 'true');
  };

  return (
    <div className="space-y-6" data-testid="cto-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Rocket className="h-8 w-8 text-primary" />
            CTO Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Strategic technology overview and innovation management
          </p>
        </div>
        
        <Button
          onClick={() => setShowOnboarding(true)}
          variant="outline"
          className="flex items-center gap-2"
          data-testid="button-start-onboarding"
        >
          <Lightbulb className="h-4 w-4" />
          Strategic Tour
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{metrics.activeProjects}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">{metrics.teamMembers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deployments</p>
                <p className="text-2xl font-bold">{metrics.deploymentsThisMonth}</p>
              </div>
              <GitBranch className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">{metrics.systemUptime}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Strategic Initiatives
          </CardTitle>
          <CardDescription>
            Key technology initiatives and their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategicInitiatives.map((initiative) => (
              <div key={initiative.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{initiative.title}</p>
                      <p className="text-sm text-muted-foreground">{initiative.progress}% Complete</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(initiative.status)}>
                    {initiative.status}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(initiative.progress)}`}
                    style={{ width: `${initiative.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Technology Stack
          </CardTitle>
          <CardDescription>
            Current technology stack and infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {technologyStack.map((category) => (
              <div key={category.name} className="space-y-3">
                <h4 className="font-semibold text-lg">{category.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Innovation Labs */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Innovation Pipeline
            </CardTitle>
            <CardDescription>
              Emerging technologies and R&D projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">AI-Powered Compliance Assistant</p>
                  <p className="text-sm text-muted-foreground">Research Phase</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Blockchain Integration</p>
                  <p className="text-sm text-muted-foreground">Evaluation Phase</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Target className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Zero-Trust Architecture</p>
                  <p className="text-sm text-muted-foreground">Planning Phase</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              System performance and optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">API Response Time</span>
                <span className="text-sm text-green-600">85ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Database Query Performance</span>
                <span className="text-sm text-green-600">12ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Page Load Speed</span>
                <span className="text-sm text-green-600">1.2s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm text-green-600">0.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTO Onboarding */}
      <CTOOnboarding
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
}