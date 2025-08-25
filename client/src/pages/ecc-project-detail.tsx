import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { InteractiveTrainingModule } from "@/components/ecc/interactive-training";
import { GovernanceSetup } from "@/components/ecc/governance-setup";
import { 
  Shield, 
  ShieldCheck, 
  Play, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  Target,
  BookOpen,
  Brain,
  Gamepad2,
  Award,
  Download,
  Plus,
  Settings,
  Eye,
  Edit,
  ArrowLeft,
  Calendar,
  Building,
  Activity,
  Zap
} from "lucide-react";

interface EccProject {
  id: number;
  organizationName: string;
  organizationSize: string;
  organizationScope: string;
  projectName: string;
  description?: string;
  status: string;
  currentStep: number;
  overallComplianceScore: number;
  createdAt: string;
  updatedAt: string;
}

interface GapAssessment {
  id: number;
  controlId: string;
  domain: string;
  subdomain: string;
  controlDescription: string;
  complianceStatus: 'compliant' | 'partially-compliant' | 'non-compliant' | 'not-applicable';
  evidenceProvided?: string;
  comments?: string;
}

interface RiskAssessment {
  id: number;
  gapAssessmentId: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  likelihood: string;
  impact: string;
  businessImpact: string;
  riskDescription: string;
  currentControls?: string;
  recommendedActions: string;
}

interface RoadmapTask {
  id: number;
  controlId: string;
  taskTitle: string;
  taskDescription: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo?: number;
  department?: string;
  estimatedEffort?: string;
  targetDate?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  progress: number;
}

const workflowSteps = [
  { id: 1, title: "Foundation & Governance", description: "AO engagement, cybersecurity function, steering committee" },
  { id: 2, title: "Gap Assessment", description: "114 ECC controls evaluated" },
  { id: 3, title: "Risk Assessment", description: "Risks identified and analyzed" },
  { id: 4, title: "Core Policies & Roles", description: "Cybersecurity strategy and core policies developed" },
  { id: 5, title: "Technical Defense", description: "IAM, system hardening, data protection implemented" },
  { id: 6, title: "Monitoring & Response", description: "SIEM, vulnerability management, incident response active" },
  { id: 7, title: "Awareness Training", description: "Interactive security education deployed" },
  { id: 8, title: "Third-Party & ICS", description: "Vendor contracts, cloud compliance, ICS security" },
  { id: 9, title: "Continuous Review", description: "Annual reviews and steering committee oversight" },
  { id: 10, title: "Independent Audit", description: "External audit and NCA compliance validation" }
];

const mockGapAssessments: GapAssessment[] = [
  {
    id: 1,
    controlId: "ECC-1-1-1",
    domain: "Governance",
    subdomain: "Cybersecurity Strategy",
    controlDescription: "Establish cybersecurity strategy",
    complianceStatus: "compliant",
    evidenceProvided: "Cybersecurity strategy document approved by board"
  },
  {
    id: 2,
    controlId: "ECC-1-1-2",
    domain: "Governance",
    subdomain: "Cybersecurity Strategy",
    controlDescription: "Align with business objectives",
    complianceStatus: "partially-compliant",
    evidenceProvided: "Strategy alignment documented but needs executive review"
  },
  {
    id: 3,
    controlId: "ECC-2-1-1",
    domain: "Cybersecurity Defence",
    subdomain: "Access Control",
    controlDescription: "Access control policy",
    complianceStatus: "non-compliant",
    comments: "Access control policy missing or outdated"
  }
];

const mockRiskAssessments: RiskAssessment[] = [
  {
    id: 1,
    gapAssessmentId: 3,
    riskLevel: "high",
    likelihood: "high",
    impact: "high",
    businessImpact: "Unauthorized access to sensitive systems and data",
    riskDescription: "Lack of proper access control policy increases risk of data breaches",
    recommendedActions: "Develop comprehensive access control policy, implement MFA, conduct access reviews"
  }
];

const mockRoadmapTasks: RoadmapTask[] = [
  {
    id: 1,
    controlId: "ECC-2-1-1",
    taskTitle: "Develop Access Control Policy",
    taskDescription: "Create comprehensive access control policy covering user access management, privilege management, and access reviews",
    priority: "high",
    assignedTo: 1,
    department: "IT Security",
    estimatedEffort: "2-3 weeks",
    targetDate: "2024-02-15",
    status: "in-progress",
    progress: 65
  },
  {
    id: 2,
    controlId: "ECC-2-1-2",
    taskTitle: "Implement Multi-Factor Authentication",
    taskDescription: "Deploy MFA across all critical systems and applications",
    priority: "critical",
    assignedTo: 2,
    department: "IT Operations",
    estimatedEffort: "3-4 weeks",
    targetDate: "2024-02-28",
    status: "todo",
    progress: 0
  }
];

