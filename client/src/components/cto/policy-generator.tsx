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
import { Loader2, Download, FileText, Wand2, Rocket, TrendingUp, BarChart } from "lucide-react";

interface CTODocumentGeneratorProps {}

const CTO_DOCUMENT_TYPES = [
  { id: 'technology-strategy-document', name: 'Technology Strategy Document', category: 'Strategy' },
  { id: 'innovation-roadmap', name: 'Innovation Roadmap', category: 'Innovation' },
  { id: 'technology-architecture-plan', name: 'Technology Architecture Plan', category: 'Architecture' },
  { id: 'digital-transformation-strategy', name: 'Digital Transformation Strategy', category: 'Transformation' },
  { id: 'technology-risk-assessment', name: 'Technology Risk Assessment', category: 'Risk Management' },
  { id: 'vendor-technology-evaluation', name: 'Vendor Technology Evaluation', category: 'Procurement' },
  { id: 'technology-budget-proposal', name: 'Technology Budget Proposal', category: 'Financial' },
  { id: 'data-governance-strategy', name: 'Data Governance Strategy', category: 'Data Management' },
  { id: 'cloud-strategy-document', name: 'Cloud Strategy Document', category: 'Cloud Computing' },
  { id: 'technology-compliance-framework', name: 'Technology Compliance Framework', category: 'Compliance' },
  { id: 'technology-standards-document', name: 'Technology Standards Document', category: 'Standards' },
  { id: 'technology-investment-plan', name: 'Technology Investment Plan', category: 'Investment' },
  { id: 'technology-performance-metrics', name: 'Technology Performance Metrics', category: 'Metrics' },
  { id: 'research-development-plan', name: 'Research & Development Plan', category: 'R&D' },
  { id: 'technology-training-plan', name: 'Technology Training Plan', category: 'Training' },
  { id: 'ai-ml-strategy', name: 'AI/ML Implementation Strategy', category: 'Artificial Intelligence' },
  { id: 'cybersecurity-technology-plan', name: 'Cybersecurity Technology Plan', category: 'Security' },
  { id: 'technology-scalability-plan', name: 'Technology Scalability Plan', category: 'Scalability' }
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

const TECHNOLOGY_FOCUS_AREAS = [
  { value: 'cloud-first', label: 'Cloud-First Strategy' },
  { value: 'ai-ml', label: 'AI/Machine Learning' },
  { value: 'digital-transformation', label: 'Digital Transformation' },
  { value: 'data-analytics', label: 'Data Analytics' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'mobile-first', label: 'Mobile-First Approach' },
  { value: 'automation', label: 'Process Automation' },
  { value: 'innovation', label: 'Innovation & R&D' }
];

export default function CTODocumentGenerator({}: CTODocumentGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [formData, setFormData] = useState({
    documentType: '',
    companyName: '',
    companySize: '',
    industry: '',
    technologyFocus: [] as string[],
    currentTechStack: '',
    strategicGoals: '',
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
      const selectedDocument = CTO_DOCUMENT_TYPES.find(d => d.id === formData.documentType);
      const simulatedDocument = generateMockCTODocument(selectedDocument?.name || '', formData);
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

  const generateMockCTODocument = (documentName: string, data: any) => {
    return `# ${documentName}
## ${data.companyName}

### Executive Summary
This ${documentName.toLowerCase()} provides strategic technology direction and implementation guidance for ${data.companyName}'s digital future and competitive advantage.

### 1. Strategic Vision
This document establishes the technology vision, roadmap, and strategic initiatives that will drive ${data.companyName} towards its business objectives through innovative technology solutions.

**Organization Profile:**
- Company: ${data.companyName}
- Industry: ${data.industry || 'Not specified'}
- Size: ${data.companySize || 'Not specified'}
- Budget Allocation: ${data.budget || 'To be determined'}

### 2. Current Technology Landscape
**Existing Technology Stack:**
${data.currentTechStack || 'Comprehensive assessment to be conducted of current technology infrastructure, applications, and platforms.'}

### 3. Strategic Technology Objectives
- Drive digital transformation and innovation initiatives
- Enhance operational efficiency through technology automation
- Ensure scalable and future-ready technology architecture
- Optimize technology investments and ROI
- Foster a culture of innovation and continuous improvement
- Maintain competitive advantage through technology leadership

### 4. Technology Focus Areas
**Strategic Technology Priorities:**
${data.technologyFocus.length > 0 ? data.technologyFocus.join(', ') : 'Technology focus areas to be defined based on business strategy and market opportunities'}

**Key Technology Initiatives:**
- Cloud-native architecture and infrastructure modernization
- Data-driven decision making and analytics capabilities
- Artificial intelligence and machine learning integration
- Cybersecurity and risk management enhancement
- Digital customer experience optimization
- Process automation and operational excellence

### 5. Strategic Goals and Outcomes
**Primary Strategic Goals:**
${data.strategicGoals || 'Strategic technology goals will be aligned with business objectives to deliver measurable value and competitive advantage.'}

**Expected Outcomes:**
- Increased operational efficiency and productivity
- Enhanced customer experience and satisfaction
- Accelerated innovation and time-to-market
- Improved data insights and decision making
- Strengthened cybersecurity and compliance posture
- Optimized technology costs and resource utilization

### 6. Implementation Roadmap
**Timeline:** ${data.timeline || 'Multi-phase implementation approach spanning 12-24 months'}

**Phase 1: Foundation (Months 1-6)**
- Technology assessment and gap analysis
- Architecture design and planning
- Infrastructure modernization initiation
- Team capability development

**Phase 2: Implementation (Months 7-12)**
- Core technology platform deployment
- Application migration and integration
- Process automation implementation
- Security enhancement measures

**Phase 3: Optimization (Months 13-18)**
- Performance tuning and optimization
- Advanced analytics and AI integration
- User training and adoption programs
- Continuous improvement processes

**Phase 4: Innovation (Months 19-24)**
- Emerging technology evaluation and adoption
- Innovation lab establishment
- Strategic partnership development
- Future technology roadmap refinement

### 7. Technology Investment Strategy
**Budget Allocation:**
- Infrastructure and Platform: 40%
- Application Development and Integration: 25%
- Data and Analytics: 15%
- Cybersecurity and Compliance: 10%
- Innovation and R&D: 10%

**ROI Expectations:**
- Operational cost reduction: 15-20%
- Productivity improvement: 25-30%
- Customer satisfaction increase: 20%
- Time-to-market acceleration: 30%

### 8. Risk Management and Governance
**Technology Risks:**
- Legacy system integration challenges
- Cybersecurity threats and vulnerabilities
- Skill gaps and talent acquisition
- Technology obsolescence and vendor dependencies

**Governance Framework:**
- Technology steering committee establishment
- Architecture review board processes
- Investment approval workflows
- Performance monitoring and reporting

### 9. Success Metrics and KPIs
**Technology Performance Indicators:**
- System availability and performance metrics
- User adoption and satisfaction rates
- Innovation project success rates
- Technology cost optimization achievements
- Security incident reduction
- Business value delivery measurements

### 10. Future Technology Vision
**Emerging Technologies:**
- Artificial Intelligence and Machine Learning
- Internet of Things (IoT) and Edge Computing
- Blockchain and Distributed Ledger Technologies
- Quantum Computing and Advanced Analytics
- Extended Reality (AR/VR/MR)
- Sustainable and Green Technology Solutions

### 11. Conclusion and Next Steps
This technology strategy provides the foundation for ${data.companyName}'s digital transformation journey and long-term technology success.

**Immediate Next Steps:**
1. Stakeholder alignment and strategy approval
2. Detailed implementation planning and resource allocation
3. Technology partner and vendor evaluation
4. Team formation and capability development
5. Implementation kickoff and progress monitoring

---
**Additional Context:**
${data.additionalContext || 'This strategic document should be reviewed quarterly and updated annually to ensure alignment with evolving business needs and technology landscape.'}

*Strategic Technology Document for ${data.companyName} - ${data.industry} Industry*
*Document Type: ${documentName}*
*Technology Focus: ${data.technologyFocus.join(', ') || 'Comprehensive Technology Strategy'}*
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
              <Rocket className="w-5 h-5" />
              CTO Strategy Configuration
            </CardTitle>
            <CardDescription>
              Configure your organization details for AI-powered CTO document generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Document Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={formData.documentType} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, documentType: value }))
              }>
                <SelectTrigger data-testid="select-cto-document-type">
                  <SelectValue placeholder="Select CTO document type to generate" />
                </SelectTrigger>
                <SelectContent>
                  {CTO_DOCUMENT_TYPES.map((document) => (
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
                data-testid="input-cto-company-name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-size">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, companySize: value }))
                }>
                  <SelectTrigger data-testid="select-cto-company-size">
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
                  <SelectTrigger data-testid="select-cto-industry">
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

            {/* Technology Focus Areas */}
            <div className="space-y-2">
              <Label>Technology Focus Areas</Label>
              <div className="grid grid-cols-1 gap-2">
                {TECHNOLOGY_FOCUS_AREAS.map((focus) => (
                  <div key={focus.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={focus.value}
                      checked={formData.technologyFocus.includes(focus.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            technologyFocus: [...prev.technologyFocus, focus.value]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            technologyFocus: prev.technologyFocus.filter(f => f !== focus.value)
                          }));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={focus.value} className="text-sm">
                      {focus.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Tech Stack */}
            <div className="space-y-2">
              <Label htmlFor="current-tech-stack">Current Technology Stack</Label>
              <Textarea
                id="current-tech-stack"
                placeholder="Describe your current technology infrastructure..."
                value={formData.currentTechStack}
                onChange={(e) => setFormData(prev => ({ ...prev, currentTechStack: e.target.value }))}
                data-testid="textarea-cto-tech-stack"
              />
            </div>

            {/* Strategic Goals */}
            <div className="space-y-2">
              <Label htmlFor="strategic-goals">Strategic Goals</Label>
              <Textarea
                id="strategic-goals"
                placeholder="Define your strategic technology goals..."
                value={formData.strategicGoals}
                onChange={(e) => setFormData(prev => ({ ...prev, strategicGoals: e.target.value }))}
                data-testid="textarea-cto-strategic-goals"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $500,000 - $1,000,000"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  data-testid="input-cto-budget"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  placeholder="e.g., 18 months"
                  value={formData.timeline}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  data-testid="input-cto-timeline"
                />
              </div>
            </div>

            {/* Additional Context */}
            <div className="space-y-2">
              <Label htmlFor="context">Additional Context</Label>
              <Textarea
                id="context"
                placeholder="Any additional strategic context or considerations..."
                value={formData.additionalContext}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalContext: e.target.value }))}
                data-testid="textarea-cto-context"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerateDocument}
              disabled={isGenerating || !formData.documentType || !formData.companyName}
              className="w-full"
              data-testid="button-generate-cto-document"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate CTO Document
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
              Review and download your AI-generated CTO document
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
                <p className="text-sm">Complete the configuration and click "Generate CTO Document"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}