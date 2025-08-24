import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Plus, X, AlertTriangle, Target, Shield, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertRiskRegister } from "@shared/schema";

const riskCategories = [
  "Data Security",
  "Network Security", 
  "Access Control",
  "Business Continuity",
  "Compliance & Governance",
  "Physical Security",
  "Human Resources",
  "Third-Party Risk",
  "Technology Infrastructure",
  "Operational Risk",
  "Financial Risk",
  "Reputation Risk"
];

const riskLevels = [
  { value: "low", label: "Low", color: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "critical", label: "Critical", color: "bg-red-500" }
];

const impactLevels = [
  "Very Low",
  "Low", 
  "Medium",
  "High",
  "Critical"
];

const likelihoodLevels = [
  "Very Low",
  "Low",
  "Medium", 
  "High",
  "Very High"
];

const commonThreats = [
  "External hackers", "Malicious insiders", "Natural disasters", "System failures",
  "Human error", "Third-party breaches", "Regulatory changes", "Economic factors",
  "Supply chain disruption", "Cyberattacks", "Data theft", "Service outages"
];

const commonVulnerabilities = [
  "Weak access controls", "Unpatched software", "Insufficient monitoring", "Poor encryption",
  "Inadequate training", "Lack of documentation", "Single points of failure", "Legacy systems",
  "Insufficient backups", "Poor physical security", "Weak passwords", "Social engineering susceptibility"
];

const commonAssets = [
  "Customer data", "Financial records", "Intellectual property", "IT systems",
  "Network infrastructure", "Employee information", "Business applications", "Physical facilities",
  "Reputation", "Regulatory compliance", "Business processes", "Third-party relationships"
];

const riskAssessmentSchema = z.object({
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  riskLevel: z.string().min(1, "Risk level is required"),
  impact: z.string().min(1, "Impact assessment is required"),
  likelihood: z.string().min(1, "Likelihood assessment is required"),
  threats: z.array(z.string()).min(1, "At least one threat must be identified"),
  vulnerabilities: z.array(z.string()).min(1, "At least one vulnerability must be identified"),
  assets: z.array(z.string()).min(1, "At least one asset must be identified"),
  controls: z.array(z.string()),
  mitigationStrategies: z.array(z.string()),
  complianceFrameworks: z.array(z.string()),
  tags: z.array(z.string()),
});

type RiskAssessmentFormData = z.infer<typeof riskAssessmentSchema>;

interface RiskAssessmentFormProps {
  onSuccess?: (risk: any) => void;
  onCancel?: () => void;
  initialData?: Partial<RiskAssessmentFormData>;
}

