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
import { Loader2, Download, FileText, Wand2, Settings, Network, DollarSign } from "lucide-react";

interface ITDocumentGeneratorProps {}

const IT_DOCUMENT_TYPES = [
  { id: 'network-architecture-plan', name: 'Network Architecture Plan', category: 'Infrastructure', icon: Network },
  { id: 'it-staffing-plan', name: 'IT Staffing Plan', category: 'Human Resources', icon: Settings },
  { id: 'system-upgrade-proposal', name: 'System Upgrade Proposal', category: 'Operations', icon: Settings },
  { id: 'it-budget-proposal', name: 'IT Budget Proposal', category: 'Financial', icon: DollarSign },
  { id: 'it-policy-document', name: 'IT Policy Document', category: 'Governance', icon: FileText },
  { id: 'it-compliance-audit-report', name: 'IT Compliance Audit Report', category: 'Compliance', icon: FileText },
  { id: 'it-project-management-plan', name: 'IT Project Management Plan', category: 'Project Management', icon: Settings },
  { id: 'it-vendor-evaluation-document', name: 'IT Vendor Evaluation Document', category: 'Procurement', icon: FileText },
  { id: 'data-security-plan', name: 'Data Security Plan', category: 'Security', icon: Settings },
  { id: 'it-risk-assessment-document', name: 'IT Risk Assessment Document', category: 'Risk Management', icon: FileText },
  { id: 'it-service-level-agreement', name: 'IT Service Level Agreement', category: 'Service Management', icon: FileText },
  { id: 'it-incident-response-plan', name: 'IT Incident Response Plan', category: 'Incident Management', icon: Settings },
  { id: 'it-infrastructure-maintenance-plan', name: 'IT Infrastructure Maintenance Plan', category: 'Maintenance', icon: Settings },
  { id: 'it-strategic-plan', name: 'IT Strategic Plan', category: 'Strategy', icon: Settings }
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

const IT_FRAMEWORKS = [
  { value: 'itil', label: 'ITIL (IT Infrastructure Library)' },
  { value: 'cobit', label: 'COBIT (Control Objectives for IT)' },
  { value: 'iso20000', label: 'ISO 20000 (IT Service Management)' },
  { value: 'iso27001', label: 'ISO 27001 (Information Security)' },
  { value: 'nist', label: 'NIST Cybersecurity Framework' },
  { value: 'togaf', label: 'TOGAF (Enterprise Architecture)' },
  { value: 'pmbok', label: 'PMBOK (Project Management)' }
];

export default function ITDocumentGenerator({}: ITDocumentGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [formData, setFormData] = useState({
    documentType: '',
    companyName: '',
    companySize: '',
    industry: '',
    itFrameworks: [] as string[],
    currentInfrastructure: '',
    specificRequirements: '',
    budget: '',
    timeline: '',
    additionalContext: ''
  });
  const [generatedDocument, setGeneratedDocument] = useState('');

  const handleGenerateDocument = async () => {
    if (!formData.documentType || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please select a document type and enter your company name.",
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

      // Simulate AI-generated document content
      const selectedDocument = IT_DOCUMENT_TYPES.find(d => d.id === formData.documentType);
      const simulatedDocument = generateMockITDocument(selectedDocument?.name || '', formData);
      setGeneratedDocument(simulatedDocument);
      
      toast({
        title: "Document Generated Successfully",
        description: `${selectedDocument?.name} has been generated for ${formData.companyName}.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const generateMockITDocument = (documentName: string, data: any) => {
    return `# ${documentName}
## ${data.companyName}

### Executive Summary
This ${documentName.toLowerCase()} provides comprehensive guidelines and strategic direction for ${data.companyName}'s IT operations and infrastructure management.

### 1. Purpose and Scope
This document establishes the framework for ${data.companyName} to maintain, upgrade, and optimize IT systems and processes in alignment with business objectives.

**Organization Details:**
- Company: ${data.companyName}
- Industry: ${data.industry || 'Not specified'}
- Size: ${data.companySize || 'Not specified'}
- Budget Allocation: ${data.budget || 'To be determined'}

### 2. Current State Assessment
**Existing Infrastructure:**
${data.currentInfrastructure || 'Assessment to be conducted based on current IT environment and business requirements.'}

### 3. Strategic Objectives
- Ensure robust and scalable IT infrastructure
- Maintain high availability and performance standards
- Implement cost-effective technology solutions
- Ensure compliance with industry standards and regulations
- Support business growth and digital transformation initiatives

### 4. Implementation Framework
**Applicable Standards and Frameworks:**
${data.itFrameworks.length > 0 ? data.itFrameworks.join(', ') : 'Industry best practices will be applied'}

**Key Components:**
- Infrastructure planning and design
- Resource allocation and management
- Risk assessment and mitigation
- Performance monitoring and optimization
- Security and compliance considerations

### 5. Timeline and Milestones
**Project Timeline:** ${data.timeline || 'To be determined based on scope and requirements'}

**Key Milestones:**
- Phase 1: Assessment and Planning (Month 1-2)
- Phase 2: Implementation and Deployment (Month 3-6)
- Phase 3: Testing and Optimization (Month 7-8)
- Phase 4: Go-live and Monitoring (Month 9+)

### 6. Resource Requirements
**Technical Requirements:**
${data.specificRequirements || 'Requirements will be determined based on technical assessment and business needs.'}

**Budget Considerations:**
- Hardware and software procurement
- Professional services and consulting
- Training and certification
- Ongoing maintenance and support

### 7. Risk Management
- Technical risks and mitigation strategies
- Budget and timeline considerations
- Resource availability and skills gaps
- Change management and user adoption

### 8. Success Metrics and KPIs
- System availability and performance metrics
- User satisfaction scores
- Cost optimization achievements
- Compliance and security metrics
- Business value and ROI measurements

### 9. Next Steps and Recommendations
1. Conduct detailed technical assessment
2. Stakeholder alignment and approval
3. Resource procurement and allocation
4. Implementation planning and execution
5. Continuous monitoring and improvement

---
**Additional Context:**
${data.additionalContext || 'This document should be reviewed and updated regularly to ensure alignment with changing business requirements and technology landscape.'}

*Generated for ${data.companyName} - ${data.industry} Industry*
*Document Type: ${documentName}*
*Framework Alignment: ${data.itFrameworks.join(', ') || 'Best Practices'}*
`;
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDocument], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.documentType}-${formData.companyName.replace(/\s+/g, '-')}.md`;
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
              IT Document Configuration
            </CardTitle>
            <CardDescription>
              Configure your organization details for AI-powered IT document generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Document Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={formData.documentType} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, documentType: value }))
              }>
                <SelectTrigger data-testid="select-document-type">
                  <SelectValue placeholder="Select IT document type to generate" />
                </SelectTrigger>
                <SelectContent>
                  {IT_DOCUMENT_TYPES.map((document) => (
                    <SelectItem key={document.id} value={document.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{document.name}</span>
                        <Badge variant="outline" className="ml-2">{document.category}</Badge>
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

            {/* IT Frameworks */}
            <div className="space-y-2">
              <Label>IT Frameworks & Standards</Label>
              <div className="grid grid-cols-1 gap-2">
                {IT_FRAMEWORKS.map((framework) => (
                  <div key={framework.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={framework.value}
                      checked={formData.itFrameworks.includes(framework.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            itFrameworks: [...prev.itFrameworks, framework.value]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            itFrameworks: prev.itFrameworks.filter(f => f !== framework.value)
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

            {/* Current Infrastructure */}
            <div className="space-y-2">
              <Label htmlFor="current-infrastructure">Current Infrastructure</Label>
              <Textarea
                id="current-infrastructure"
                placeholder="Describe your current IT infrastructure..."
                value={formData.currentInfrastructure}
                onChange={(e) => setFormData(prev => ({ ...prev, currentInfrastructure: e.target.value }))}
                data-testid="textarea-infrastructure"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $50,000 - $100,000"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  data-testid="input-budget"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  placeholder="e.g., 6 months"
                  value={formData.timeline}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  data-testid="input-timeline"
                />
              </div>
            </div>

            {/* Specific Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">Specific Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="Enter any specific technical requirements..."
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
                placeholder="Any additional context or considerations..."
                value={formData.additionalContext}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalContext: e.target.value }))}
                data-testid="textarea-context"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerateDocument}
              disabled={isGenerating || !formData.documentType || !formData.companyName}
              className="w-full"
              data-testid="button-generate-document"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate IT Document
                </>
              )}
            </Button>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generating document...</span>
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
              Generated Document Preview
            </CardTitle>
            <CardDescription>
              Review and download your AI-generated IT document
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedDocument ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Document Generated</Badge>
                  <Button onClick={handleDownload} size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{generatedDocument}</pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Generated document will appear here</p>
                <p className="text-sm">Complete the configuration and click "Generate IT Document"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}