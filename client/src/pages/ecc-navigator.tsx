import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
  Trash2
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

const workflowSteps = [
  { id: 1, title: "Foundation & Governance", description: "AO engagement, cybersecurity function, steering committee", icon: Shield },
  { id: 2, title: "Gap Assessment", description: "Interactive questionnaire for all 114 ECC controls", icon: CheckCircle },
  { id: 3, title: "Risk Assessment", description: "Risk analysis with likelihood × impact matrix", icon: AlertTriangle },
  { id: 4, title: "Core Policies & Roles", description: "Cybersecurity strategy, core policies, role definitions", icon: FileText },
  { id: 5, title: "Technical Defense", description: "IAM, system hardening, data protection, network security", icon: Settings },
  { id: 6, title: "Monitoring & Response", description: "SIEM implementation, vulnerability management, incident response", icon: BarChart3 },
  { id: 7, title: "Awareness Training", description: "Interactive phishing simulations and security education", icon: Brain },
  { id: 8, title: "Third-Party & ICS", description: "Vendor contracts, cloud compliance, industrial control systems", icon: Users },
  { id: 9, title: "Continuous Review", description: "Annual reviews, steering committee oversight, improvements", icon: TrendingUp },
  { id: 10, title: "Independent Audit", description: "External auditor engagement and NCA compliance validation", icon: Download }
];

const organizationSizes = [
  { value: "small", label: "Small (1-50 employees)" },
  { value: "medium", label: "Medium (51-250 employees)" },
  { value: "large", label: "Large (251-1000 employees)" },
  { value: "enterprise", label: "Enterprise (1000+ employees)" }
];

const organizationScopes = [
  { value: "basic", label: "Basic ECC Implementation" },
  { value: "advanced", label: "Advanced with Cloud Controls" },
  { value: "ics-included", label: "Full Implementation with ICS" }
];

const trainingModules = [
  {
    id: 1,
    name: "Phishing Simulator",
    type: "phishing-simulator",
    description: "Interactive phishing email simulation with instant feedback",
    icon: Shield,
    difficulty: "Beginner",
    estimatedTime: 15,
    completedUsers: 0,
    totalUsers: 0
  },
  {
    id: 2,
    name: "Secure Browsing Game",
    type: "secure-browsing-game",
    description: "Gamified web navigation avoiding malicious sites",
    icon: Gamepad2,
    difficulty: "Intermediate",
    estimatedTime: 20,
    completedUsers: 0,
    totalUsers: 0
  },
  {
    id: 3,
    name: "Social Media Challenge",
    type: "social-media-challenge",
    description: "Scenario-based social media security decisions",
    icon: Users,
    difficulty: "Beginner",
    estimatedTime: 10,
    completedUsers: 0,
    totalUsers: 0
  },
  {
    id: 4,
    name: "Cybersecurity Fundamentals Quiz",
    type: "quiz",
    description: "Comprehensive quiz on cybersecurity basics",
    icon: Brain,
    difficulty: "Beginner",
    estimatedTime: 25,
    completedUsers: 0,
    totalUsers: 0
  }
];

