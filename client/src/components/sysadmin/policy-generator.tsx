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
import { Loader2, Download, FileText, Wand2, Monitor, Server, Database } from "lucide-react";

interface SysAdminDocumentGeneratorProps {}

const SYSADMIN_DOCUMENT_TYPES = [
  { id: 'system-maintenance-procedures', name: 'System Maintenance Procedures', category: 'Maintenance' },
  { id: 'backup-recovery-procedures', name: 'Backup and Recovery Procedures', category: 'Data Protection' },
  { id: 'system-monitoring-procedures', name: 'System Monitoring Procedures', category: 'Monitoring' },
  { id: 'user-account-management-policy', name: 'User Account Management Policy', category: 'Access Control' },
  { id: 'system-security-configuration', name: 'System Security Configuration Standards', category: 'Security' },
  { id: 'patch-management-procedures', name: 'Patch Management Procedures', category: 'Security' },
  { id: 'system-performance-monitoring', name: 'System Performance Monitoring Guidelines', category: 'Performance' },
  { id: 'database-administration-procedures', name: 'Database Administration Procedures', category: 'Database' },
  { id: 'network-administration-procedures', name: 'Network Administration Procedures', category: 'Network' },
  { id: 'server-administration-procedures', name: 'Server Administration Procedures', category: 'Infrastructure' },
  { id: 'system-documentation-standards', name: 'System Documentation Standards', category: 'Documentation' },
  { id: 'change-management-procedures', name: 'Change Management Procedures', category: 'Change Control' },
  { id: 'system-troubleshooting-procedures', name: 'System Troubleshooting Procedures', category: 'Support' },
  { id: 'system-capacity-planning', name: 'System Capacity Planning', category: 'Planning' },
  { id: 'system-audit-procedures', name: 'System Audit Procedures', category: 'Compliance' },
  { id: 'incident-response-procedures', name: 'Incident Response Procedures', category: 'Incident Management' },
  { id: 'disaster-recovery-procedures', name: 'Disaster Recovery Procedures', category: 'Business Continuity' },
  { id: 'system-configuration-management', name: 'System Configuration Management', category: 'Configuration' }
];

const SYSTEM_ENVIRONMENTS = [
  { value: 'windows', label: 'Windows Server Environment' },
  { value: 'linux', label: 'Linux/Unix Environment' },
  { value: 'hybrid', label: 'Hybrid Windows/Linux' },
  { value: 'cloud', label: 'Cloud-based Infrastructure' },
  { value: 'virtualized', label: 'Virtualized Environment' },
  { value: 'containerized', label: 'Containerized Infrastructure' }
];

const COMPANY_SIZES = [
  { value: 'small', label: 'Small Business (1-100 employees)' },
  { value: 'medium', label: 'Medium Business (101-500 employees)' },
  { value: 'large', label: 'Large Enterprise (500+ employees)' }
];

const COMPLIANCE_FRAMEWORKS = [
  { value: 'iso27001', label: 'ISO 27001' },
  { value: 'nist', label: 'NIST Cybersecurity Framework' },
  { value: 'pci-dss', label: 'PCI DSS' },
  { value: 'hipaa', label: 'HIPAA' },
  { value: 'gdpr', label: 'GDPR' },
  { value: 'sox', label: 'SOX' },
  { value: 'cobit', label: 'COBIT' }
];

const SYSTEM_TECHNOLOGIES = [
  { value: 'active-directory', label: 'Active Directory' },
  { value: 'vmware', label: 'VMware Infrastructure' },
  { value: 'aws', label: 'Amazon Web Services' },
  { value: 'azure', label: 'Microsoft Azure' },
  { value: 'google-cloud', label: 'Google Cloud Platform' },
  { value: 'docker', label: 'Docker/Containers' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'ansible', label: 'Ansible Automation' }
];

