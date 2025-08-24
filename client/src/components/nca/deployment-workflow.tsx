import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardCheck, 
  Calendar, 
  Wrench, 
  CheckCircle2, 
  RefreshCcw,
  ChevronRight,
  ChevronDown,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Target,
  Clock,
  CheckSquare
} from "lucide-react";
import { deploymentPhases, ncaEccStructure } from "@shared/schema";

const phaseIcons = {
  "Assessment Phase": ClipboardCheck,
  "Planning Phase": Calendar,
  "Implementation Phase": Wrench,
  "Validation Phase": CheckCircle2,
  "Continuous Improvement Phase": RefreshCcw
};

const phaseColors = {
  "Assessment Phase": "bg-blue-500",
  "Planning Phase": "bg-yellow-500", 
  "Implementation Phase": "bg-orange-500",
  "Validation Phase": "bg-green-500",
  "Continuous Improvement Phase": "bg-purple-500"
};

const phaseDescriptions = {
  "Assessment Phase": "Conduct cybersecurity readiness assessment and identify gaps against NCA ECC requirements",
  "Planning Phase": "Assign responsibilities, develop policies and procedures, design risk management framework",
  "Implementation Phase": "Deploy security controls, conduct awareness training, implement monitoring solutions", 
  "Validation Phase": "Perform audits and assessments, validate compliance with NCA ECC",
  "Continuous Improvement Phase": "Periodic reviews and updates, incident management and response refinement"
};

const phaseActivities = {
  "Assessment Phase": [
    "Conduct a cybersecurity readiness assessment",
    "Identify gaps against NCA ECC requirements", 
    "Define compliance roadmap"
  ],
  "Planning Phase": [
    "Assign responsibilities",
    "Develop policies and procedures",
    "Design risk management framework"
  ],
  "Implementation Phase": [
    "Deploy security controls",
    "Conduct awareness training",
    "Implement monitoring solutions"
  ],
  "Validation Phase": [
    "Perform audits and assessments",
    "Validate compliance with NCA ECC"
  ],
  "Continuous Improvement Phase": [
    "Periodic reviews and updates",
    "Incident management and response refinement"
  ]
};

interface DeploymentWorkflowProps {
  currentPhase?: string;
  completedPhases?: string[];
  onPhaseSelect?: (phase: string) => void;
}

export default function DeploymentWorkflow({ 
  currentPhase = "Assessment Phase", 
  completedPhases = [],
  onPhaseSelect 
}: DeploymentWorkflowProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(currentPhase);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const getPhaseStatus = (phase: string) => {
    if (completedPhases.includes(phase)) return "completed";
    if (phase === currentPhase) return "current";
    return "pending";
  };

  const getProgressPercentage = () => {
    const currentIndex = deploymentPhases.findIndex(p => p === currentPhase);
    const completedCount = completedPhases.length;
    return ((currentIndex + completedCount) / deploymentPhases.length) * 100;
  };

  const renderPhaseCard = (phase: string, index: number) => {
    const Icon = phaseIcons[phase as keyof typeof phaseIcons];
    const status = getPhaseStatus(phase);
    const isExpanded = expandedPhase === phase;

    return (
      <Card key={phase} className={`transition-all duration-200 ${
        status === "current" ? "ring-2 ring-blue-500 shadow-lg" : 
        status === "completed" ? "bg-green-50 dark:bg-green-950/20" : ""
      }`}>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setExpandedPhase(isExpanded ? null : phase)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                status === "completed" ? "bg-green-500" :
                status === "current" ? "bg-blue-500" :
                "bg-gray-300"
              }`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Phase {index + 1}: {phase.replace(" Phase", "")}
                  {status === "completed" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {status === "current" && <Clock className="w-4 h-4 text-blue-500" />}
                </CardTitle>
                <CardDescription className="text-sm">
                  {phaseDescriptions[phase as keyof typeof phaseDescriptions]}
                </CardDescription>
              </div>
            </div>
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Activities</h4>
                <div className="space-y-2">
                  {phaseActivities[phase as keyof typeof phaseActivities].map((activity, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {status === "current" && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    size="sm" 
                    onClick={() => onPhaseSelect?.(phase)}
                    className="flex-1"
                  >
                    Start {phase}
                  </Button>
                  <Button size="sm" variant="outline">
                    View Checklist
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6" data-testid="deployment-workflow">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                NCA ECC Deployment Progress
              </CardTitle>
              <CardDescription>
                5-Phase Implementation Strategy
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {Math.round(getProgressPercentage())}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={getProgressPercentage()} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Current: {currentPhase}</span>
              <span>{completedPhases.length} of {deploymentPhases.length} phases completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Details */}
      <Tabs value="phases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phases" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Deployment Phases
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Domain Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-4">
          <div className="space-y-4">
            {deploymentPhases.map((phase, index) => renderPhaseCard(phase, index))}
          </div>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NCA ECC Domains Overview</CardTitle>
              <CardDescription>
                11 core domains for comprehensive cybersecurity compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(ncaEccStructure).map((domain, index) => (
                  <Card 
                    key={domain}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedDomain === domain ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setSelectedDomain(selectedDomain === domain ? null : domain)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-sm line-clamp-2">{domain}</h3>
                            <p className="text-xs text-muted-foreground">Domain {index + 1}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {(ncaEccStructure[domain as keyof typeof ncaEccStructure] as any).requirements.length} req
                          </Badge>
                        </div>

                        {selectedDomain === domain && (
                          <div className="space-y-2 pt-2 border-t">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Key Requirements:</p>
                              <ul className="text-xs space-y-1 mt-1">
                                {((ncaEccStructure[domain as keyof typeof ncaEccStructure] as any).requirements as string[]).slice(0, 2).map((req, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span className="w-1 h-1 bg-current rounded-full mt-1.5 flex-shrink-0" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Personnel Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Key Personnel & Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium">CTO</h4>
              <p className="text-sm text-muted-foreground">Technology Strategy</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium">CIO</h4>
              <p className="text-sm text-muted-foreground">Information Systems</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium">Cybersecurity Officer</h4>
              <p className="text-sm text-muted-foreground">Security Implementation</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium">Risk & Compliance Officer</h4>
              <p className="text-sm text-muted-foreground">Risk Management</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}