export default function EccNavigator() {
  const [projects, setProjects] = useState<EccProject[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Mock projects data
  useEffect(() => {
    const mockProjects: EccProject[] = [
      {
        id: 1,
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
      }
    ];
    setProjects(mockProjects);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "setup": return "bg-gray-100 text-gray-800";
      case "gap-assessment": return "bg-yellow-100 text-yellow-800";
      case "risk-assessment": return "bg-orange-100 text-orange-800";
      case "roadmap": return "bg-blue-100 text-blue-800";
      case "implementation": return "bg-purple-100 text-purple-800";
      case "monitoring": return "bg-green-100 text-green-800";
      case "completed": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const CreateProjectDialog = () => {
    const [formData, setFormData] = useState({
      organizationName: "",
      organizationSize: "",
      organizationScope: "",
      projectName: "",
      description: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newProject: EccProject = {
        id: Date.now(),
        ...formData,
        status: "setup",
        currentStep: 1,
        overallComplianceScore: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProjects([...projects, newProject]);
      setShowCreateProject(false);
      setFormData({
        organizationName: "",
        organizationSize: "",
        organizationScope: "",
        projectName: "",
        description: ""
      });
      toast({
        title: "Project Created",
        description: `${newProject.projectName} has been created successfully.`
      });
    };

    return (
      <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New ECC Implementation Project</DialogTitle>
            <DialogDescription>
              Set up a new project to implement the Essential Cybersecurity Controls framework for your organization.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                  required
                  data-testid="input-organization-name"
                />
              </div>
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                  required
                  data-testid="input-project-name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationSize">Organization Size</Label>
                <Select value={formData.organizationSize} onValueChange={(value) => setFormData({...formData, organizationSize: value})}>
                  <SelectTrigger data-testid="select-organization-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationSizes.map(size => (
                      <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="organizationScope">Implementation Scope</Label>
                <Select value={formData.organizationScope} onValueChange={(value) => setFormData({...formData, organizationScope: value})}>
                  <SelectTrigger data-testid="select-organization-scope">
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationScopes.map(scope => (
                      <SelectItem key={scope.value} value={scope.value}>{scope.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your ECC implementation goals and objectives"
                rows={3}
                data-testid="textarea-description"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowCreateProject(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.organizationName || !formData.projectName || !formData.organizationSize || !formData.organizationScope}>
                Create Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ECC Navigator</h1>
          <p className="text-muted-foreground">
            Complete implementation platform for Essential Cybersecurity Controls (ECC-1:2018)
          </p>
        </div>
        <Button onClick={() => setShowCreateProject(true)} data-testid="button-create-project">
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="training">Training Hub</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Workflow Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                10-Step ECC Implementation Workflow
              </CardTitle>
              <CardDescription>
                Structured approach to achieve full compliance with all 114 Essential Cybersecurity Controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {workflowSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm mb-2">
                        {step.id}. {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Controls</p>
                    <h3 className="text-2xl font-bold">114</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Policy Templates</p>
                    <h3 className="text-2xl font-bold">25+</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Training Modules</p>
                    <h3 className="text-2xl font-bold">15+</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI-Enhanced</p>
                    <h3 className="text-2xl font-bold">Yes</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 7-Step Framework Guide */}
          <Card>
            <CardHeader>
              <CardTitle>7-Step ECC Implementation Framework</CardTitle>
              <CardDescription>Aligned with the comprehensive ECC-1:2018 implementation methodology for Saudi organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg border-green-200 bg-green-50">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Foundation & Governance</h4>
                    <p className="text-sm text-muted-foreground mb-2">Secure Authorizing Official buy-in, establish cybersecurity function, form steering committee</p>
                    <Button size="sm" onClick={() => setShowCreateProject(true)}>
                      <Shield className="h-4 w-4 mr-2" />
                      Start Foundation
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Core Policies & Roles</h4>
                    <p className="text-sm text-muted-foreground">Develop cybersecurity strategy, core policies (AUP, IRP, BC/DR), define roles</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Technical Defense</h4>
                    <p className="text-sm text-muted-foreground">Asset management, IAM with MFA, system hardening, data encryption</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Monitoring & Response</h4>
                    <p className="text-sm text-muted-foreground">SIEM deployment, vulnerability management, incident response activation</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold mb-1">Third-Party & ICS</h4>
                    <p className="text-sm text-muted-foreground">Vendor contracts, cloud compliance (KSA data residency), ICS security</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold">6</div>
                  <div>
                    <h4 className="font-semibold mb-1">Continuous Review</h4>
                    <p className="text-sm text-muted-foreground">Annual reviews, steering committee meetings, continuous improvement</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">7</div>
                  <div>
                    <h4 className="font-semibold mb-1">Independent Audit</h4>
                    <p className="text-sm text-muted-foreground">External auditor engagement, compliance validation, NCA submission</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first ECC implementation project to get started
                </p>
                <Button onClick={() => setShowCreateProject(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          {project.projectName}
                        </CardTitle>
                        <CardDescription>{project.organizationName}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Compliance</span>
                        <span className="text-sm text-muted-foreground">{project.overallComplianceScore}%</span>
                      </div>
                      <Progress value={project.overallComplianceScore} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Step</p>
                        <p className="font-medium">{project.currentStep}/10</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Organization Size</p>
                        <p className="font-medium capitalize">{project.organizationSize}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" asChild>
                        <Link href={`/ecc-navigator/project/${project.id}`}>
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Interactive Training Hub
              </CardTitle>
              <CardDescription>
                Gamified cybersecurity training modules with real-time feedback and competency tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingModules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <Card key={module.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{module.name}</h3>
                              <Badge variant="outline">{module.difficulty}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {module.estimatedTime}m
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {module.completedUsers}/{module.totalUsers} completed
                              </span>
                            </div>
                            
                            <Button size="sm" className="w-full">
                              <Play className="h-4 w-4 mr-2" />
                              Start Training
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <h3 className="text-2xl font-bold">{projects.length}</h3>
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
                    <p className="text-sm font-medium text-muted-foreground">Avg Compliance</p>
                    <h3 className="text-2xl font-bold">
                      {projects.length > 0 
                        ? Math.round(projects.reduce((acc, p) => acc + p.overallComplianceScore, 0) / projects.length)
                        : 0}%
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                    <h3 className="text-2xl font-bold">
                      {projects.filter(p => !["completed", "setup"].includes(p.status)).length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <h3 className="text-2xl font-bold">
                      {projects.filter(p => p.status === "completed").length}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics and reporting will be available once you have active projects with progress data.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateProjectDialog />
    </div>
  );
}