const trainingModules = [
  {
    id: 1,
    name: "Phishing Simulator",
    type: "phishing-simulator" as const,
    description: "Interactive phishing email simulation with instant feedback",
    difficulty: "beginner" as const,
    estimatedTime: 15,
    passingScore: 80,
    content: {}
  },
  {
    id: 2,
    name: "Secure Browsing Game",
    type: "secure-browsing-game" as const,
    description: "Gamified web navigation avoiding malicious sites",
    difficulty: "intermediate" as const,
    estimatedTime: 20,
    passingScore: 85,
    content: {}
  }
];

export default function EccProjectDetail() {
  const [match, params] = useRoute("/ecc-navigator/project/:id");
  const [project, setProject] = useState<EccProject | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [gapAssessments, setGapAssessments] = useState<GapAssessment[]>(mockGapAssessments);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>(mockRiskAssessments);
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>(mockRoadmapTasks);
  const [showGovernanceSetup, setShowGovernanceSetup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (params?.id) {
      // Mock project data - in real app, fetch from API
      const mockProject: EccProject = {
        id: parseInt(params.id),
        organizationName: "Saudi Tech Solutions",
        organizationSize: "medium",
        organizationScope: "advanced",
        projectName: "ECC Compliance 2024",
        description: "Complete implementation of Essential Cybersecurity Controls for our organization",
        status: "gap-assessment",
        currentStep: 2,
        overallComplianceScore: 34,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z"
      };
      setProject(mockProject);
    }
  }, [params?.id]);

  if (!match || !project) {
    return <div>Project not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-green-100 text-green-800";
      case "partially-compliant": return "bg-yellow-100 text-yellow-800";
      case "non-compliant": return "bg-red-100 text-red-800";
      case "not-applicable": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-gray-100 text-gray-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "review": return "bg-purple-100 text-purple-800";
      case "done": return "bg-green-100 text-green-800";
      case "blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleTrainingStart = (moduleId: number) => {
    console.log("Training started for module:", moduleId);
  };

  const handleTrainingComplete = (moduleId: number, score: number, timeSpent: number) => {
    toast({
      title: "Training Complete!",
      description: `You scored ${score}% in ${timeSpent} minutes.`,
      variant: score >= 80 ? "default" : "destructive"
    });
  };

  const handleGovernanceComplete = (data: any) => {
    console.log("Governance setup completed:", data);
    setShowGovernanceSetup(false);
    if (project.currentStep === 1) {
      const nextStep = 2;
      setProject({ ...project, currentStep: nextStep });
      toast({
        title: "Foundation Complete!",
        description: "Governance foundation established. Proceeding to gap assessment."
      });
    }
  };

  const handleNextStep = () => {
    if (project.currentStep === 1) {
      setShowGovernanceSetup(true);
    } else if (project.currentStep < 10) {
      const nextStep = project.currentStep + 1;
      setProject({ ...project, currentStep: nextStep });
      toast({
        title: "Advancing to Next Step",
        description: `Moving to step ${nextStep}: ${workflowSteps[nextStep - 1].title}`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/ecc-navigator">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.projectName}</h1>
            <p className="text-muted-foreground">{project.organizationName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="capitalize">{project.status.replace("-", " ")}</Badge>
          <Button onClick={handleNextStep} disabled={project.currentStep >= 10}>
            <Play className="h-4 w-4 mr-2" />
            {project.currentStep >= 10 ? "Complete" : "Next Step"}
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Step</p>
                <h3 className="text-2xl font-bold">{project.currentStep}/10</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                <h3 className="text-2xl font-bold">{project.overallComplianceScore}%</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risks</p>
                <h3 className="text-2xl font-bold">
                  {riskAssessments.filter(r => r.riskLevel === 'critical' || r.riskLevel === 'high').length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks in Progress</p>
                <h3 className="text-2xl font-bold">
                  {roadmapTasks.filter(t => t.status === 'in-progress').length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Progress</CardTitle>
          <CardDescription>Your journey through the 10-step ECC implementation workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflowSteps.map((step) => (
              <div key={step.id} className={`flex items-center gap-4 p-4 border rounded-lg ${
                step.id <= project.currentStep ? "border-green-200 bg-green-50" : 
                step.id === project.currentStep + 1 ? "border-blue-200 bg-blue-50" : "border-gray-200"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.id < project.currentStep ? "bg-green-600 text-white" :
                  step.id === project.currentStep ? "bg-blue-600 text-white" :
                  step.id === project.currentStep + 1 ? "bg-blue-100 text-blue-600" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {step.id < project.currentStep ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {step.id === project.currentStep && (
                  <Badge className="bg-blue-100 text-blue-800">Current</Badge>
                )}
                {step.id === project.currentStep + 1 && (
                  <Badge variant="outline">Next</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gap-assessment">Gap Assessment</TabsTrigger>
          <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Governance Setup Dialog */}
          {showGovernanceSetup && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Foundation & Governance Setup Required
                </CardTitle>
                <CardDescription>
                  Complete the foundational governance setup to establish proper authority and oversight for your ECC implementation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GovernanceSetup 
                  projectId={project.id} 
                  onComplete={handleGovernanceComplete} 
                />
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Organization</label>
                    <p className="font-medium">{project.organizationName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Size</label>
                    <p className="font-medium capitalize">{project.organizationSize}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Scope</label>
                    <p className="font-medium capitalize">{project.organizationScope.replace("-", " ")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {project.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p>{project.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Compliance</span>
                      <span className="text-sm text-muted-foreground">{project.overallComplianceScore}%</span>
                    </div>
                    <Progress value={project.overallComplianceScore} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Compliant: {gapAssessments.filter(g => g.complianceStatus === 'compliant').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Partial: {gapAssessments.filter(g => g.complianceStatus === 'partially-compliant').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Non-compliant: {gapAssessments.filter(g => g.complianceStatus === 'non-compliant').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span>N/A: {gapAssessments.filter(g => g.complianceStatus === 'not-applicable').length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gap-assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gap Assessment Results</CardTitle>
              <CardDescription>Assessment of all 114 ECC controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gapAssessments.map((assessment) => (
                  <div key={assessment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{assessment.controlId}</Badge>
                          <Badge className={getStatusColor(assessment.complianceStatus)}>
                            {assessment.complianceStatus.replace("-", " ")}
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-1">{assessment.controlDescription}</h4>
                        <p className="text-sm text-muted-foreground">{assessment.domain} › {assessment.subdomain}</p>
                        {assessment.evidenceProvided && (
                          <p className="text-sm mt-2"><strong>Evidence:</strong> {assessment.evidenceProvided}</p>
                        )}
                        {assessment.comments && (
                          <p className="text-sm mt-2"><strong>Comments:</strong> {assessment.comments}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Identified risks from gap assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAssessments.map((risk) => (
                  <div key={risk.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(risk.riskLevel)}>
                          {risk.riskLevel} Risk
                        </Badge>
                        <Badge variant="outline">
                          {gapAssessments.find(g => g.id === risk.gapAssessmentId)?.controlId}
                        </Badge>
                      </div>
                    </div>
                    <h4 className="font-semibold mb-2">{risk.riskDescription}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{risk.businessImpact}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <strong>Likelihood:</strong> {risk.likelihood}
                      </div>
                      <div>
                        <strong>Impact:</strong> {risk.impact}
                      </div>
                    </div>
                    
                    <div>
                      <strong className="text-sm">Recommended Actions:</strong>
                      <p className="text-sm mt-1">{risk.recommendedActions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Roadmap</CardTitle>
              <CardDescription>Prioritized tasks for ECC implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roadmapTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(task.priority)}>
                          {task.priority} Priority
                        </Badge>
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <Badge variant="outline">{task.controlId}</Badge>
                    </div>
                    
                    <h4 className="font-semibold mb-2">{task.taskTitle}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{task.taskDescription}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <strong>Department:</strong> {task.department || "Unassigned"}
                      </div>
                      <div>
                        <strong>Estimated Effort:</strong> {task.estimatedEffort || "TBD"}
                      </div>
                      <div>
                        <strong>Target Date:</strong> {task.targetDate ? new Date(task.targetDate).toLocaleDateString() : "TBD"}
                      </div>
                      <div>
                        <strong>Progress:</strong> {task.progress}%
                      </div>
                    </div>
                    
                    <Progress value={task.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Training Modules</CardTitle>
              <CardDescription>Gamified cybersecurity training for your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingModules.map((module) => (
                  <InteractiveTrainingModule
                    key={module.id}
                    module={module}
                    onStart={handleTrainingStart}
                    onComplete={handleTrainingComplete}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Generate and download compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Gap Assessment Report</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive report of all control assessments and evidence
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Risk Assessment Report</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed risk analysis with mitigation recommendations
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">NCA Submission Report</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete compliance report ready for NCA submission
                    </p>
                    <Button size="sm" className="w-full" disabled={project.overallComplianceScore < 80}>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Executive Summary</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      High-level overview for executive presentation
                    </p>
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}