import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Target, FileText, Users, BookOpen, Settings } from "lucide-react";
import { useState } from "react";
import { ncaEccDomains, ncaEccStructure, deploymentPhases } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import DeploymentWorkflow from "@/components/nca/deployment-workflow";
import DomainAssessment from "@/components/nca/domain-assessment";

export default function NcaEcc() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState("Assessment Phase");
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user ID for demonstration - replace with actual user ID from auth
  const userId = 1;

  const handlePhaseSelect = (phase: string) => {
    setCurrentPhase(phase);
    toast({
      title: "Phase Selected",
      description: `Starting ${phase} activities`,
    });
  };

  const handleDomainAssessmentComplete = (results: any) => {
    toast({
      title: "Assessment Complete",
      description: `${results.domainName} assessment completed with ${results.score}% compliance`,
    });
  };

  async function generateDomainPolicies(domain: string) {
    setGenerating(true);
    try {
      const domainData = ncaEccStructure[domain as keyof typeof ncaEccStructure] as any;
      
      for (const policy of domainData.policies) {
        const policyData = {
          userId,
          domain,
          subdomain: policy,
          generatedAt: new Date().toISOString(),
        };
        await apiRequest('POST', '/api/policies', policyData);
      }

      toast({
        title: "Policies Generated",
        description: `Generated all policies for ${domain}`,
      });

      // Invalidate policies cache to refresh the list
      await queryClient.invalidateQueries({ queryKey: [`/api/policies/${userId}`] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate policies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6" data-testid="nca-ecc-page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">NCA ECC Deployment Strategy</h1>
            <p className="text-muted-foreground">5-Phase Implementation with 11 Core Domains</p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          11 Domains • 5 Phases
        </Badge>
      </div>

      <Tabs defaultValue="deployment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deployment" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Deployment
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Domains
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Assessment
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Policies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deployment">
          <DeploymentWorkflow 
            currentPhase={currentPhase}
            completedPhases={completedPhases}
            onPhaseSelect={handlePhaseSelect}
          />
        </TabsContent>

        <TabsContent value="domains" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                NCA ECC Domains Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ncaEccDomains.map((domain, index) => {
                  const domainData = ncaEccStructure[domain as keyof typeof ncaEccStructure] as any;
                  return (
                    <Card 
                      key={domain}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedDomain === domain ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedDomain(selectedDomain === domain ? null : domain)}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold text-lg">{domain}</h3>
                              <p className="text-sm text-muted-foreground">Domain {index + 1}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {domainData.requirements.length} Requirements
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Key Requirements:</p>
                            <ul className="text-sm space-y-1">
                              {domainData.requirements.slice(0, 2).map((req: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-muted-foreground">{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 border-t">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                generateDomainPolicies(domain);
                              }}
                              disabled={generating}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Generate Policies
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

        <TabsContent value="assessment">
          {selectedDomain ? (
            <DomainAssessment 
              domainName={selectedDomain}
              onComplete={handleDomainAssessmentComplete}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center space-y-4">
                <Target className="w-12 h-12 text-muted-foreground mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Select a Domain to Assess</h3>
                  <p className="text-muted-foreground">Choose from the Domains tab to start your compliance assessment</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const firstTab = document.querySelector('[data-value="domains"]') as HTMLElement;
                    firstTab?.click();
                  }}
                >
                  View Domains
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Policy Templates by Domain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {ncaEccDomains.map((domain) => {
                  const domainData = ncaEccStructure[domain as keyof typeof ncaEccStructure] as any;
                  return (
                    <Card key={domain} className="">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{domain}</h3>
                            <p className="text-sm text-muted-foreground">
                              {domainData.policies.length} policy templates
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => generateDomainPolicies(domain)}
                            disabled={generating}
                          >
                            Generate All
                          </Button>
                        </div>
                        <div className="mt-3 space-y-1">
                          {domainData.policies.map((policy: string, index: number) => (
                            <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <FileText className="w-3 h-3" />
                              {policy}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}