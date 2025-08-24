import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Eye, 
  Edit3,
  Copy,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Shield
} from "lucide-react";
import { ncaEccStructure } from "@shared/schema";

interface PolicyTemplate {
  id: string;
  name: string;
  domain: string;
  content: string;
  version: string;
  lastModified: string;
  status: "draft" | "approved" | "under_review";
}

interface PolicyTemplatesProps {
  domainName?: string;
  onTemplateSelect?: (template: PolicyTemplate) => void;
}

const generatePolicyTemplate = (policyName: string, domainName: string): string => {
  const domainData = ncaEccStructure[domainName as keyof typeof ncaEccStructure] as any;
  
  return `# ${policyName}

## 1. Purpose and Scope

This policy establishes the framework for ${policyName.toLowerCase()} within the organization to ensure compliance with the National Cybersecurity Authority Essential Cybersecurity Controls (NCA ECC) requirements for the ${domainName} domain.

### 1.1 Scope
This policy applies to all personnel, systems, and processes within the organization.

### 1.2 Objectives
- Establish clear requirements for ${domainName.toLowerCase()}
- Ensure compliance with NCA ECC standards
- Define roles and responsibilities
- Provide implementation guidelines

## 2. Policy Statements

### 2.1 General Requirements
${domainData.requirements.map((req: string, index: number) => 
  `2.1.${index + 1} ${req}`
).join('\n')}

### 2.2 Implementation Requirements
The organization shall implement the following controls:
${domainData.workflow.map((step: string, index: number) => 
  `- ${step}`
).join('\n')}

## 3. Roles and Responsibilities

### 3.1 Senior Management
- Provide oversight and approval for this policy
- Ensure adequate resources are allocated
- Review policy effectiveness annually

### 3.2 Cybersecurity Officer
- Oversee policy implementation
- Conduct regular compliance assessments
- Report on policy effectiveness

### 3.3 IT Department
- Implement technical controls
- Maintain system configurations
- Provide technical support

### 3.4 All Personnel
- Comply with policy requirements
- Report security incidents
- Participate in training programs

## 4. Implementation Guidelines

### 4.1 Workflow Process
${domainData.workflow.map((step: string, index: number) => 
  `${index + 1}. ${step}`
).join('\n')}

### 4.2 Control Measures
This policy shall be implemented through the following measures:
- Regular risk assessments
- Documented procedures and work instructions
- Training and awareness programs
- Monitoring and compliance checks
- Incident response procedures

## 5. Compliance and Monitoring

### 5.1 Compliance Requirements
- All activities must comply with NCA ECC requirements
- Regular audits and assessments shall be conducted
- Non-compliance issues must be documented and addressed

### 5.2 Monitoring and Review
- Policy effectiveness shall be reviewed annually
- Compliance metrics shall be tracked and reported
- Updates shall be made as necessary to maintain effectiveness

## 6. Related Policies and Procedures

This policy should be read in conjunction with:
${domainData.policies.filter((p: string) => p !== policyName).map((policy: string) => 
  `- ${policy}`
).join('\n')}

## 7. Policy Management

### 7.1 Review and Approval
- Annual review by Cybersecurity Officer
- Approval by Senior Management
- Version control and change management

### 7.2 Training and Communication
- Policy awareness training for all personnel
- Regular communication of updates
- Accessible policy repository

## 8. Enforcement

Violations of this policy may result in disciplinary action up to and including termination of employment or contract, civil action, and criminal prosecution.

---

**Document Information:**
- Version: 1.0
- Effective Date: [Date]
- Next Review Date: [Date + 1 Year]
- Owner: Cybersecurity Officer
- Approved By: [Name], [Title]
`;
};

const mockPolicyTemplates: PolicyTemplate[] = [
  {
    id: "cyb-gov-001",
    name: "Cybersecurity Governance Policy",
    domain: "Cybersecurity Governance & Strategy",
    content: "",
    version: "1.0",
    lastModified: "2024-01-15",
    status: "approved"
  },
  {
    id: "risk-mgmt-001", 
    name: "Risk Management Policy",
    domain: "Risk Management",
    content: "",
    version: "1.0",
    lastModified: "2024-01-15",
    status: "draft"
  }
];

