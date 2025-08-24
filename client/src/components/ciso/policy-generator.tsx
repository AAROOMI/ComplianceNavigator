import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import DocumentViewer from "@/components/common/document-viewer";
import { Loader2, Download, FileText, Wand2, Settings, Users, Shield, Eye } from "lucide-react";

interface PolicyGeneratorProps {}

const POLICY_TYPES = [
  { id: 'security-budget-proposal', name: 'Security Budget Proposal', category: 'Financial' },
  { id: 'business-continuity-plan', name: 'Business Continuity Plan', category: 'Operations' },
  { id: 'data-classification-policy', name: 'Data Classification Policy', category: 'Data Protection' },
  { id: 'compliance-audit-report', name: 'Compliance Audit Report', category: 'Compliance' },
  { id: 'data-breach-notification-plan', name: 'Data Breach Notification Plan', category: 'Incident Response' },
  { id: 'network-security-policy', name: 'Network Security Policy', category: 'Network Security' },
  { id: 'patch-management-policy', name: 'Patch Management Policy', category: 'System Management' },
  { id: 'security-architecture-document', name: 'Security Architecture Document', category: 'Architecture' },
  { id: 'security-awareness-training', name: 'Security Awareness Training Material', category: 'Training' },
  { id: 'security-metrics-report', name: 'Security Metrics Report', category: 'Metrics' },
  { id: 'security-program-roadmap', name: 'Security Program Roadmap', category: 'Strategy' },
  { id: 'third-party-security-agreement', name: 'Third-Party Security Agreement', category: 'Third-Party Risk' },
  { id: 'vendor-security-assessment', name: 'Vendor Security Assessment Document', category: 'Third-Party Risk' },
  { id: 'vulnerability-management-plan', name: 'Vulnerability Management Plan', category: 'Risk Management' },
  { id: 'access-control-policy', name: 'Access Control Policy', category: 'Access Management' },
  { id: 'encryption-policy', name: 'Encryption Policy', category: 'Data Protection' },
  { id: 'information-security-policy', name: 'Information Security Policy', category: 'Governance' },
  { id: 'disaster-recovery-plan', name: 'Disaster Recovery Plan', category: 'Business Continuity' },
  { id: 'incident-response-plan', name: 'Incident Response Plan', category: 'Incident Response' }
];

const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup (1-50 employees)' },
  { value: 'small', label: 'Small Business (51-200 employees)' },
  { value: 'medium', label: 'Medium Business (201-1000 employees)' },
  { value: 'large', label: 'Large Enterprise (1000+ employees)' }
];

