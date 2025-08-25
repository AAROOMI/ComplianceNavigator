import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  FileText, 
  Settings, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Award,
  ChevronRight,
  ChevronLeft,
  Eye,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle
} from "lucide-react";

interface DetailedActivity {
  name: string;
  description: string;
  completed: boolean;
}

interface ImplementationStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  status: "not-started" | "in-progress" | "completed" | "overdue";
  progress: number;
  estimatedDuration: string;
  startDate?: string;
  endDate?: string;
  deliverables: string[];
  dependencies: number[];
  assignedTeam?: string;
  keyActivities?: string[];
  eccControlReferences?: string[];
  detailedActivities?: DetailedActivity[];
}

interface ProjectProgress {
  totalControls: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  nonCompliant: number;
  identified: number;
  overallProgress: number;
}

interface EccImplementationDashboardProps {
  projectId: number;
  organizationName: string;
  onStepSelect?: (stepId: number) => void;
}

export default function EccImplementationDashboard({ projectId, organizationName, onStepSelect }: EccImplementationDashboardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedStep, setSelectedStep] = useState<ImplementationStep | null>(null);
  const [projectProgress, setProjectProgress] = useState<ProjectProgress>({
    totalControls: 114,
    completed: 18,
    inProgress: 25, 
    notStarted: 71,
    nonCompliant: 33,
    identified: 114,
    overallProgress: 15
  });

  // NCA ECC Implementation Workflow Steps with detailed activities and deliverables
  const implementationSteps: ImplementationStep[] = [
    {
      id: 1,
      title: "Establish the Foundation",
      description: "Secure leadership buy-in and create the organizational structure to lead the effort.",
      icon: Shield,
      status: "completed",
      progress: 100,
      estimatedDuration: "4-6 weeks",
      deliverables: [
        "Appointment project charter",
        "Organizational chart for cybersecurity function",
        "Cybersecurity Steering Committee",
        "Initial Gap Analysis Report"
      ],
      dependencies: [],
      assignedTeam: "Executive Leadership & CISO",
      keyActivities: [
        "Engage the Authorizing Official",
        "Establish the Cybersecurity Function", 
        "Form the Cybersecurity Steering Committee",
        "Conduct a Gap Analysis"
      ],
      eccControlReferences: ["1.2.1", "1.2.3"],
      detailedActivities: [
        {
          name: "Engage the Authorizing Official",
          description: "Identify the AO (Authorizing Official) and Royal Decree (1231) so the CO of the organization is aware of cybersecurity responsibility for their org",
          completed: true
        },
        {
          name: "Establish the Cybersecurity Function",
          description: "Create a dedicated cybersecurity team (CISO office) independent from IT department",
          completed: true
        },
        {
          name: "Form the Cybersecurity Steering Committee",
          description: "Establish a committee with senior stakeholders to steer the ECC, Legal, and Operations",
          completed: true
        },
        {
          name: "Conduct a Gap Analysis",
          description: "Perform high-level risk analysis against the 114 ECC controls",
          completed: true
        }
      ]
    },
    {
      id: 2,
      title: "Develop Core Policies & Define Roles",
      description: "Create the foundational documents and assign responsibility for security.",
      icon: FileText,
      status: "not-started",
      progress: 0,
      estimatedDuration: "6-8 weeks",
      deliverables: [
        "Cybersecurity Policy Framework",
        "Roles and Responsibilities Matrix (RACI)",
        "Security Procedures and Standards",
        "Asset Classification Framework",
        "Risk Management Methodology"
      ],
      dependencies: [1],
      assignedTeam: "Policy Development Team",
      keyActivities: [
        "Develop Cybersecurity Strategy",
        "Create Core Security Policies",
        "Define Organizational Roles",
        "Establish Asset Management Framework"
      ],
      eccControlReferences: ["1.1.1", "1.1.2", "1.3.1", "1.4.1"],
      detailedActivities: [
        {
          name: "Develop Cybersecurity Strategy",
          description: "Create comprehensive cybersecurity strategy aligned with business objectives and NCA ECC requirements",
          completed: false
        },
        {
          name: "Create Core Security Policies",
          description: "Develop essential policies including AUP, IRP, Business Continuity, and Data Protection",
          completed: false
        },
        {
          name: "Define Organizational Roles",
          description: "Establish clear cybersecurity roles, responsibilities, and accountability matrices",
          completed: false
        },
        {
          name: "Establish Asset Management Framework",
          description: "Create asset inventory, classification, and lifecycle management procedures",
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: "Build the Technical Defense",
      description: "Implement the core technical controls to protect systems and data.",
      icon: Settings,
      status: "not-started",
      progress: 0,
      estimatedDuration: "12-16 weeks",
      deliverables: [
        "Identity and Access Management System",
        "Network Security Controls",
        "Endpoint Protection Deployment",
        "Data Encryption Implementation",
        "Security Architecture Design"
      ],
      dependencies: [1, 2],
      assignedTeam: "Technical Implementation Team"
    },
    {
      id: 4,
      title: "Implement Monitoring & Response",
      description: "Detect threats, respond to incidents, and empower employees.",
      icon: BarChart3,
      status: "not-started",
      progress: 0,
      estimatedDuration: "8-10 weeks",
      deliverables: [
        "SIEM Platform Deployment",
        "SOC Establishment",
        "Incident Response Procedures",
        "Security Monitoring Framework",
        "Threat Detection Capabilities"
      ],
      dependencies: [3],
      assignedTeam: "Security Operations Team"
    },
    {
      id: 5,
      title: "Address Specialized Areas",
      description: "Extend security to external partners and specialized systems.",
      icon: Target,
      status: "not-started",
      progress: 0,
      estimatedDuration: "10-12 weeks",
      deliverables: [
        "Third-Party Risk Management",
        "Cloud Security Controls",
        "ICS Security Implementation",
        "Supply Chain Security",
        "Specialized System Protection"
      ],
      dependencies: [3, 4],
      assignedTeam: "Specialized Security Teams"
    },
    {
      id: 6,
      title: "Continuous Review & Improvement",
      description: "Make cybersecurity a continuous, not a one-time, project.",
      icon: TrendingUp,
      status: "not-started",
      progress: 0,
      estimatedDuration: "Ongoing",
      deliverables: [
        "Continuous Monitoring Program",
        "Regular Assessment Schedule",
        "Metrics and KPI Dashboard",
        "Improvement Action Plans",
        "Training and Awareness Programs"
      ],
      dependencies: [4, 5],
      assignedTeam: "Cybersecurity Team"
    },
    {
      id: 7,
      title: "Independent Audit & Compliance",
      description: "Validate the effectiveness of the entire program and ensure compliance.",
      icon: Award,
      status: "not-started",
      progress: 0,
      estimatedDuration: "6-8 weeks",
      deliverables: [
        "Internal Audit Report",
        "External Assessment Results",
        "NCA Compliance Validation",
        "Certification Documentation",
        "Compliance Evidence Portfolio"
      ],
      dependencies: [1, 2, 3, 4, 5, 6],
      assignedTeam: "Audit & Compliance Team"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "overdue": return "bg-red-500";
      case "not-started": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in-progress": return Clock;
      case "overdue": return AlertTriangle;
      case "not-started": return XCircle;
      default: return XCircle;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const navigateSteps = (direction: "prev" | "next") => {
    if (direction === "prev" && currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else if (direction === "next" && currentStepIndex < implementationSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // Document generation function
  const generateDocument = (stepId: number, deliverable: string) => {
    const step = implementationSteps.find(s => s.id === stepId);
    if (!step) return;

    // Create document content based on deliverable type
    let content = "";
    const orgName = organizationName || "Your Organization";
    
    switch (deliverable) {
      case "Appointment project charter":
        content = `# ECC Implementation Project Charter

## Organization: ${orgName}

### Project Overview
This charter formally establishes the Essential Cybersecurity Controls (ECC-1:2018) implementation project for ${orgName}, in accordance with National Cybersecurity Authority (NCA) requirements.

### Executive Sponsor Authorization
**Authorizing Official (AO):** [Name and Title]
**Date:** ${new Date().toLocaleDateString()}

### Project Scope
- Implementation of all 114 ECC controls across 5 domains
- Establishment of cybersecurity governance framework
- Development of policies and procedures aligned with NCA requirements
- Risk assessment and mitigation planning

### Success Criteria
- 100% compliance with applicable ECC controls
- Successful NCA audit and certification
- Established cybersecurity program with continuous monitoring

**Authorized by:** [Executive Signature]
**Date:** ${new Date().toLocaleDateString()}`;
        break;

      case "Organizational chart for cybersecurity function":
        content = `# Cybersecurity Organizational Structure

## ${orgName} - Cybersecurity Function

### Reporting Structure

#### Executive Level
- **Chief Executive Officer (CEO)**
  - Executive oversight and accountability
  - Final decision authority on cybersecurity investments

#### Management Level  
- **Chief Information Security Officer (CISO)**
  - Direct report to CEO/CTO
  - Overall cybersecurity program leadership
  - NCA ECC compliance oversight

#### Operational Level
- **Cybersecurity Manager**
  - Day-to-day cybersecurity operations
  - Team management and coordination
  
- **Security Analyst**
  - Monitoring and incident response
  - Vulnerability assessments

- **Compliance Specialist**
  - ECC compliance tracking
  - Documentation and reporting

### Cybersecurity Steering Committee
- **Chair:** CEO/Senior Executive
- **Members:** CISO, Legal Counsel, HR Director, IT Director, Business Unit Heads

**Document Version:** 1.0
**Last Updated:** ${new Date().toLocaleDateString()}`;
        break;

      case "Initial Gap Analysis Report":
        content = `# Initial Gap Analysis Report
## NCA ECC-1:2018 Compliance Assessment

### Executive Summary
This report presents the initial gap analysis for ${orgName}'s compliance with Essential Cybersecurity Controls (ECC-1:2018).

### Assessment Methodology
- Reviewed current cybersecurity controls against 114 ECC requirements
- Assessed implementation status across 5 domains
- Identified compliance gaps and priority areas

### Domain Assessment Results

#### 1. Cybersecurity Governance
- **Current Status:** Partially Compliant (40%)
- **Key Gaps:** Formal governance structure, policy framework
- **Priority:** High

#### 2. Cybersecurity Defense  
- **Current Status:** Non-Compliant (15%)
- **Key Gaps:** IAM, network security, data protection
- **Priority:** Critical

#### 3. Cybersecurity Resilience
- **Current Status:** Partially Compliant (25%)
- **Key Gaps:** Incident response, business continuity
- **Priority:** High

#### 4. Third-Party and Cloud Computing Cybersecurity
- **Current Status:** Non-Compliant (10%)
- **Key Gaps:** Vendor management, cloud controls
- **Priority:** Medium

#### 5. Industrial Control Systems Cybersecurity
- **Current Status:** Not Applicable (0%)
- **Key Gaps:** N/A - No ICS systems identified
- **Priority:** N/A

### Recommendations
1. Immediate establishment of cybersecurity governance structure
2. Development of comprehensive policy framework
3. Implementation of technical security controls
4. Deployment of monitoring and response capabilities

**Assessment Date:** ${new Date().toLocaleDateString()}
**Next Review:** ${new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString()}`;
        break;

      default:
        content = `# ${deliverable}

## ${orgName}

### Document Purpose
This document supports the implementation of NCA ECC-1:2018 requirements for ${orgName}.

### Content
[Document content to be developed based on specific organizational requirements]

**Created:** ${new Date().toLocaleDateString()}
**Version:** 1.0
**Status:** Draft`;
    }

    // Create and download the document
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deliverable.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">ECC Framework Implementation</h1>
          <p className="text-slate-600 dark:text-slate-300">Essential Cybersecurity Controls Compliance Platform</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileText className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overall Progress Section */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Overall Progress</CardTitle>
              <CardDescription>Complete view of ECC compliance implementation</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{projectProgress.overallProgress}%</div>
              <div className="text-sm text-slate-500">Implementation Progress</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{projectProgress.completed}</div>
              <div className="text-xs text-green-700 dark:text-green-300">Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{projectProgress.inProgress}</div>
              <div className="text-xs text-blue-700 dark:text-blue-300">In Progress</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{projectProgress.nonCompliant}/{projectProgress.totalControls}</div>
              <div className="text-xs text-yellow-700 dark:text-yellow-300">Non-Compliant</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{projectProgress.identified}</div>
              <div className="text-xs text-purple-700 dark:text-purple-300">Total ECC Controls</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{projectProgress.notStarted}</div>
              <div className="text-xs text-gray-700 dark:text-gray-300">Not Started</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
              <div className="text-2xl font-bold text-slate-600">114</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">Identified</div>
            </div>
          </div>
          <Progress value={projectProgress.overallProgress} className="h-3 bg-slate-200 dark:bg-slate-700" />
        </CardContent>
      </Card>

      {/* Implementation Workflow */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle>Implementation Workflow</CardTitle>
          <CardDescription>Follow the 7-step process to achieve compliance</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Workflow Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateSteps("prev")}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex space-x-2 overflow-x-auto">
              {implementationSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`
                      flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all
                      ${index === currentStepIndex ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300' : 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'}
                    `}
                    onClick={() => setCurrentStepIndex(index)}
                  >
                    <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>
                      <step.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-xs font-medium mt-1 text-center">{step.id}</div>
                  </div>
                  {index < implementationSteps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-400 mx-2" />
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateSteps("next")}
              disabled={currentStepIndex === implementationSteps.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Current Step Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {implementationSteps
              .slice(currentStepIndex, currentStepIndex + 2)
              .map((step) => {
                const StatusIcon = getStatusIcon(step.status);
                return (
                  <Card key={step.id} className="border border-slate-200 dark:border-slate-600">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(step.status)}`}>
                            <step.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">Step {step.id}: {step.title}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <StatusIcon className="w-4 h-4 text-slate-500" />
                              <Badge variant="outline" className="text-xs">
                                {step.status.replace("-", " ").toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        {step.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-500">Progress</span>
                          <span className="text-sm font-medium">{step.progress}%</span>
                        </div>
                        <Progress value={step.progress} className="h-2" />
                        
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500">{step.estimatedDuration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-500 text-xs">{step.assignedTeam}</span>
                          </div>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full mt-4">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <step.icon className="w-5 h-5" />
                              <span>Step {step.id}: {step.title}</span>
                            </DialogTitle>
                            <DialogDescription>{step.description}</DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Left Column - Activities */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center">
                                  <Target className="w-4 h-4 mr-2" />
                                  Key Activities
                                </h4>
                                {step.keyActivities && (
                                  <ul className="space-y-2">
                                    {step.keyActivities.map((activity, idx) => (
                                      <li key={idx} className="flex items-center space-x-2 text-sm">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>{activity}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>

                              {step.detailedActivities && (
                                <div>
                                  <h4 className="font-semibold mb-3">Detailed Activities</h4>
                                  <div className="space-y-3">
                                    {step.detailedActivities.map((activity, idx) => (
                                      <div key={idx} className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-700">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-medium text-sm">{activity.name}</span>
                                          {activity.completed ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                          ) : (
                                            <Clock className="w-4 h-4 text-orange-500" />
                                          )}
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300">
                                          {activity.description}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {step.eccControlReferences && (
                                <div>
                                  <h4 className="font-semibold mb-2">ECC Control References</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {step.eccControlReferences.map((control) => (
                                      <Badge key={control} variant="outline" className="text-xs">
                                        {control}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Column - Deliverables */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Deliverables
                                </h4>
                                <div className="space-y-3">
                                  {step.deliverables.map((deliverable, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-slate-800">
                                      <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">{deliverable}</span>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => generateDocument(step.id, deliverable)}
                                        data-testid={`button-generate-${deliverable.replace(/\s+/g, '-').toLowerCase()}`}
                                      >
                                        <FileText className="w-3 h-3 mr-1" />
                                        Generate
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {step.dependencies.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">Dependencies</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {step.dependencies.map((depId) => (
                                      <Badge key={depId} variant="secondary" className="text-xs">
                                        Step {depId}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="pt-4">
                                <Button 
                                  className="w-full"
                                  onClick={() => onStepSelect && onStepSelect(step.id)}
                                  data-testid={`button-start-step-${step.id}`}
                                >
                                  Start Working on This Step
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}