export default function SysAdminDocumentGenerator({}: SysAdminDocumentGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [formData, setFormData] = useState({
    documentType: '',
    companyName: '',
    companySize: '',
    systemEnvironment: '',
    complianceFrameworks: [] as string[],
    systemTechnologies: [] as string[],
    currentSystems: '',
    specificRequirements: '',
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
      const selectedDocument = SYSADMIN_DOCUMENT_TYPES.find(d => d.id === formData.documentType);
      const simulatedDocument = generateMockSysAdminDocument(selectedDocument?.name || '', formData);
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

  const generateMockSysAdminDocument = (documentName: string, data: any) => {
    return `# ${documentName}
## ${data.companyName}

### Document Information
**Document Type:** ${documentName}
**Organization:** ${data.companyName}
**Environment:** ${data.systemEnvironment || 'Multi-platform environment'}
**Company Size:** ${data.companySize || 'Not specified'}
**Effective Date:** ${new Date().toLocaleDateString()}

### 1. Purpose and Scope
This document provides comprehensive procedures and guidelines for ${documentName.toLowerCase()} within ${data.companyName}'s IT infrastructure, ensuring consistent, secure, and efficient system operations.

**Scope:**
- Applies to all system administrators and IT operations personnel
- Covers all production, staging, and development environments
- Includes all critical systems and infrastructure components
- Ensures compliance with organizational policies and industry standards

### 2. System Environment Overview
**Current System Environment:**
${data.currentSystems || 'This section will be populated based on the current system infrastructure assessment and technology stack.'}

**Technology Stack:**
${data.systemTechnologies.length > 0 ? data.systemTechnologies.join(', ') : 'Technology stack to be documented based on current infrastructure'}

**Environment Type:** ${data.systemEnvironment || 'Multi-platform environment'}

### 3. Roles and Responsibilities
**System Administrator:**
- Primary responsibility for system maintenance and operations
- Execute procedures according to documented standards
- Monitor system performance and availability
- Respond to incidents and troubleshoot issues

**IT Operations Team:**
- Support system administrator activities
- Escalate issues as defined in procedures
- Maintain documentation and logs
- Participate in change management processes

**IT Manager:**
- Approve major system changes and procedures
- Review and update operational procedures
- Ensure compliance with organizational policies
- Manage resource allocation and scheduling

### 4. Detailed Procedures

#### 4.1 Pre-Implementation Requirements
- System backup verification completed
- Change management approval obtained
- Required tools and access permissions confirmed
- Rollback procedures defined and tested
- Notification to stakeholders completed

#### 4.2 Step-by-Step Implementation
**Phase 1: Preparation**
1. Review current system state and requirements
2. Verify all prerequisites are met
3. Prepare necessary tools and scripts
4. Document current configuration baseline
5. Coordinate with relevant teams

**Phase 2: Execution**
1. Execute procedures according to documented steps
2. Monitor system performance during implementation
3. Validate each step completion before proceeding
4. Document any deviations or issues encountered
5. Perform intermediate testing as required

**Phase 3: Verification**
1. Conduct comprehensive system testing
2. Verify all functionality is working as expected
3. Check system performance metrics
4. Validate security configurations
5. Update system documentation

#### 4.3 Post-Implementation Activities
- Complete implementation documentation
- Update system monitoring configurations
- Notify stakeholders of completion
- Schedule follow-up reviews
- Archive implementation logs and documentation

### 5. Security Considerations
**Access Control:**
- Implement least privilege access principles
- Use secure authentication methods
- Log all administrative activities
- Regular access review and validation

**Data Protection:**
- Encrypt sensitive data in transit and at rest
- Implement secure backup procedures
- Follow data retention policies
- Ensure compliance with privacy regulations

**Security Monitoring:**
- Continuous monitoring of system activities
- Automated alerting for security events
- Regular security assessments and audits
- Incident response procedures activation

### 6. Compliance and Standards
**Compliance Frameworks:**
${data.complianceFrameworks.length > 0 ? data.complianceFrameworks.join(', ') : 'Industry standard compliance frameworks will be applied based on organizational requirements'}

**Standards Adherence:**
- Follow industry best practices and standards
- Maintain compliance with regulatory requirements
- Regular compliance assessments and reporting
- Continuous improvement based on audit findings

### 7. Monitoring and Alerting
**System Monitoring:**
- 24/7 system availability monitoring
- Performance metrics tracking and analysis
- Capacity utilization monitoring
- Automated alerting for threshold breaches

**Alerting Procedures:**
- Immediate notification for critical events
- Escalation procedures for unresolved issues
- Documentation of all alerts and responses
- Regular review and tuning of alert thresholds

### 8. Troubleshooting and Support
**Common Issues and Solutions:**
- System performance degradation
- Service availability problems
- Configuration conflicts
- Security incidents and responses

**Escalation Procedures:**
- Level 1: System Administrator initial response
- Level 2: Senior System Administrator involvement
- Level 3: Vendor support and external resources
- Level 4: Emergency response team activation

### 9. Documentation and Reporting
**Required Documentation:**
- Detailed procedure execution logs
- System configuration changes
- Performance metrics and analysis
- Incident reports and resolutions

**Reporting Requirements:**
- Weekly operational status reports
- Monthly performance and capacity reports
- Quarterly security and compliance reports
- Annual procedure review and update reports

### 10. Training and Competency
**Required Training:**
- System administration fundamentals
- Security awareness and procedures
- Emergency response and incident handling
- Specific technology and tool training

**Competency Requirements:**
- Technical certification requirements
- Regular skill assessment and validation
- Continuous learning and development
- Cross-training on critical systems

### 11. Emergency Procedures
**Emergency Response:**
- Immediate incident response procedures
- Emergency contact information
- Escalation and communication protocols
- Business continuity and disaster recovery activation

**Recovery Procedures:**
- System restoration from backups
- Alternative system activation
- Data recovery and validation
- Service restoration and testing

### 12. Change Management
**Change Control Process:**
- Change request submission and approval
- Impact assessment and risk evaluation
- Implementation planning and scheduling
- Testing and validation requirements
- Rollback procedures and criteria

### 13. Quality Assurance
**Quality Control Measures:**
- Peer review of critical procedures
- Testing in non-production environments
- Validation of procedure effectiveness
- Continuous improvement processes

### 14. Review and Maintenance
**Regular Reviews:**
- Monthly procedure effectiveness review
- Quarterly documentation updates
- Annual comprehensive procedure audit
- Continuous improvement implementation

**Maintenance Schedule:**
- Weekly routine maintenance tasks
- Monthly preventive maintenance
- Quarterly system health assessments
- Annual infrastructure reviews

### 15. Specific Requirements and Considerations
**Specific Requirements:**
${data.specificRequirements || 'Specific requirements will be defined based on organizational needs and system characteristics.'}

**Implementation Timeline:**
${data.timeline || 'Implementation timeline will be established based on complexity and resource availability.'}

### 16. Appendices
**A. Contact Information**
- Emergency contact numbers
- Vendor support contacts
- Internal escalation contacts
- External service provider contacts

**B. Reference Materials**
- Related policies and procedures
- System documentation links
- Technical specifications
- Compliance requirements

**C. Forms and Templates**
- Change request forms
- Incident report templates
- Maintenance checklists
- Documentation templates

---
**Additional Context and Notes:**
${data.additionalContext || 'This document should be reviewed and updated regularly to ensure accuracy and effectiveness. All procedures should be tested in non-production environments before implementation.'}

*System Administration Document for ${data.companyName}*
*Document Type: ${documentName}*
*Environment: ${data.systemEnvironment || 'Multi-platform'}*
*Compliance: ${data.complianceFrameworks.join(', ') || 'Industry Standards'}*

**Document Control:**
- Version: 1.0
- Created: ${new Date().toLocaleDateString()}
- Review Date: ${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Approved By: IT Manager
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
              <Monitor className="w-5 h-5" />
              System Administration Configuration
            </CardTitle>
            <CardDescription>
              Configure your system environment for AI-powered documentation generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Document Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={formData.documentType} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, documentType: value }))
              }>
                <SelectTrigger data-testid="select-sysadmin-document-type">
                  <SelectValue placeholder="Select system administration document type" />
                </SelectTrigger>
                <SelectContent>
                  {SYSADMIN_DOCUMENT_TYPES.map((document) => (
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
                data-testid="input-sysadmin-company-name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-size">Company Size</Label>
                <Select value={formData.companySize} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, companySize: value }))
                }>
                  <SelectTrigger data-testid="select-sysadmin-company-size">
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
                <Label htmlFor="system-environment">System Environment</Label>
                <Select value={formData.systemEnvironment} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, systemEnvironment: value }))
                }>
                  <SelectTrigger data-testid="select-sysadmin-environment">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEM_ENVIRONMENTS.map((env) => (
                      <SelectItem key={env.value} value={env.value}>
                        {env.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Compliance Frameworks */}
            <div className="space-y-2">
              <Label>Compliance Frameworks</Label>
              <div className="grid grid-cols-1 gap-2">
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

            {/* System Technologies */}
            <div className="space-y-2">
              <Label>System Technologies</Label>
              <div className="grid grid-cols-1 gap-2">
                {SYSTEM_TECHNOLOGIES.map((tech) => (
                  <div key={tech.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={tech.value}
                      checked={formData.systemTechnologies.includes(tech.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            systemTechnologies: [...prev.systemTechnologies, tech.value]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            systemTechnologies: prev.systemTechnologies.filter(t => t !== tech.value)
                          }));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={tech.value} className="text-sm">
                      {tech.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Systems */}
            <div className="space-y-2">
              <Label htmlFor="current-systems">Current Systems</Label>
              <Textarea
                id="current-systems"
                placeholder="Describe your current system infrastructure..."
                value={formData.currentSystems}
                onChange={(e) => setFormData(prev => ({ ...prev, currentSystems: e.target.value }))}
                data-testid="textarea-sysadmin-systems"
              />
            </div>

            {/* Specific Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">Specific Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="Enter any specific operational requirements..."
                value={formData.specificRequirements}
                onChange={(e) => setFormData(prev => ({ ...prev, specificRequirements: e.target.value }))}
                data-testid="textarea-sysadmin-requirements"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Implementation Timeline</Label>
              <Input
                id="timeline"
                placeholder="e.g., 30 days"
                value={formData.timeline}
                onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                data-testid="input-sysadmin-timeline"
              />
            </div>

            {/* Additional Context */}
            <div className="space-y-2">
              <Label htmlFor="context">Additional Context</Label>
              <Textarea
                id="context"
                placeholder="Any additional operational context or considerations..."
                value={formData.additionalContext}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalContext: e.target.value }))}
                data-testid="textarea-sysadmin-context"
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerateDocument}
              disabled={isGenerating || !formData.documentType || !formData.companyName}
              className="w-full"
              data-testid="button-generate-sysadmin-document"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate System Admin Document
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
              Review and download your AI-generated system administration document
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
                <p className="text-sm">Complete the configuration and click "Generate System Admin Document"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}