const INDUSTRIES = [
  { value: 'finance', label: 'Financial Services' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'technology', label: 'Technology' },
  { value: 'retail', label: 'Retail/E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
  { value: 'government', label: 'Government' },
  { value: 'other', label: 'Other' }
];

const COMPLIANCE_FRAMEWORKS = [
  { value: 'nca-ecc', label: 'NCA Essential Cybersecurity Controls' },
  { value: 'iso27001', label: 'ISO 27001' },
  { value: 'nist-csf', label: 'NIST Cybersecurity Framework' },
  { value: 'pci-dss', label: 'PCI DSS' },
  { value: 'hipaa', label: 'HIPAA' },
  { value: 'gdpr', label: 'GDPR' },
  { value: 'sox', label: 'SOX' }
];

export default function PolicyGenerator({}: PolicyGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [formData, setFormData] = useState({
    policyType: '',
    companyName: '',
    companySize: '',
    industry: '',
    complianceFrameworks: [] as string[],
    specificRequirements: '',
    additionalContext: ''
  });
  const [generatedPolicy, setGeneratedPolicy] = useState('');

  const handleGeneratePolicy = async () => {
    if (!formData.policyType || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please select a policy type and enter your company name.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Simulate AI generation process with progress
      const intervals = [20, 40, 60, 80, 100];
      for (const progress of intervals) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(progress);
      }

      // Simulate AI-generated policy content
      const selectedPolicy = POLICY_TYPES.find(p => p.id === formData.policyType);
      const simulatedPolicy = generateMockPolicy(selectedPolicy?.name || '', formData);
      setGeneratedPolicy(simulatedPolicy);
      
      toast({
        title: "Policy Generated Successfully",
        description: `${selectedPolicy?.name} has been generated for ${formData.companyName}.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const generateMockPolicy = (policyName: string, data: any) => {
    return `# ${policyName}
## ${data.companyName}

### 1. Purpose and Scope
This ${policyName.toLowerCase()} establishes the framework for ${data.companyName} to implement comprehensive cybersecurity measures aligned with industry best practices and regulatory requirements.

### 2. Policy Statement
${data.companyName} is committed to protecting its information assets, customer data, and business operations through robust security controls and procedures.

### 3. Objectives
- Establish clear security requirements and controls
- Ensure compliance with ${data.complianceFrameworks.join(', ') || 'applicable regulations'}
- Minimize cybersecurity risks and vulnerabilities
- Protect confidentiality, integrity, and availability of information assets

### 4. Scope and Applicability
This policy applies to all employees, contractors, and third parties with access to ${data.companyName}'s systems and data.

### 5. Roles and Responsibilities
- **Chief Information Security Officer (CISO)**: Overall policy oversight and implementation
- **IT Security Team**: Technical implementation and monitoring
- **Department Heads**: Ensuring compliance within their areas
- **All Personnel**: Following established security procedures

### 6. Implementation Requirements
${data.specificRequirements || 'Implementation will follow industry standard practices and organizational requirements.'}

### 7. Compliance and Monitoring
Regular audits and assessments will be conducted to ensure policy compliance and effectiveness.

### 8. Review and Updates
This policy will be reviewed annually or as needed to address changing threats and requirements.

---
*Generated for ${data.companyName} - ${data.industry} Industry*
*Company Size: ${data.companySize}*
*Compliance Frameworks: ${data.complianceFrameworks.join(', ') || 'None specified'}*
`;
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPolicy], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.policyType}-${formData.companyName.replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Policy Configuration
            </CardTitle>
            <CardDescription>
              Configure your organization details and requirements for AI-powered policy generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Policy Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="policy-type">Policy Type</Label>
              <Select value={formData.policyType} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, policyType: value }))
              }>
                <SelectTrigger data-testid="select-policy-type">
                  <SelectValue placeholder="Select policy type to generate" />
                </SelectTrigger>
                <SelectContent>
                  {POLICY_TYPES.map((policy) => (
                    <SelectItem key={policy.id} value={policy.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{policy.name}</span>
                        <Badge variant="outline" className="ml-2">{policy.category}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Information */}
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                data-testid="input-company-name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-size">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, companySize: value }))
                }>
                  <SelectTrigger data-testid="select-company-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, industry: value }))
                }>
                  <SelectTrigger data-testid="select-industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Compliance Frameworks */}
            <div className="space-y-2">
              <Label>Compliance Frameworks</Label>
              <div className="grid grid-cols-2 gap-2">
                {COMPLIANCE_FRAMEWORKS.map((framework) => (
                  <div key={framework.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={framework.value}
                      checked={formData.complianceFrameworks.includes(framework.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            complianceFrameworks: [...prev.complianceFrameworks, framework.value]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            complianceFrameworks: prev.complianceFrameworks.filter(f => f !== framework.value)
                          }));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={framework.value} className="text-sm">
                      {framework.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Specific Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">Specific Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="Enter any specific requirements or constraints..."
                value={formData.specificRequirements}
                onChange={(e) => setFormData(prev => ({ ...prev, specificRequirements: e.target.value }))}
                data-testid="textarea-requirements"
              />
            </div>

            {/* Additional Context */}
            <div className="space-y-2">
              <Label htmlFor="context">Additional Context</Label>
              <Textarea
                id="context"
                placeholder="Any additional context or special considerations..."
                value={formData.additionalContext}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalContext: e.target.value }))}
                data-testid="textarea-context"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGeneratePolicy}
              disabled={isGenerating || !formData.policyType || !formData.companyName}
              className="w-full"
              data-testid="button-generate-policy"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Policy
                </>
              )}
            </Button>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generating policy...</span>
                  <span>{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Generated Policy Preview
            </CardTitle>
            <CardDescription>
              Review and download your AI-generated security policy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedPolicy ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Policy Generated</Badge>
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <DocumentViewer
                      content={generatedPolicy}
                      metadata={{
                        title: `${POLICY_TYPES.find(p => p.id === formData.policyType)?.name || 'Policy Document'}`,
                        type: 'Security Policy',
                        description: `AI-generated security policy for ${formData.companyName}`,
                        author: 'AI Policy Generator',
                        company: formData.companyName,
                        createdDate: new Date().toLocaleDateString(),
                        status: 'draft',
                        priority: 'medium',
                        category: POLICY_TYPES.find(p => p.id === formData.policyType)?.category || 'Security'
                      }}
                      triggerButton={
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                      }
                    />
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{generatedPolicy}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Generated policy will appear here</p>
                <p className="text-sm">Complete the configuration and click "Generate Policy"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}