export default function RiskAssessmentForm({ onSuccess, onCancel, initialData }: RiskAssessmentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [customThreat, setCustomThreat] = useState("");
  const [customVulnerability, setCustomVulnerability] = useState("");
  const [customAsset, setCustomAsset] = useState("");
  const [customControl, setCustomControl] = useState("");
  const [customMitigation, setCustomMitigation] = useState("");

  const form = useForm<RiskAssessmentFormData>({
    resolver: zodResolver(riskAssessmentSchema),
    defaultValues: {
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      riskLevel: initialData?.riskLevel || "",
      impact: initialData?.impact || "",
      likelihood: initialData?.likelihood || "",
      threats: initialData?.threats || [],
      vulnerabilities: initialData?.vulnerabilities || [],
      assets: initialData?.assets || [],
      controls: initialData?.controls || [],
      mitigationStrategies: initialData?.mitigationStrategies || [],
      complianceFrameworks: initialData?.complianceFrameworks || [],
      tags: initialData?.tags || [],
    },
  });

  const createRiskMutation = useMutation({
    mutationFn: (data: InsertRiskRegister) => fetch("/api/risk-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, isActive: true }),
    }).then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: "Risk Assessment Created",
        description: "Your risk assessment has been successfully added to the register.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/risk-register'] });
      onSuccess?.(data);
      form.reset();
      setCurrentStep(1);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create risk assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: RiskAssessmentFormData) => {
    createRiskMutation.mutate({
      ...data,
      riskLevel: data.riskLevel.toLowerCase(),
      impact: data.impact,
      likelihood: data.likelihood.toLowerCase().replace(' ', '_'),
    } as InsertRiskRegister);
  };

  const addToArray = (fieldName: keyof RiskAssessmentFormData, value: string, customValue: string, setCustomValue: (value: string) => void) => {
    if (!value && !customValue) return;
    
    const currentValues = form.getValues(fieldName) as string[];
    const newValue = value || customValue;
    
    if (!currentValues.includes(newValue)) {
      form.setValue(fieldName, [...currentValues, newValue] as any);
    }
    
    if (customValue) setCustomValue("");
  };

  const removeFromArray = (fieldName: keyof RiskAssessmentFormData, valueToRemove: string) => {
    const currentValues = form.getValues(fieldName) as string[];
    form.setValue(fieldName, currentValues.filter(v => v !== valueToRemove) as any);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step === currentStep ? 'bg-blue-600 text-white' : 
            step < currentStep ? 'bg-green-600 text-white' : 
            'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 4 && <div className={`w-12 h-1 ${step < currentStep ? 'bg-green-600' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Risk Identification</h3>
        <p className="text-muted-foreground">Identify and categorize the risk</p>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-risk-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {riskCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Data Breach, System Failure" {...field} data-testid="input-subcategory" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Title *</FormLabel>
              <FormControl>
                <Input placeholder="Brief, descriptive title for the risk" {...field} data-testid="input-risk-title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Description *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of the risk, including potential scenarios and business impact"
                  className="min-h-[120px]"
                  {...field}
                  data-testid="textarea-risk-description"
                />
              </FormControl>
              <FormDescription>
                Describe the risk scenario, what could go wrong, and the potential business consequences.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="w-12 h-12 text-orange-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Risk Analysis</h3>
        <p className="text-muted-foreground">Assess impact and likelihood</p>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="impact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impact Level *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-impact-level">
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {impactLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="likelihood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Likelihood *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-likelihood">
                      <SelectValue placeholder="Select likelihood" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {likelihoodLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="riskLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Risk Level *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-risk-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {riskLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${level.color}`} />
                          {level.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );

  const renderArrayField = (
    title: string,
    fieldName: keyof RiskAssessmentFormData,
    suggestions: string[],
    customValue: string,
    setCustomValue: (value: string) => void,
    placeholder: string
  ) => {
    const currentValues = form.getValues(fieldName) as string[];

    return (
      <div>
        <Label className="text-sm font-medium">{title}</Label>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {currentValues.map((value) => (
              <Badge key={value} variant="secondary" className="flex items-center gap-1">
                {value}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => removeFromArray(fieldName, value)}
                />
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {suggestions.filter(s => !currentValues.includes(s)).slice(0, 8).map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addToArray(fieldName, suggestion, "", setCustomValue)}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder={placeholder}
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={() => addToArray(fieldName, "", customValue, setCustomValue)}
              disabled={!customValue.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Threat & Vulnerability Analysis</h3>
        <p className="text-muted-foreground">Identify threats, vulnerabilities, and affected assets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {renderArrayField(
            "Threats *",
            "threats",
            commonThreats,
            customThreat,
            setCustomThreat,
            "Add custom threat"
          )}
          <FormMessage>{form.formState.errors.threats?.message}</FormMessage>
        </div>

        <div className="space-y-4">
          {renderArrayField(
            "Vulnerabilities *", 
            "vulnerabilities",
            commonVulnerabilities,
            customVulnerability,
            setCustomVulnerability,
            "Add custom vulnerability"
          )}
          <FormMessage>{form.formState.errors.vulnerabilities?.message}</FormMessage>
        </div>

        <div className="space-y-4">
          {renderArrayField(
            "Affected Assets *",
            "assets",
            commonAssets,
            customAsset,
            setCustomAsset,
            "Add custom asset"
          )}
          <FormMessage>{form.formState.errors.assets?.message}</FormMessage>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Controls & Mitigation</h3>
        <p className="text-muted-foreground">Define controls and mitigation strategies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {renderArrayField(
            "Current Controls",
            "controls",
            ["Multi-factor authentication", "Encryption", "Monitoring", "Access controls", "Backups", "Firewalls"],
            customControl,
            setCustomControl,
            "Add custom control"
          )}
        </div>

        <div className="space-y-4">
          {renderArrayField(
            "Mitigation Strategies",
            "mitigationStrategies",
            ["Employee training", "Policy development", "Technical upgrades", "Process improvement", "Third-party assessment"],
            customMitigation,
            setCustomMitigation,
            "Add custom mitigation"
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Professional Risk Assessment</CardTitle>
        <CardDescription className="text-center">
          Comprehensive risk identification and analysis following industry best practices
        </CardDescription>
        {renderStepIndicator()}
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => currentStep === 1 ? onCancel?.() : setCurrentStep(currentStep - 1)}
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>

            <div className="flex gap-2">
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && (!form.getValues('category') || !form.getValues('title') || !form.getValues('description'))) ||
                    (currentStep === 2 && (!form.getValues('impact') || !form.getValues('likelihood') || !form.getValues('riskLevel'))) ||
                    (currentStep === 3 && (
                      form.getValues('threats').length === 0 || 
                      form.getValues('vulnerabilities').length === 0 || 
                      form.getValues('assets').length === 0
                    ))
                  }
                  data-testid="button-next-step"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={createRiskMutation.isPending}
                  data-testid="button-create-risk"
                >
                  {createRiskMutation.isPending ? 'Creating...' : 'Create Risk Assessment'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}