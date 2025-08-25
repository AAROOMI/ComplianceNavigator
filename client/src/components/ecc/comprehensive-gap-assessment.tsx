import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ncaEccDomains, ncaEccStructure } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  BarChart3, 
  FileText, 
  Download,
  Target,
  Zap
} from "lucide-react";

interface ControlAssessment {
  domain: string;
  subdomain: string;
  control: string;
  status: "compliant" | "partially-compliant" | "non-compliant" | "not-assessed";
  impact: "critical" | "high" | "medium" | "low";
  likelihood: "very-high" | "high" | "medium" | "low" | "very-low";
  riskScore: number;
  notes?: string;
}

interface GapAssessmentResult {
  projectId: number;
  overallScore: number;
  domainScores: Record<string, number>;
  controlAssessments: ControlAssessment[];
  highRiskControls: ControlAssessment[];
  recommendations: string[];
  completedAt: Date;
}

const statusOptions = [
  { value: "compliant", label: "Compliant", color: "bg-green-500", icon: CheckCircle },
  { value: "partially-compliant", label: "Partially Compliant", color: "bg-yellow-500", icon: Clock },
  { value: "non-compliant", label: "Non-Compliant", color: "bg-red-500", icon: AlertTriangle },
  { value: "not-assessed", label: "Not Assessed", color: "bg-gray-500", icon: FileText }
];

const impactOptions = [
  { value: "critical", label: "Critical", weight: 10 },
  { value: "high", label: "High", weight: 8 },
  { value: "medium", label: "Medium", weight: 5 },
  { value: "low", label: "Low", weight: 2 }
];

const likelihoodOptions = [
  { value: "very-high", label: "Very High", weight: 5 },
  { value: "high", label: "High", weight: 4 },
  { value: "medium", label: "Medium", weight: 3 },
  { value: "low", label: "Low", weight: 2 },
  { value: "very-low", label: "Very Low", weight: 1 }
];

interface ComprehensiveGapAssessmentProps {
  projectId: number;
  userId: number;
  onComplete?: (result: GapAssessmentResult) => void;
}