export default function PolicyTemplates({ domainName, onTemplateSelect }: PolicyTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PolicyTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [generatingTemplates, setGeneratingTemplates] = useState<string[]>([]);

  const generateTemplate = async (policyName: string, domain: string) => {
    setGeneratingTemplates(prev => [...prev, policyName]);
    
    // Simulate generation delay
    setTimeout(() => {
      const content = generatePolicyTemplate(policyName, domain);
      const template: PolicyTemplate = {
        id: `${domain.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        name: policyName,
        domain,
        content,
        version: "1.0",
        lastModified: new Date().toISOString().split('T')[0],
        status: "draft"
      };
      
      setSelectedTemplate(template);
      setEditedContent(content);
      setGeneratingTemplates(prev => prev.filter(p => p !== policyName));
    }, 2000);
  };

  const handleEdit = () => {
    if (selectedTemplate) {
      setEditedContent(selectedTemplate.content);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        content: editedContent,
        lastModified: new Date().toISOString().split('T')[0],
        status: "under_review" as const
      };
      setSelectedTemplate(updatedTemplate);
      setIsEditing(false);
    }
  };

  const handleDownload = () => {
    if (selectedTemplate) {
      const content = isEditing ? editedContent : selectedTemplate.content;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate.name.replace(/\s+/g, '_')}_v${selectedTemplate.version}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopy = async () => {
    if (selectedTemplate) {
      const content = isEditing ? editedContent : selectedTemplate.content;
      await navigator.clipboard.writeText(content);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-600 bg-green-100";
      case "under_review": return "text-yellow-600 bg-yellow-100";
      case "draft": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return CheckCircle2;
      case "under_review": return AlertTriangle;
      case "draft": return Edit3;
      default: return FileText;
    }
  };

  if (selectedTemplate) {
    const StatusIcon = getStatusIcon(selectedTemplate.status);

    return (
      <div className="space-y-6" data-testid="policy-template-editor">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedTemplate.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {selectedTemplate.domain} • Version {selectedTemplate.version}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedTemplate.status)}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {selectedTemplate.status.replace('_', ' ')}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(null)}>
                  Back to Templates
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {isEditing ? "Edit Template" : "Template Content"}
                  </CardTitle>
                  <div className="flex gap-2">
                    {!isEditing && (
                      <Button size="sm" variant="outline" onClick={handleEdit}>
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    {isEditing && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isEditing ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[600px] border-0 resize-none font-mono text-sm"
                    placeholder="Edit your policy template..."
                  />
                ) : (
                  <div className="p-6 max-h-[600px] overflow-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {selectedTemplate.content}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Template Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleDownload} className="w-full" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={handleCopy} variant="outline" className="w-full" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Template Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <Label className="text-muted-foreground">Domain</Label>
                  <p className="font-medium">{selectedTemplate.domain}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Modified</Label>
                  <p className="font-medium">{selectedTemplate.lastModified}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge size="sm" className={getStatusColor(selectedTemplate.status)}>
                    {selectedTemplate.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const domainsToShow = domainName ? [domainName] : Object.keys(ncaEccStructure);

  return (
    <div className="space-y-6" data-testid="policy-templates">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Policy Templates
          </CardTitle>
          <CardDescription>
            Generate and customize policy templates for NCA ECC compliance
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {domainsToShow.map((domain) => {
          const domainData = ncaEccStructure[domain as keyof typeof ncaEccStructure] as any;
          
          return (
            <Card key={domain}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {domain}
                </CardTitle>
                <CardDescription>
                  {domainData.policies.length} policy templates available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domainData.policies.map((policyName: string, index: number) => (
                    <Card key={index} className="border border-muted">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{policyName}</h4>
                              <p className="text-xs text-muted-foreground">
                                Template for {domain.toLowerCase()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => generateTemplate(policyName, domain)}
                              disabled={generatingTemplates.includes(policyName)}
                              className="flex-1"
                            >
                              {generatingTemplates.includes(policyName) ? (
                                <>
                                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Generate
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}