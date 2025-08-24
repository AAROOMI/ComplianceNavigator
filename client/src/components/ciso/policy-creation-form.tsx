import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  FileText, 
  Calendar, 
  Users, 
  Star, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Save,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cisoPolicyTypes, cisoPolicyCategories } from "@shared/schema";

const policyFormSchema = z.object({
  policyType: z.string().min(1, "Policy type is required"),
  category: z.string().min(1, "Category is required"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  owner: z.string().min(1, "Owner is required"),
  reviewDate: z.string().min(1, "Review date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  tags: z.string().optional(),
});

type PolicyFormData = z.infer<typeof policyFormSchema>;

interface PolicyCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate?: string;
  onPolicyCreated?: (policy: any) => void;
}

// Policy templates with content
const policyTemplates = {
  "Information Security Policy": {
    description: "Comprehensive information security policy framework",
    sections: ["Purpose", "Scope", "Roles & Responsibilities", "Policy Statements", "Compliance", "Review"],
    template: `# Information Security Policy

## 1. Purpose
This policy establishes the framework for information security within [Organization Name] to protect information assets and maintain confidentiality, integrity, and availability of data.

## 2. Scope
This policy applies to all employees, contractors, and third parties who have access to [Organization Name] information systems and data.

## 3. Roles and Responsibilities
### 3.1 Chief Information Security Officer (CISO)
- Overall responsibility for information security program
- Policy development and maintenance
- Security incident response oversight

### 3.2 Information Security Team
- Implementation of security controls
- Security monitoring and assessment
- User training and awareness

### 3.3 All Users
- Compliance with security policies
- Reporting security incidents
- Protecting assigned credentials

## 4. Policy Statements
### 4.1 Access Control
- Access to information systems must be authorized and documented
- User accounts must be provisioned based on business need
- Regular access reviews must be conducted

### 4.2 Data Classification
- All data must be classified according to sensitivity levels
- Appropriate protection measures must be applied based on classification
- Data handling procedures must be followed

### 4.3 Incident Response
- Security incidents must be reported immediately
- Incident response procedures must be followed
- Post-incident reviews must be conducted

## 5. Compliance
Violations of this policy may result in disciplinary action up to and including termination of employment.

## 6. Policy Review
This policy will be reviewed annually or as needed to ensure continued effectiveness.`,
    requiredFields: ["organization_name", "ciso_name", "contact_information"]
  },
  
  "Incident Response Plan": {
    description: "Detailed procedures for cybersecurity incident response",
    sections: ["Preparation", "Detection", "Analysis", "Containment", "Eradication", "Recovery", "Lessons Learned"],
    template: `# Cybersecurity Incident Response Plan

## 1. Executive Summary
This document outlines the procedures for detecting, responding to, and recovering from cybersecurity incidents at [Organization Name].

## 2. Incident Response Team
### 2.1 Team Structure
- **Incident Commander**: [Name/Role]
- **Security Analyst**: [Name/Role]
- **IT Operations**: [Name/Role]
- **Legal Counsel**: [Name/Role]
- **Communications**: [Name/Role]

### 2.2 Contact Information
[Emergency Contact Details]

## 3. Incident Classification
### 3.1 Severity Levels
- **Critical**: System compromise affecting critical business operations
- **High**: Significant security breach with potential data loss
- **Medium**: Security incident with limited impact
- **Low**: Minor security event requiring investigation

## 4. Response Procedures
### 4.1 Detection and Analysis
1. Incident identification through monitoring systems
2. Initial triage and severity assessment
3. Evidence collection and preservation
4. Impact analysis

### 4.2 Containment
1. Immediate containment actions
2. System isolation if necessary
3. Threat neutralization
4. Short-term containment measures

### 4.3 Eradication and Recovery
1. Remove threat components
2. Patch vulnerabilities
3. System restoration from clean backups
4. Service restoration and monitoring

## 5. Communication Plan
### 5.1 Internal Communications
- Immediate notification to incident response team
- Executive briefings for critical incidents
- Regular status updates during response

### 5.2 External Communications
- Law enforcement notification if required
- Regulatory reporting as mandated
- Customer/public communications if applicable

## 6. Post-Incident Activities
- Lessons learned session
- Process improvement recommendations
- Documentation updates
- Training updates`,
    requiredFields: ["organization_name", "incident_commander", "emergency_contacts"]
  },

  "Access Control Policy": {
    description: "Policy governing user access management and authorization",
    sections: ["Access Management", "Authentication", "Authorization", "Monitoring", "Review"],
    template: `# Access Control Policy

## 1. Purpose
To establish consistent access control standards that protect [Organization Name] information systems and data from unauthorized access.

## 2. Scope
This policy applies to all information systems, applications, and data repositories within [Organization Name].

## 3. Access Control Principles
### 3.1 Least Privilege
Users shall be granted the minimum level of access necessary to perform their job functions.

### 3.2 Need-to-Know
Access to sensitive information shall be granted only to those with a legitimate business need.

### 3.3 Segregation of Duties
Critical functions shall be divided among multiple individuals to prevent fraud and errors.

## 4. User Access Management
### 4.1 Account Provisioning
- New user accounts require manager approval
- Access requests must specify business justification
- Temporary accounts have defined expiration dates

### 4.2 Account Modification
- Access changes require appropriate authorization
- Role changes trigger access review
- Emergency access procedures are documented

### 4.3 Account Termination
- User accounts are disabled upon termination
- Access is removed within 24 hours
- Shared account passwords are changed

## 5. Authentication Requirements
### 5.1 Password Standards
- Minimum 12 characters in length
- Combination of uppercase, lowercase, numbers, symbols
- Regular password changes required

### 5.2 Multi-Factor Authentication
- Required for privileged accounts
- Required for remote access
- Required for sensitive systems

## 6. Privileged Access Management
### 6.1 Administrative Accounts
- Separate from regular user accounts
- Enhanced monitoring and logging
- Regular review and certification

### 6.2 Service Accounts
- Documented business purpose
- Strong authentication credentials
- Regular password rotation

## 7. Access Review and Monitoring
### 7.1 Regular Reviews
- Quarterly access reviews by data owners
- Annual comprehensive access certification
- Immediate review upon role changes

### 7.2 Monitoring and Alerting
- Failed login attempt monitoring
- Privileged account activity logging
- Unusual access pattern detection`,
    requiredFields: ["organization_name", "access_administrator", "review_frequency"]
  },

  "Network Architecture Plan": {
    description: "Comprehensive network design and architecture documentation",
    sections: ["Network Design", "Infrastructure Components", "Security Architecture", "Performance Requirements", "Implementation Plan"],
    template: `# Network Architecture Plan

## 1. Executive Summary
This Network Architecture Plan provides a comprehensive design for [Organization Name]'s network infrastructure to support current and future business requirements.

## 2. Network Design Overview
### 2.1 Design Principles
- Scalability and flexibility for future growth
- High availability and redundancy
- Security-first approach with defense in depth
- Performance optimization and traffic management

### 2.2 Network Topology
- Core-distribution-access layer design
- Redundant links and failover mechanisms
- Logical network segmentation for security and performance

## 3. Infrastructure Components
### 3.1 Core Network Equipment
- Core switches and routers specifications
- Distribution layer equipment requirements
- Access layer switch configurations

### 3.2 Network Services
- DHCP and DNS services architecture
- Network time protocol (NTP) implementation
- Network monitoring and management systems

## 4. Security Architecture
### 4.1 Network Segmentation
- VLAN design and implementation
- DMZ configuration for external services
- Internal network isolation strategies

### 4.2 Security Controls
- Firewall placement and rule sets
- Intrusion detection and prevention systems
- Network access control (NAC) implementation

## 5. Performance and Capacity Planning
### 5.1 Bandwidth Requirements
- Current and projected bandwidth needs
- Quality of Service (QoS) policies
- Traffic analysis and optimization

### 5.2 Network Performance Metrics
- Latency and throughput targets
- Availability and uptime requirements
- Monitoring and alerting thresholds

## 6. Implementation Timeline
### 6.1 Phase 1: Core Infrastructure
- Core network equipment installation
- Basic connectivity establishment
- Initial security configuration

### 6.2 Phase 2: Distribution and Access
- Distribution layer deployment
- Access layer rollout
- End-user connectivity enablement

### 6.3 Phase 3: Advanced Services
- Advanced security features activation
- Performance optimization implementation
- Monitoring and management tools deployment`,
    requiredFields: ["organization_name", "network_architect", "implementation_timeline"]
  },

  "IT Staffing Plan": {
    description: "Strategic plan for IT human resources and staffing requirements",
    sections: ["Current State Analysis", "Future Requirements", "Staffing Strategy", "Skills Development", "Budget Planning"],
    template: `# IT Staffing Plan

## 1. Executive Summary
This IT Staffing Plan outlines the human resource strategy for [Organization Name]'s IT department to meet current and future technology objectives.

## 2. Current State Analysis
### 2.1 Existing Staff Assessment
- Current IT team structure and roles
- Skills inventory and competency mapping
- Performance and productivity analysis

### 2.2 Gap Analysis
- Identified skill gaps and deficiencies
- Workload distribution assessment
- Technology evolution requirements

## 3. Future Staffing Requirements
### 3.1 Strategic Technology Initiatives
- Cloud migration project staffing needs
- Digital transformation requirements
- Emerging technology adoption plans

### 3.2 Operational Requirements
- Infrastructure maintenance and support
- Application development and maintenance
- Help desk and user support services

## 4. Staffing Strategy
### 4.1 Recruitment Plan
- Key positions to be filled
- Internal promotion opportunities
- External hiring requirements and timeline

### 4.2 Skills Development
- Training and certification programs
- Professional development initiatives
- Knowledge transfer and mentoring

## 5. Organizational Structure
### 5.1 Proposed IT Organization Chart
- Department structure and reporting lines
- Role definitions and responsibilities
- Career progression pathways

### 5.2 Team Collaboration Model
- Cross-functional team arrangements
- Project-based staffing strategies
- Vendor and contractor management

## 6. Budget and Resource Planning
### 6.1 Staffing Costs
- Salary and benefits projections
- Training and development budget
- Recruitment and onboarding costs

### 6.2 ROI and Performance Metrics
- Productivity improvement targets
- Cost per IT service delivery
- Staff retention and satisfaction goals`,
    requiredFields: ["organization_name", "it_manager", "budget_period"]
  },

  "System Upgrade Proposal": {
    description: "Comprehensive proposal for system modernization and upgrades",
    sections: ["Current System Assessment", "Upgrade Requirements", "Technical Specifications", "Cost-Benefit Analysis", "Implementation Plan"],
    template: `# System Upgrade Proposal

## 1. Executive Summary
This proposal outlines the system upgrade initiative for [Organization Name] to modernize IT infrastructure and improve operational efficiency.

## 2. Current System Assessment
### 2.1 Existing Infrastructure Analysis
- Hardware and software inventory
- Performance and capacity limitations
- Security vulnerabilities and risks

### 2.2 Business Impact
- Current system limitations on business operations
- User experience and productivity issues
- Maintenance costs and resource allocation

## 3. Upgrade Requirements
### 3.1 Business Objectives
- Improved system performance and reliability
- Enhanced security and compliance posture
- Scalability for future growth requirements

### 3.2 Technical Requirements
- Hardware specifications and compatibility
- Software licensing and feature requirements
- Integration with existing systems

## 4. Proposed Solution
### 4.1 Technology Architecture
- Recommended hardware and software platforms
- Cloud vs on-premises considerations
- Integration and migration strategies

### 4.2 Technical Specifications
- Server and storage requirements
- Network infrastructure needs
- Security and backup solutions

## 5. Cost-Benefit Analysis
### 5.1 Investment Requirements
- Hardware and software costs
- Implementation and migration expenses
- Training and support costs

### 5.2 Expected Benefits
- Operational cost savings
- Productivity improvements
- Risk mitigation and compliance benefits

## 6. Implementation Plan
### 6.1 Project Timeline
- Phase-based implementation approach
- Key milestones and deliverables
- Resource allocation and dependencies

### 6.2 Risk Management
- Identified risks and mitigation strategies
- Contingency planning and rollback procedures
- Change management and user adoption`,
    requiredFields: ["organization_name", "project_manager", "budget_amount"]
  },

  "IT Budget Proposal": {
    description: "Strategic IT budget planning and resource allocation proposal",
    sections: ["Budget Overview", "Capital Expenditures", "Operational Expenses", "ROI Analysis", "Approval Process"],
    template: `# IT Budget Proposal

## 1. Executive Summary
This IT Budget Proposal presents the financial requirements for [Organization Name]'s information technology operations and strategic initiatives for [Budget Period].

## 2. Budget Overview
### 2.1 Total Budget Request
- Total IT budget requirement: $[Amount]
- Percentage of overall organizational budget
- Year-over-year budget comparison

### 2.2 Budget Categories
- Capital expenditures (CAPEX)
- Operational expenditures (OPEX)
- Strategic initiative investments

## 3. Capital Expenditures
### 3.1 Infrastructure Investments
- Server and storage hardware upgrades
- Network equipment and security appliances
- End-user devices and equipment

### 3.2 Software Licensing
- Enterprise software license renewals
- New software acquisitions and implementations
- Cloud service subscriptions and migrations

## 4. Operational Expenses
### 4.1 Personnel Costs
- IT staff salaries and benefits
- Training and professional development
- Contractor and consultant services

### 4.2 Ongoing Operations
- Maintenance and support contracts
- Utilities and facility costs
- Telecommunications and connectivity

## 5. Strategic Initiatives
### 5.1 Digital Transformation Projects
- Cloud migration initiatives
- Business process automation
- Data analytics and business intelligence

### 5.2 Security and Compliance
- Cybersecurity enhancement programs
- Compliance and audit requirements
- Risk management initiatives

## 6. Return on Investment
### 6.1 Cost Savings and Efficiency Gains
- Operational cost reductions
- Productivity improvements
- Process automation benefits

### 6.2 Business Value Creation
- Revenue enablement through technology
- Customer experience improvements
- Competitive advantage initiatives`,
    requiredFields: ["organization_name", "cfo_approval", "budget_period"]
  },

  "IT Policy Document": {
    description: "Comprehensive IT governance and operational policies",
    sections: ["IT Governance", "Acceptable Use", "Security Requirements", "Data Management", "Compliance"],
    template: `# IT Policy Document

## 1. Purpose and Scope
This IT Policy Document establishes the governance framework and operational policies for information technology within [Organization Name].

## 2. IT Governance Framework
### 2.1 IT Governance Structure
- IT steering committee roles and responsibilities
- Decision-making authority and escalation procedures
- Performance measurement and reporting

### 2.2 IT Service Management
- Service delivery standards and expectations
- Service level agreements and metrics
- Incident and problem management procedures

## 3. Acceptable Use Policy
### 3.1 System Usage Guidelines
- Authorized use of IT resources and systems
- Prohibited activities and security violations
- Personal use policies and restrictions

### 3.2 Email and Communication
- Professional communication standards
- Email retention and privacy policies
- Social media and external communication guidelines

## 4. Security Requirements
### 4.1 Information Security Standards
- Data classification and handling procedures
- Access control and authentication requirements
- Security incident reporting and response

### 4.2 System Security
- Workstation and device security requirements
- Software installation and update policies
- Network security and remote access procedures

## 5. Data Management
### 5.1 Data Governance
- Data ownership and stewardship roles
- Data quality and integrity standards
- Data retention and disposal procedures

### 5.2 Backup and Recovery
- Data backup requirements and schedules
- Disaster recovery procedures and testing
- Business continuity planning and execution

## 6. Compliance and Enforcement
### 6.1 Regulatory Compliance
- Industry-specific compliance requirements
- Audit and assessment procedures
- Documentation and record-keeping standards

### 6.2 Policy Enforcement
- Violation reporting and investigation procedures
- Disciplinary actions and consequences
- Policy review and update processes`,
    requiredFields: ["organization_name", "it_director", "compliance_officer"]
  },

  "IT Service Level Agreement": {
    description: "Service level commitments and operational expectations",
    sections: ["Service Description", "Performance Metrics", "Availability Targets", "Support Procedures", "Reporting"],
    template: `# IT Service Level Agreement

## 1. Agreement Overview
This IT Service Level Agreement (SLA) defines the service commitments between [IT Department] and [Business Units] within [Organization Name].

## 2. Service Description
### 2.1 Covered Services
- Infrastructure services and system availability
- Application support and maintenance
- Help desk and user support services

### 2.2 Service Hours
- Standard business hours: [Hours]
- Extended support hours: [Hours]
- Emergency support availability

## 3. Performance Metrics
### 3.1 System Availability
- Network availability: 99.5% uptime target
- Server availability: 99.9% uptime target
- Application availability: 99.7% uptime target

### 3.2 Response Times
- Critical issues: 1 hour response time
- High priority issues: 4 hour response time
- Standard issues: 24 hour response time

## 4. Support Procedures
### 4.1 Incident Reporting
- Service desk contact information and procedures
- Incident classification and priority levels
- Escalation procedures and timelines

### 4.2 Change Management
- Change request procedures and approval process
- Maintenance windows and notifications
- Emergency change procedures

## 5. Roles and Responsibilities
### 5.1 IT Department Responsibilities
- Service delivery and performance monitoring
- Incident response and problem resolution
- Communication and reporting

### 5.2 Business Unit Responsibilities
- Proper use of IT services and resources
- Timely reporting of issues and requirements
- Participation in testing and validation

## 6. Service Credits and Penalties
### 6.1 Service Level Credits
- Availability below 99% - 5% service credit
- Availability below 98% - 10% service credit
- Availability below 95% - 25% service credit

### 6.2 Exclusions
- Scheduled maintenance windows
- Force majeure events and external factors
- User error or unauthorized modifications`,
    requiredFields: ["organization_name", "service_manager", "sla_period"]
  }
};

export default function PolicyCreationForm({ 
  isOpen, 
  onClose, 
  selectedTemplate,
  onPolicyCreated 
}: PolicyCreationFormProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [useTemplate, setUseTemplate] = useState(!!selectedTemplate);
  const { toast } = useToast();

  const form = useForm<PolicyFormData>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      policyType: selectedTemplate || "",
      category: "",
      title: "",
      description: "",
      content: "",
      priority: "medium",
      owner: "",
      reviewDate: "",
      expiryDate: "",
      tags: "",
    },
  });

  const watchedPolicyType = form.watch("policyType");
  const watchedContent = form.watch("content");

  // Auto-populate fields when template is selected
  const handleTemplateSelect = (policyType: string) => {
    const template = policyTemplates[policyType as keyof typeof policyTemplates];
    if (template) {
      form.setValue("policyType", policyType);
      form.setValue("title", `${policyType} v1.0`);
      form.setValue("description", template.description);
      form.setValue("content", template.template);
      
      // Auto-categorize based on policy type
      const categoryMapping: Record<string, string> = {
        "Information Security Policy": "Governance & Compliance",
        "Incident Response Plan": "Incident & Crisis Management", 
        "Access Control Policy": "Access & Identity Management",
        "Network Security Policy": "Network & Infrastructure",
        "Data Classification Policy": "Data Protection",
        "Business Continuity Plan": "Business Continuity",
        "Disaster Recovery Plan": "Business Continuity",
        "Vulnerability Management Plan": "Risk Management",
        "Patch Management Policy": "Security Operations",
        "Encryption Policy": "Data Protection",
        "Security Awareness Training Material": "Training & Awareness",
        "Third-Party Security Agreement": "Third-Party Management",
        "Vendor Security Assessment Document": "Third-Party Management",
        "Security Budget Proposal": "Strategic Planning",
        "Security Program Roadmap": "Strategic Planning",
        "Security Architecture Document": "Network & Infrastructure",
        "Security Metrics Report": "Governance & Compliance",
        "Compliance Audit Report": "Governance & Compliance",
        "Data Breach Notification Plan": "Incident & Crisis Management",
        "Network Architecture Plan": "IT Infrastructure & Architecture",
        "IT Staffing Plan": "IT Project & Resource Management",
        "System Upgrade Proposal": "IT Infrastructure & Architecture",
        "IT Budget Proposal": "IT Project & Resource Management",
        "IT Policy Document": "IT Management & Operations",
        "IT Compliance Audit Report": "Governance & Compliance",
        "IT Project Management Plan": "IT Project & Resource Management",
        "IT Vendor Evaluation Document": "Third-Party Management",
        "Data Security Plan": "Data Protection",
        "IT Risk Assessment Document": "Risk Management",
        "IT Service Level Agreement": "IT Service Management",
        "IT Incident Response Plan": "Incident & Crisis Management",
        "IT Infrastructure Maintenance Plan": "IT Infrastructure & Architecture",
        "IT Strategic Plan": "Strategic Planning"
      };
      
      const category = categoryMapping[policyType] || "Governance & Compliance";
      form.setValue("category", category);
      
      setUseTemplate(true);
      setActiveTab("content");
      
      toast({
        title: "Template Applied",
        description: `${policyType} template has been loaded successfully.`,
      });
    }
  };

  // AI-powered policy generation
  const handleAIGeneration = async () => {
    const policyType = form.getValues("policyType");
    const description = form.getValues("description");
    
    if (!policyType) {
      toast({
        title: "Policy Type Required",
        description: "Please select a policy type before generating AI content.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAI(true);
    
    try {
      // Simulate AI generation - in real app this would call OpenAI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiContent = `# ${policyType}

## AI-Generated Content

This ${policyType.toLowerCase()} has been generated using AI to provide a comprehensive framework for ${description || policyType.toLowerCase()}.

## 1. Executive Summary
${policyType} serves as a cornerstone document for establishing robust cybersecurity practices within the organization. This policy provides clear guidelines, procedures, and requirements to ensure comprehensive security coverage.

## 2. Policy Objectives
- Establish clear security requirements and expectations
- Define roles and responsibilities for security implementation
- Provide guidance for compliance and risk management
- Enable effective security governance and oversight

## 3. Scope and Applicability
This policy applies to all systems, personnel, and operations within the organization's security perimeter, including cloud services, third-party integrations, and remote work environments.

## 4. Key Requirements
### 4.1 Implementation Standards
All security measures must align with industry best practices and regulatory requirements applicable to the organization's sector.

### 4.2 Monitoring and Compliance
Regular assessments and audits will be conducted to ensure ongoing compliance with policy requirements.

### 4.3 Training and Awareness
All personnel must receive appropriate training on policy requirements and their specific responsibilities.

## 5. Review and Updates
This policy will be reviewed annually and updated as necessary to address emerging threats and changing business requirements.

---
*This content was generated using AI assistance and should be reviewed and customized for your specific organizational needs.*`;

      form.setValue("content", aiContent);
      setActiveTab("content");
      
      toast({
        title: "AI Content Generated",
        description: "Policy content has been generated successfully. Please review and customize as needed.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const onSubmit = async (data: PolicyFormData) => {
    try {
      // Process tags
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      const policyData = {
        ...data,
        tags,
        version: "1.0",
        status: "draft",
        aiGenerated: isGeneratingAI || data.content.includes("AI-Generated Content"),
        templateUsed: useTemplate ? data.policyType : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In real app, this would be an API call
      console.log("Creating policy:", policyData);
      
      onPolicyCreated?.(policyData);
      onClose();
      
      toast({
        title: "Policy Created",
        description: `${data.title} has been created successfully.`,
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create policy. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create New Policy
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
              <TabsTrigger value="details">Policy Details</TabsTrigger>
              <TabsTrigger value="template">Choose Template</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="review">Review & Submit</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-1">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="policyType">Policy Type *</Label>
                          <Select 
                            value={form.getValues("policyType")} 
                            onValueChange={(value) => form.setValue("policyType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select policy type" />
                            </SelectTrigger>
                            <SelectContent>
                              {cisoPolicyTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.formState.errors.policyType && (
                            <p className="text-sm text-red-500">{form.formState.errors.policyType.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select 
                            value={form.getValues("category")} 
                            onValueChange={(value) => form.setValue("category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {cisoPolicyCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.formState.errors.category && (
                            <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="title">Policy Title *</Label>
                          <Input
                            {...form.register("title")}
                            placeholder="e.g., Corporate Information Security Policy v1.0"
                          />
                          {form.formState.errors.title && (
                            <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority *</Label>
                          <Select 
                            value={form.getValues("priority")} 
                            onValueChange={(value) => form.setValue("priority", value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="owner">Policy Owner *</Label>
                          <Input
                            {...form.register("owner")}
                            placeholder="e.g., CISO Office, IT Security Team"
                          />
                          {form.formState.errors.owner && (
                            <p className="text-sm text-red-500">{form.formState.errors.owner.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            {...form.register("tags")}
                            placeholder="e.g., security, compliance, governance"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reviewDate">Review Date *</Label>
                          <Input
                            {...form.register("reviewDate")}
                            type="date"
                          />
                          {form.formState.errors.reviewDate && (
                            <p className="text-sm text-red-500">{form.formState.errors.reviewDate.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            {...form.register("expiryDate")}
                            type="date"
                          />
                          {form.formState.errors.expiryDate && (
                            <p className="text-sm text-red-500">{form.formState.errors.expiryDate.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          {...form.register("description")}
                          rows={3}
                          placeholder="Brief description of the policy purpose and scope"
                        />
                        {form.formState.errors.description && (
                          <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="template" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(policyTemplates).map(([policyType, template]) => (
                          <Card 
                            key={policyType} 
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              watchedPolicyType === policyType ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => handleTemplateSelect(policyType)}
                          >
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {policyType}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-muted-foreground mb-3">
                                {template.description}
                              </p>
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-1">
                                  {template.sections.slice(0, 3).map(section => (
                                    <Badge key={section} variant="outline" className="text-xs">
                                      {section}
                                    </Badge>
                                  ))}
                                  {template.sections.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{template.sections.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="flex justify-center">
                        <Button 
                          type="button"
                          onClick={handleAIGeneration}
                          disabled={isGeneratingAI}
                          className="flex items-center gap-2"
                          variant="outline"
                        >
                          {isGeneratingAI ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              Generating with AI...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Generate with AI
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="content">Policy Content *</Label>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            {watchedContent.length} characters
                          </div>
                        </div>
                        <Textarea
                          {...form.register("content")}
                          rows={20}
                          placeholder="Enter your policy content here. You can use Markdown formatting..."
                          className="font-mono text-sm"
                        />
                        {form.formState.errors.content && (
                          <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="review" className="space-y-4 mt-4">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">Policy Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">Type:</span>
                                <span>{form.getValues("policyType") || "Not specified"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Category:</span>
                                <span>{form.getValues("category") || "Not specified"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Priority:</span>
                                <Badge className={
                                  form.getValues("priority") === "critical" ? "bg-red-100 text-red-800" :
                                  form.getValues("priority") === "high" ? "bg-orange-100 text-orange-800" :
                                  form.getValues("priority") === "medium" ? "bg-yellow-100 text-yellow-800" :
                                  "bg-gray-100 text-gray-800"
                                }>
                                  {form.getValues("priority")}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Owner:</span>
                                <span>{form.getValues("owner") || "Not specified"}</span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">Content Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium">Content Length:</span>
                                <span>{watchedContent.length} characters</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">Template Used:</span>
                                <span>{useTemplate ? "Yes" : "No"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-medium">AI Generated:</span>
                                <span>{watchedContent.includes("AI-Generated Content") ? "Yes" : "No"}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                          </Button>
                          <Button type="submit" className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Create Policy
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                  </form>
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}