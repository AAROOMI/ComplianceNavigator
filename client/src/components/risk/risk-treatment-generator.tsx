import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DocumentViewer from "@/components/common/document-viewer";
import { 
  Wand2, 
  Shield, 
  Target, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Lightbulb,
  Download,
  Copy,
  ArrowRight,
  Settings,
  Users,
  Lock,
  Monitor,
  Database,
  FileText,
  Eye
} from "lucide-react";

interface Risk {
  id: string;
  asset: string;
  threat: string;
  vulnerability: string;
  impactC: number;
  impactI: number;
  impactA: number;
  likelihood: number;
  score: number;
  level: string;
  controls: string;
  treatment: string;
}

interface TreatmentRecommendation {
  strategy: 'mitigate' | 'accept' | 'transfer' | 'avoid';
  priority: 'immediate' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  implementationSteps: string[];
  timeline: string;
  cost: string;
  effectiveness: number;
  resources: string[];
  metrics: string[];
  considerations: string[];
}

interface RiskTreatmentGeneratorProps {
  risk: Risk;
  onRecommendationGenerated: (recommendations: TreatmentRecommendation[]) => void;
  onClose: () => void;
}

export default function RiskTreatmentGenerator({ risk, onRecommendationGenerated, onClose }: RiskTreatmentGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [recommendations, setRecommendations] = useState<TreatmentRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<TreatmentRecommendation | null>(null);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Simulate AI analysis process with progress updates
      const steps = [
        { progress: 20, message: "Analyzing risk profile..." },
        { progress: 40, message: "Evaluating threat landscape..." },
        { progress: 60, message: "Identifying control options..." },
        { progress: 80, message: "Generating treatment strategies..." },
        { progress: 100, message: "Finalizing recommendations..." }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(step.progress);
      }

      // Generate comprehensive treatment recommendations based on risk analysis
      const generatedRecommendations = generateTreatmentOptions(risk);
      setRecommendations(generatedRecommendations);
      onRecommendationGenerated(generatedRecommendations);
      
      toast({
        title: "Recommendations Generated",
        description: `Generated ${generatedRecommendations.length} tailored treatment recommendations for ${risk.asset}.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate treatment recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const generateTreatmentOptions = (risk: Risk): TreatmentRecommendation[] => {
    const recommendations: TreatmentRecommendation[] = [];
    const riskScore = risk.score;
    const maxImpact = Math.max(risk.impactC, risk.impactI, risk.impactA);
    const likelihood = risk.likelihood;

    // Analyze risk characteristics to determine appropriate treatments
    if (riskScore >= 15) {
      // High/Severe risks - Multiple mitigation strategies
      recommendations.push({
        strategy: 'mitigate',
        priority: 'immediate',
        title: 'Immediate Risk Mitigation',
        description: 'Deploy comprehensive controls to reduce risk exposure immediately',
        implementationSteps: [
          'Conduct emergency risk assessment meeting with stakeholders',
          'Implement temporary protective measures within 24 hours',
          'Deploy additional monitoring and detection capabilities',
          'Establish incident response procedures specific to this risk',
          'Review and strengthen existing security controls',
          'Create detailed mitigation plan with timeline and responsibilities'
        ],
        timeline: '1-2 weeks',
        cost: '$10,000 - $50,000',
        effectiveness: 85,
        resources: ['Security Team', 'IT Operations', 'Risk Manager', 'External Consultants'],
        metrics: ['Risk score reduction', 'Incident frequency', 'Control effectiveness', 'Mean time to detection'],
        considerations: [
          'May require emergency budget approval',
          'Could impact business operations temporarily',
          'Requires executive sponsorship and urgency',
          'May need vendor coordination for rapid deployment'
        ]
      });

      if (risk.asset.toLowerCase().includes('data') || risk.asset.toLowerCase().includes('database')) {
        recommendations.push({
          strategy: 'mitigate',
          priority: 'high',
          title: 'Data Protection Enhancement',
          description: 'Implement advanced data protection measures and access controls',
          implementationSteps: [
            'Deploy data encryption at rest and in transit',
            'Implement data loss prevention (DLP) solutions',
            'Establish privileged access management (PAM)',
            'Create data classification and handling procedures',
            'Deploy database activity monitoring',
            'Implement data backup and recovery testing'
          ],
          timeline: '2-4 weeks',
          cost: '$15,000 - $75,000',
          effectiveness: 90,
          resources: ['Data Protection Officer', 'Database Administrators', 'Security Engineers'],
          metrics: ['Data access violations', 'Encryption coverage', 'Backup success rate', 'Recovery time objective'],
          considerations: [
            'May impact database performance initially',
            'Requires user training on new procedures',
            'Compliance with data protection regulations',
            'Integration with existing backup systems'
          ]
        });
      }
    }

    if (riskScore >= 9) {
      // Medium to high risks
      recommendations.push({
        strategy: 'mitigate',
        priority: riskScore >= 15 ? 'high' : 'medium',
        title: 'Systematic Control Implementation',
        description: 'Deploy systematic security controls to reduce risk probability and impact',
        implementationSteps: [
          'Conduct detailed vulnerability assessment',
          'Design and implement appropriate security controls',
          'Establish monitoring and alerting mechanisms',
          'Create standard operating procedures',
          'Train personnel on new security measures',
          'Implement regular review and testing procedures'
        ],
        timeline: '3-6 weeks',
        cost: '$5,000 - $25,000',
        effectiveness: 75,
        resources: ['Security Team', 'System Administrators', 'Training Coordinator'],
        metrics: ['Vulnerability scan results', 'Control implementation rate', 'Security incident frequency'],
        considerations: [
          'Requires ongoing maintenance and updates',
          'May need integration with existing systems',
          'Staff training and awareness requirements',
          'Regular effectiveness testing needed'
        ]
      });

      // Transfer option for high-value assets
      if (risk.asset.toLowerCase().includes('system') || risk.asset.toLowerCase().includes('application')) {
        recommendations.push({
          strategy: 'transfer',
          priority: 'medium',
          title: 'Risk Transfer through Insurance',
          description: 'Transfer financial risk through cyber insurance and service level agreements',
          implementationSteps: [
            'Evaluate current cyber insurance coverage',
            'Obtain quotes from multiple insurance providers',
            'Review and negotiate policy terms and coverage limits',
            'Update vendor contracts with appropriate SLA terms',
            'Establish incident reporting procedures for insurance claims',
            'Create documentation for risk transfer evidence'
          ],
          timeline: '4-8 weeks',
          cost: '$2,000 - $15,000 annually',
          effectiveness: 60,
          resources: ['Risk Manager', 'Legal Team', 'Procurement', 'Insurance Broker'],
          metrics: ['Coverage amount', 'Claim response time', 'Premium costs', 'SLA compliance'],
          considerations: [
            'Insurance may not cover all risk scenarios',
            'Requires detailed risk documentation',
            'Annual premium costs and coverage reviews',
            'May have deductibles and coverage limitations'
          ]
        });
      }
    }

    if (riskScore < 9) {
      // Lower risks - Accept or basic mitigation
      recommendations.push({
        strategy: 'accept',
        priority: 'low',
        title: 'Risk Acceptance with Monitoring',
        description: 'Accept the risk level with enhanced monitoring and periodic review',
        implementationSteps: [
          'Document formal risk acceptance decision and rationale',
          'Establish monitoring procedures for risk indicators',
          'Create periodic review schedule (quarterly)',
          'Define trigger conditions for reassessment',
          'Maintain incident tracking and trend analysis',
          'Prepare contingency plans for risk escalation'
        ],
        timeline: '1-2 weeks',
        cost: '$500 - $2,000',
        effectiveness: 40,
        resources: ['Risk Manager', 'Monitoring Team'],
        metrics: ['Risk indicator trends', 'Incident frequency', 'Review compliance'],
        considerations: [
          'Requires ongoing monitoring commitment',
          'Risk levels may change over time',
          'Need clear escalation procedures',
          'Regular reassessment and documentation updates'
        ]
      });
    }

    // Always include a preventive/avoid option for critical assets
    if (risk.threat.toLowerCase().includes('attack') || risk.vulnerability.toLowerCase().includes('critical')) {
      recommendations.push({
        strategy: 'avoid',
        priority: 'high',
        title: 'Risk Avoidance through Architecture Changes',
        description: 'Eliminate the risk by changing system architecture or processes',
        implementationSteps: [
          'Analyze current architecture and identify risk sources',
          'Design alternative architecture without the vulnerability',
          'Create migration plan with minimal business disruption',
          'Implement new architecture in staged approach',
          'Validate security improvements through testing',
          'Decommission vulnerable components securely'
        ],
        timeline: '6-12 weeks',
        cost: '$20,000 - $100,000',
        effectiveness: 95,
        resources: ['Architecture Team', 'Security Engineers', 'Project Manager', 'Quality Assurance'],
        metrics: ['Vulnerability elimination', 'System availability', 'Performance metrics', 'Security posture'],
        considerations: [
          'Significant resource investment required',
          'May require business process changes',
          'Potential temporary performance impact',
          'Requires comprehensive testing and validation'
        ]
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { immediate: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const generateTreatmentDocument = (recommendation: TreatmentRecommendation) => {
    return `Risk Treatment Recommendation: ${recommendation.title}

Strategy: ${recommendation.strategy.toUpperCase()}
Priority: ${recommendation.priority.toUpperCase()}
Timeline: ${recommendation.timeline}
Cost: ${recommendation.cost}
Effectiveness: ${recommendation.effectiveness}%

Description:
${recommendation.description}

Implementation Steps:
${recommendation.implementationSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

Resources Required:
${recommendation.resources.join(', ')}

Success Metrics:
${recommendation.metrics.join(', ')}

Key Considerations:
${recommendation.considerations.map(consideration => `• ${consideration}`).join('\n')}

Risk Asset: ${risk.asset}
Risk Score: ${risk.score}
Risk Level: ${risk.level}

Generated on: ${new Date().toLocaleDateString()}`;
  };

  const copyRecommendation = (recommendation: TreatmentRecommendation) => {
    const text = generateTreatmentDocument(recommendation);
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Treatment recommendation has been copied to your clipboard.",
    });
  };

  const getStrategyIcon = (strategy: string) => {
    switch (strategy) {
      case 'mitigate': return <Shield className="w-4 h-4" />;
      case 'accept': return <CheckCircle className="w-4 h-4" />;
      case 'transfer': return <ArrowRight className="w-4 h-4" />;
      case 'avoid': return <AlertTriangle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'mitigate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accept': return 'bg-green-100 text-green-800 border-green-200';
      case 'transfer': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'avoid': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-primary" />
            Risk Treatment Recommendation Generator
          </h2>
          <p className="text-muted-foreground">
            AI-powered treatment recommendations for {risk.asset}
          </p>
        </div>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>

      {/* Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Risk Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Asset</label>
              <p className="font-semibold">{risk.asset}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Threat</label>
              <p>{risk.threat}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Vulnerability</label>
              <p>{risk.vulnerability}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Risk Score</label>
              <div className="flex items-center gap-2">
                <Badge className={risk.score >= 15 ? 'bg-red-500' : risk.score >= 9 ? 'bg-orange-500' : 'bg-green-500'}>
                  {risk.score} - {risk.level}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Impact (C/I/A)</label>
              <p>{risk.impactC}/{risk.impactI}/{risk.impactA}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Likelihood</label>
              <p>{risk.likelihood}/5</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Interface */}
      {recommendations.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Treatment Recommendations</CardTitle>
            <CardDescription>
              Click below to generate AI-powered risk treatment recommendations tailored to this specific risk profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 animate-pulse text-primary" />
                  <span className="text-sm">Generating intelligent recommendations...</span>
                </div>
                <Progress value={generationProgress} className="w-full" />
                <div className="text-center text-sm text-muted-foreground">
                  {generationProgress}% complete
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Wand2 className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Our AI will analyze your risk parameters and generate comprehensive treatment recommendations with step-by-step implementation guidance.
                </p>
                <Button 
                  onClick={generateRecommendations}
                  className="flex items-center gap-2"
                  data-testid="button-generate-risk-recommendations"
                >
                  <Wand2 className="w-4 h-4" />
                  Generate Treatment Recommendations
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generated Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Generated Recommendations ({recommendations.length})
              </CardTitle>
              <CardDescription>
                AI-generated treatment options ranked by priority and effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {recommendations.map((recommendation, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedRecommendation === recommendation ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedRecommendation(recommendation)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className={getStrategyColor(recommendation.strategy)} variant="outline">
                              {getStrategyIcon(recommendation.strategy)}
                              {recommendation.strategy.toUpperCase()}
                            </Badge>
                            <Badge className={getPriorityColor(recommendation.priority)}>
                              {recommendation.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {recommendation.effectiveness}% Effective
                            </Badge>
                          </div>
                          <h3 className="font-semibold">{recommendation.title}</h3>
                          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {recommendation.timeline}
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {recommendation.cost}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyRecommendation(recommendation);
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <DocumentViewer
                            content={generateTreatmentDocument(recommendation)}
                            metadata={{
                              title: `Risk Treatment Plan - ${recommendation.title}`,
                              type: 'Risk Treatment Plan',
                              description: `${recommendation.strategy.toUpperCase()} strategy for ${risk.asset}`,
                              author: 'Risk Management System',
                              createdDate: new Date().toLocaleDateString(),
                              status: 'draft',
                              priority: recommendation.priority,
                              category: 'Risk Management'
                            }}
                            triggerButton={
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Implementation View */}
          {selectedRecommendation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Implementation Details: {selectedRecommendation.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="steps" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="steps">Implementation Steps</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="metrics">Success Metrics</TabsTrigger>
                    <TabsTrigger value="considerations">Considerations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="steps" className="space-y-4">
                    <div className="space-y-3">
                      {selectedRecommendation.implementationSteps.map((step, index) => (
                        <div key={index} className="flex gap-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4">
                    <div className="grid gap-3">
                      {selectedRecommendation.resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm">{resource}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="space-y-4">
                    <div className="grid gap-3">
                      {selectedRecommendation.metrics.map((metric, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <Monitor className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="considerations" className="space-y-4">
                    <div className="grid gap-3">
                      {selectedRecommendation.considerations.map((consideration, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 border rounded">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{consideration}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}