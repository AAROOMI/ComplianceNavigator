import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import RiskRegister from "@/components/assessment/risk-register";
import { 
  Database, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

export default function RiskRegisterPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Seed risk register mutation
  const seedMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/risk-register/seed"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/risk-register"] });
      toast({
        title: "Success",
        description: "Risk register has been populated with common cybersecurity risks.",
      });
      setIsSeeding(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to populate risk register.",
        variant: "destructive",
      });
      console.error("Error seeding risk register:", error);
      setIsSeeding(false);
    },
  });

  const handleSeedRegister = () => {
    setIsSeeding(true);
    seedMutation.mutate();
  };

  return (
    <div className="space-y-6" data-testid="risk-register-page">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Risk Register
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive cybersecurity risk library for assessment and management
          </p>
        </div>
        
        <Button
          onClick={handleSeedRegister}
          disabled={isSeeding || seedMutation.isPending}
          className="flex items-center gap-2"
          data-testid="button-seed-register"
        >
          <Download className="h-4 w-4" />
          {isSeeding || seedMutation.isPending ? "Populating..." : "Populate Common Risks"}
        </Button>
      </div>

      {/* Information Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Info className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Built-in Risks</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Pre-defined cybersecurity risks from industry standards
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Risk Categories</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Organized by security domains and compliance frameworks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">Assessment Ready</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Ready to use in risk assessments and management plans
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Information */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>How to use:</strong> Browse the risk register to find common cybersecurity risks that apply to your organization. 
          Use the search and filtering options to find specific risks by category or level. Click on any risk to view detailed 
          information including threats, vulnerabilities, controls, and mitigation strategies. You can copy risks to your 
          risk management plans for assessment and tracking.
        </AlertDescription>
      </Alert>

      {/* Risk Register Component */}
      <RiskRegister />
    </div>
  );
}