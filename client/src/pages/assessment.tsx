import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import QuestionForm from "@/components/assessment/question-form";
import VulnerabilityForm from "@/components/assessment/vulnerability-form";
import VulnerabilityTable from "@/components/assessment/vulnerability-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScatterChart, PieChart, Pencil, CheckCircle, AlertTriangle, FileText } from "lucide-react";

export default function Assessment() {
  const [activeTab, setActiveTab] = useState("questionnaire");
  const userId = 1; // TODO: Replace with actual user ID
  const [lastAssessmentId, setLastAssessmentId] = useState<number | null>(null);

  // Fetch latest assessment
  const { data: assessments } = useQuery({
    queryKey: ['/api/assessments', userId],
    queryFn: async () => {
      const response = await fetch(`/api/assessments/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }
      return response.json();
    }
  });

  // Get the most recent assessment
  const latestAssessment = assessments?.length > 0 
    ? assessments.sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0]
    : null;

  // Track when a new assessment is completed
  const handleAssessmentComplete = (assessmentId: number) => {
    setLastAssessmentId(assessmentId);
    setActiveTab("vulnerabilities");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Risk Assessment</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="questionnaire" className="flex items-center gap-2">
            <ScatterChart className="h-4 w-4" />
            <span>Assessment</span>
          </TabsTrigger>
          <TabsTrigger value="vulnerabilities" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Vulnerabilities</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questionnaire" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Questionnaire</CardTitle>
              <CardDescription>
                Complete this assessment to evaluate your organization's security posture against NCA ECC requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionForm onComplete={handleAssessmentComplete} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          {!latestAssessment && !lastAssessmentId ? (
            <Alert>
              <AlertTitle className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                <span>No Assessment Completed</span>
              </AlertTitle>
              <AlertDescription>
                Please complete the assessment questionnaire first to document specific vulnerabilities.
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal" 
                  onClick={() => setActiveTab("questionnaire")}
                >
                  Go to Assessment
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Document Vulnerability</CardTitle>
                  <CardDescription>
                    Record specific security vulnerabilities discovered during your assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VulnerabilityForm 
                    assessmentId={lastAssessmentId || latestAssessment?.id} 
                    userId={userId}
                  />
                </CardContent>
              </Card>

              <VulnerabilityTable 
                userId={userId} 
                assessmentId={lastAssessmentId || latestAssessment?.id}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Reports</CardTitle>
              <CardDescription>
                View and print detailed reports by domain or for your entire assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestAssessment ? (
                  <>
                    {["Governance", "Cybersecurity Defence", "Cybersecurity Resilience", "Third Party Cloud Computing Cybersecurity", "Industrial Control System (ICS)"].map((domain) => (
                      <Card key={domain} className="flex flex-col h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{domain}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 flex-1">
                          <VulnerabilityTable 
                            userId={userId} 
                            domain={domain}
                            showPrintButton={false}
                          />
                        </CardContent>
                        <div className="p-4 pt-0 mt-auto">
                          <Button variant="outline" className="w-full" onClick={() => window.open(`/api/reports/${userId}/domain/${encodeURIComponent(domain)}`, '_blank')}>
                            Generate Report
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </>
                ) : (
                  <div className="col-span-full">
                    <Alert>
                      <AlertTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>No Assessment Data</span>
                      </AlertTitle>
                      <AlertDescription>
                        Complete an assessment to generate domain-specific reports.
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-normal" 
                          onClick={() => setActiveTab("questionnaire")}
                        >
                          Go to Assessment
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