export default function ComprehensiveGapAssessment({ projectId, userId, onComplete }: ComprehensiveGapAssessmentProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("assessment");
  const [currentDomain, setCurrentDomain] = useState(ncaEccDomains[0]);
  const [currentSubdomain, setCurrentSubdomain] = useState("");
  const [currentControlIndex, setCurrentControlIndex] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Map<string, ControlAssessment>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [gapAssessmentResult, setGapAssessmentResult] = useState<GapAssessmentResult | null>(null);

  // Get all controls for current domain and subdomain
  const currentDomainStructure = ncaEccStructure[currentDomain as keyof typeof ncaEccStructure];
  const subdomains = Object.keys(currentDomainStructure);
  const currentControls = currentSubdomain ? (currentDomainStructure as any)[currentSubdomain] || [] : [];
  const currentControl = currentControls[currentControlIndex];

  // Assessment progress calculation
  const totalControls = Object.values(ncaEccStructure).reduce((total, domain) => {
    return total + Object.values(domain).reduce((domainTotal, controls) => {
      return domainTotal + (controls as string[]).length;
    }, 0);
  }, 0);

  const assessedControls = assessmentData.size;
  const progressPercentage = Math.round((assessedControls / totalControls) * 100);

  // Initialize first subdomain
  useEffect(() => {
    if (subdomains.length > 0 && !currentSubdomain) {
      setCurrentSubdomain(subdomains[0]);
    }
  }, [currentDomain, subdomains, currentSubdomain]);

  // Enhanced risk calculation using NCA ECC methodology
  function calculateControlRisk(
    status: string, 
    impact: string, 
    likelihood: string, 
    domain: string, 
    control: string
  ): number {
    const impactWeight = impactOptions.find(i => i.value === impact)?.weight || 5;
    const likelihoodWeight = likelihoodOptions.find(l => l.value === likelihood)?.weight || 3;
    
    const statusMultipliers = {
      "compliant": 0.1,
      "partially-compliant": 0.6,
      "non-compliant": 1.0,
      "not-assessed": 0.8
    };

    const domainWeights = {
      "Governance": 1.2,
      "Cybersecurity Defence": 1.0,
      "Cybersecurity Resilience": 1.1,
      "Third Party Cloud Computing Cybersecurity": 0.9,
      "Industrial Control System (ICS)": 1.3
    };

    const statusMultiplier = statusMultipliers[status as keyof typeof statusMultipliers] || 0.8;
    const domainWeight = domainWeights[domain as keyof typeof domainWeights] || 1.0;
    
    const baseRisk = impactWeight * likelihoodWeight * statusMultiplier * domainWeight;
    return Math.min(Math.round(baseRisk * 10) / 10, 10);
  }

  // Handle control assessment
  function assessControl(
    status: "compliant" | "partially-compliant" | "non-compliant" | "not-assessed",
    impact: "critical" | "high" | "medium" | "low",
    likelihood: "very-high" | "high" | "medium" | "low" | "very-low",
    notes?: string
  ) {
    const riskScore = calculateControlRisk(status, impact, likelihood, currentDomain, currentControl);
    
    const assessment: ControlAssessment = {
      domain: currentDomain,
      subdomain: currentSubdomain,
      control: currentControl,
      status,
      impact,
      likelihood,
      riskScore,
      notes
    };

    const controlKey = `${currentDomain}-${currentSubdomain}-${currentControl}`;
    const newAssessmentData = new Map(assessmentData);
    newAssessmentData.set(controlKey, assessment);
    setAssessmentData(newAssessmentData);

    // Move to next control
    if (currentControlIndex < currentControls.length - 1) {
      setCurrentControlIndex(currentControlIndex + 1);
    } else {
      // Move to next subdomain or domain
      const currentSubdomainIndex = subdomains.indexOf(currentSubdomain);
      if (currentSubdomainIndex < subdomains.length - 1) {
        setCurrentSubdomain(subdomains[currentSubdomainIndex + 1]);
        setCurrentControlIndex(0);
      } else {
        // Move to next domain
        const currentDomainIndex = ncaEccDomains.indexOf(currentDomain);
        if (currentDomainIndex < ncaEccDomains.length - 1) {
          setCurrentDomain(ncaEccDomains[currentDomainIndex + 1] as any);
          setCurrentControlIndex(0);
          setCurrentSubdomain(""); // Will be set by useEffect
        } else {
          // Assessment complete
          setAssessmentComplete(true);
          processAssessmentResults();
        }
      }
    }
  }

  // Process assessment results and generate comprehensive report
  function processAssessmentResults() {
    const assessments = Array.from(assessmentData.values());
    
    // Calculate domain scores
    const domainScores: Record<string, number> = {};
    ncaEccDomains.forEach(domain => {
      const domainAssessments = assessments.filter(a => a.domain === domain);
      if (domainAssessments.length > 0) {
        const compliantControls = domainAssessments.filter(a => a.status === "compliant").length;
        const partiallyCompliantControls = domainAssessments.filter(a => a.status === "partially-compliant").length;
        const totalControls = domainAssessments.length;
        
        domainScores[domain] = Math.round(
          ((compliantControls + partiallyCompliantControls * 0.5) / totalControls) * 100
        );
      }
    });

    // Calculate overall score
    const overallScore = Math.round(
      Object.values(domainScores).reduce((sum, score) => sum + score, 0) / 
      Object.keys(domainScores).length
    );

    // Identify high-risk controls
    const highRiskControls = assessments
      .filter(a => a.riskScore >= 7)
      .sort((a, b) => b.riskScore - a.riskScore);

    // Generate recommendations
    const recommendations = generateRecommendations(assessments, domainScores);

    const result: GapAssessmentResult = {
      projectId,
      overallScore,
      domainScores,
      controlAssessments: assessments,
      highRiskControls,
      recommendations,
      completedAt: new Date()
    };

    setGapAssessmentResult(result);
    setActiveTab("results");
    
    if (onComplete) {
      onComplete(result);
    }
  }

  // Generate AI-driven recommendations based on assessment
  function generateRecommendations(assessments: ControlAssessment[], domainScores: Record<string, number>): string[] {
    const recommendations: string[] = [];

    // Domain-specific recommendations
    Object.entries(domainScores).forEach(([domain, score]) => {
      if (score < 40) {
        recommendations.push(`Critical: ${domain} requires immediate attention with ${score}% compliance`);
      } else if (score < 70) {
        recommendations.push(`Priority: Improve ${domain} compliance from ${score}% to meet NCA ECC standards`);
      }
    });

    // Control-specific recommendations
    const criticalNonCompliant = assessments.filter(a => 
      a.status === "non-compliant" && a.impact === "critical"
    );

    criticalNonCompliant.forEach(control => {
      recommendations.push(`Immediate action required: ${control.control} in ${control.domain}`);
    });

    // High-risk recommendations
    const highRiskCount = assessments.filter(a => a.riskScore >= 7).length;
    if (highRiskCount > 5) {
      recommendations.push(`Risk management priority: ${highRiskCount} high-risk controls identified`);
    }

    return recommendations;
  }

  // Submit assessment to backend
  async function submitAssessment() {
    if (!gapAssessmentResult) return;

    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/ecc-gap-assessments', {
        projectId,
        overallComplianceScore: gapAssessmentResult.overallScore,
        domainScores: gapAssessmentResult.domainScores,
        controlAssessments: JSON.stringify(gapAssessmentResult.controlAssessments),
        highRiskControls: JSON.stringify(gapAssessmentResult.highRiskControls),
        recommendations: JSON.stringify(gapAssessmentResult.recommendations),
        assessedBy: userId,
        assessmentType: "comprehensive-gap-assessment"
      });

      // Create corresponding risk assessments
      for (const control of gapAssessmentResult.highRiskControls) {
        await apiRequest('POST', '/api/ecc-risk-assessments', {
          projectId,
          controlId: `${control.domain}-${control.subdomain}-${control.control}`,
          riskLevel: control.riskScore >= 8 ? "critical" : control.riskScore >= 6 ? "high" : "medium",
          impact: control.impact,
          likelihood: control.likelihood,
          riskScore: control.riskScore,
          mitigationStatus: "identified",
          assessedBy: userId
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['/api/ecc-gap-assessments'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/ecc-risk-assessments'] });

      toast({
        title: "Assessment Complete",
        description: "Comprehensive gap assessment has been saved successfully.",
      });

    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (assessmentComplete && gapAssessmentResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold">Gap Assessment Complete</h2>
          </div>
          <Badge variant="default" className="text-lg px-4 py-2">
            Overall Score: {gapAssessmentResult.overallScore}%
          </Badge>
        </div>

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="domains">Domain Analysis</TabsTrigger>
            <TabsTrigger value="risks">High-Risk Controls</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Overview</CardTitle>
                <CardDescription>
                  Comprehensive analysis of {totalControls} NCA ECC controls across 5 domains
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {gapAssessmentResult.controlAssessments.filter(a => a.status === "compliant").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Compliant</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {gapAssessmentResult.controlAssessments.filter(a => a.status === "partially-compliant").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Partial</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {gapAssessmentResult.controlAssessments.filter(a => a.status === "non-compliant").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Non-Compliant</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {gapAssessmentResult.highRiskControls.length}
                    </div>
                    <div className="text-sm text-muted-foreground">High Risk</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains" className="space-y-4">
            <div className="grid gap-4">
              {Object.entries(gapAssessmentResult.domainScores).map(([domain, score]) => (
                <Card key={domain}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{domain}</CardTitle>
                      <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}>
                        {score}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={score} className="w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            {gapAssessmentResult.highRiskControls.map((control, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>{control.control}</span>
                  <Badge variant="destructive">Risk: {control.riskScore}/10</Badge>
                </AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p><strong>Domain:</strong> {control.domain} → {control.subdomain}</p>
                    <p><strong>Status:</strong> {control.status} | <strong>Impact:</strong> {control.impact}</p>
                    {control.notes && <p><strong>Notes:</strong> {control.notes}</p>}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {gapAssessmentResult.recommendations.map((recommendation, index) => (
              <Alert key={index}>
                <Zap className="h-4 w-4" />
                <AlertTitle>Recommendation {index + 1}</AlertTitle>
                <AlertDescription>{recommendation}</AlertDescription>
              </Alert>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button onClick={submitAssessment} disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Saving..." : "Save Assessment"}
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Comprehensive Gap Assessment</h2>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Progress: {assessedControls}/{totalControls} ({progressPercentage}%)
        </Badge>
      </div>

      <Progress value={progressPercentage} className="w-full h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentDomain}</Badge>
              <span>→</span>
              <Badge variant="outline">{currentSubdomain}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Control {currentControlIndex + 1} of {currentControls.length}
            </div>
          </CardTitle>
          <CardDescription>
            Assess the current implementation status of this control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Control Under Assessment:</h3>
            <p className="text-sm">{currentControl}</p>
          </div>

          <div className="grid gap-6">
            <div>
              <h4 className="font-medium mb-3">Implementation Status</h4>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => {
                      const defaultImpact = "high";
                      const defaultLikelihood = "medium";
                      assessControl(option.value as any, defaultImpact, defaultLikelihood);
                    }}
                  >
                    <option.icon className={`w-4 h-4 mr-2 ${option.color === 'bg-green-500' ? 'text-green-500' : option.color === 'bg-yellow-500' ? 'text-yellow-500' : option.color === 'bg-red-500' ? 'text-red-500' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentControlIndex > 0) {
                    setCurrentControlIndex(currentControlIndex - 1);
                  }
                }}
                disabled={currentControlIndex === 0}
              >
                Previous Control
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  assessControl("not-assessed", "medium", "medium", "Skipped for later review");
                }}
              >
                Skip Control
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}