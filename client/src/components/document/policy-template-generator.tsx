import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import DocumentViewer from "@/components/common/document-viewer";
import { 
  FileText, 
  Download, 
  Upload, 
  CheckCircle, 
  Clock, 
  Building,
  Users,
  Shield,
  Settings,
  BookOpen,
  Target,
  Zap,
  Archive,
  Package,
  Activity,
  AlertTriangle,
  Eye
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

interface CompanyDetails {
  companyName: string;
  industry: string;
  ceoName: string;
  cisoName: string;
  itManagerName: string;
  complianceOfficer: string;
  headquartersLocation: string;
  employeeCount: string;
  establishedYear: string;
  website: string;
}

interface PolicyTemplate {
  id: string;
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  domain: string;
  description: string;
  template: string;
  controls: string[];
  selected: boolean;
}

const POLICY_TEMPLATES: PolicyTemplate[] = [
  // Governance Domain (20 policies)
  {
    id: 'gov-001',
    title: 'Information Security Policy',
    category: 'Governance',
    priority: 'High',
    domain: 'Governance',
    description: 'Master information security policy framework',
    controls: ['GOV-01', 'GOV-02', 'GOV-03'],
    selected: true,
    template: `# Information Security Policy

## 1. Purpose and Scope
{COMPANY_NAME} is committed to protecting the confidentiality, integrity, and availability of all information assets. This policy establishes the foundation for our information security program.

## 2. Authority and Responsibility
The Chief Executive Officer, {CEO_NAME}, has ultimate responsibility for information security at {COMPANY_NAME}. The Chief Information Security Officer, {CISO_NAME}, is responsible for day-to-day implementation.

## 3. Policy Statement
{COMPANY_NAME} will:
- Protect all information assets from unauthorized access, disclosure, modification, or destruction
- Ensure compliance with applicable laws, regulations, and contractual obligations
- Provide security awareness training to all personnel
- Conduct regular security assessments and reviews

## 4. Governance Structure
- Information Security Steering Committee: Chaired by {CEO_NAME}
- CISO: {CISO_NAME}
- IT Manager: {IT_MANAGER_NAME}
- Compliance Officer: {COMPLIANCE_OFFICER}

## 5. Implementation
This policy is effective immediately and applies to all employees, contractors, and third parties with access to {COMPANY_NAME} information systems.

Approved by: {CEO_NAME}, CEO
Date: {CURRENT_DATE}
Next Review: {REVIEW_DATE}`
  },
  {
    id: 'gov-002',
    title: 'Risk Management Policy',
    category: 'Governance',
    priority: 'High',
    domain: 'Governance',
    description: 'Enterprise risk management framework',
    controls: ['GOV-04', 'GOV-05'],
    selected: true,
    template: `# Risk Management Policy

## 1. Executive Summary
{COMPANY_NAME} recognizes that effective risk management is essential for achieving business objectives and protecting stakeholder interests.

## 2. Risk Management Framework
Under the leadership of {CEO_NAME} and oversight of {CISO_NAME}, {COMPANY_NAME} implements a comprehensive risk management program.

## 3. Risk Categories
- Strategic Risks
- Operational Risks
- Financial Risks
- Compliance Risks
- Technology Risks

## 4. Risk Assessment Process
{IT_MANAGER_NAME} coordinates quarterly risk assessments with department heads to identify, analyze, and evaluate risks.

## 5. Risk Treatment
Risk responses include:
- Accept
- Avoid
- Mitigate
- Transfer

Approved by: {CEO_NAME}, Chief Executive Officer
Location: {HEADQUARTERS_LOCATION}
Company: {COMPANY_NAME}`
  },
  {
    id: 'gov-003',
    title: 'Business Continuity Policy',
    category: 'Governance',
    priority: 'High',
    domain: 'Governance',
    description: 'Business continuity and disaster recovery planning',
    controls: ['GOV-06', 'GOV-07'],
    selected: true,
    template: `# Business Continuity Policy

## 1. Policy Statement
{COMPANY_NAME} is committed to ensuring business continuity and minimizing the impact of disruptive events on our operations, customers, and stakeholders.

## 2. Scope
This policy applies to all {COMPANY_NAME} operations, systems, and personnel across {HEADQUARTERS_LOCATION} and all business locations.

## 3. Business Continuity Team
- Business Continuity Coordinator: {CISO_NAME}
- IT Recovery Manager: {IT_MANAGER_NAME}
- Communications Lead: {COMPLIANCE_OFFICER}
- Executive Sponsor: {CEO_NAME}

## 4. Recovery Objectives
- Recovery Time Objective (RTO): 4 hours for critical systems
- Recovery Point Objective (RPO): 1 hour for critical data
- Maximum Acceptable Outage (MAO): 24 hours

## 5. Plan Activation
The {CISO_NAME} is authorized to activate the business continuity plan in consultation with {CEO_NAME}.

Effective Date: {CURRENT_DATE}
Organization: {COMPANY_NAME}
Industry: {INDUSTRY}`
  },
  {
    id: 'gov-004',
    title: 'Incident Response Policy',
    category: 'Governance',
    priority: 'High',
    domain: 'Governance',
    description: 'Security incident response procedures',
    controls: ['GOV-08', 'GOV-09'],
    selected: true,
    template: `# Incident Response Policy

## 1. Purpose
{COMPANY_NAME} maintains this policy to ensure prompt, effective response to security incidents that may impact our information systems or data.

## 2. Incident Response Team
- Incident Commander: {CISO_NAME}
- Technical Lead: {IT_MANAGER_NAME}
- Communications Lead: {COMPLIANCE_OFFICER}
- Executive Contact: {CEO_NAME}

## 3. Incident Classification
### High Severity
- Data breach affecting customer information
- System compromise with potential data loss
- Ransomware or malware infection

### Medium Severity
- Unauthorized access attempts
- System performance degradation
- Policy violations

### Low Severity
- Failed login attempts
- Minor configuration issues

## 4. Response Procedures
1. Detection and Analysis
2. Containment and Eradication
3. Recovery and Post-Incident Analysis
4. Lessons Learned

## 5. Reporting Requirements
All incidents must be reported to {CISO_NAME} within 2 hours of detection.

Company: {COMPANY_NAME}
Established: {ESTABLISHED_YEAR}
Employee Count: {EMPLOYEE_COUNT}`
  },
  {
    id: 'gov-005',
    title: 'Data Classification Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Data classification and handling requirements',
    controls: ['GOV-10', 'GOV-11'],
    selected: true,
    template: `# Data Classification Policy

## 1. Overview
{COMPANY_NAME} classifies data based on sensitivity and business impact to ensure appropriate protection measures are applied.

## 2. Data Classification Levels

### Public
- Marketing materials
- Public website content
- Press releases

### Internal
- Internal procedures
- Employee handbooks
- Non-sensitive business data

### Confidential
- Customer information
- Financial data
- Strategic plans

### Restricted
- Personal data subject to privacy laws
- Trade secrets
- Security procedures

## 3. Handling Requirements
Data owners, led by {COMPLIANCE_OFFICER}, must ensure appropriate handling of classified data according to {COMPANY_NAME} standards.

## 4. Responsibilities
- Data Owners: Classify and protect data
- Data Custodians: Implement technical controls
- Users: Handle data according to classification

Management Authority: {CEO_NAME}, Chief Executive Officer
Information Security Officer: {CISO_NAME}
Website: {WEBSITE}`
  },
  {
    id: 'gov-006',
    title: 'Privacy Policy',
    category: 'Governance',
    priority: 'High',
    domain: 'Governance',
    description: 'Data privacy and protection requirements',
    controls: ['GOV-12', 'GOV-13'],
    selected: true,
    template: `# Privacy Policy

## 1. Privacy Commitment
{COMPANY_NAME} is committed to protecting the privacy and confidentiality of personal information entrusted to us by customers, employees, and business partners.

## 2. Privacy Governance
Privacy oversight is managed by {COMPLIANCE_OFFICER} with executive sponsorship from {CEO_NAME} and technical implementation by {IT_MANAGER_NAME}.

## 3. Personal Data Collection
We collect personal data only for legitimate business purposes and with appropriate consent or legal basis.

## 4. Data Processing Principles
- Lawfulness, fairness, and transparency
- Purpose limitation
- Data minimization
- Accuracy
- Storage limitation
- Security
- Accountability

## 5. Individual Rights
Data subjects have the right to:
- Access their personal data
- Rectify inaccurate information
- Erase personal data
- Restrict processing
- Data portability
- Object to processing

## 6. Privacy by Design
{IT_MANAGER_NAME} ensures privacy considerations are integrated into all systems and processes from design stage.

Company: {COMPANY_NAME}
Executive Authority: {CEO_NAME}
Privacy Officer: {COMPLIANCE_OFFICER}`
  },
  {
    id: 'gov-007',
    title: 'Document Control Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Document management and version control',
    controls: ['GOV-14', 'GOV-15'],
    selected: true,
    template: `# Document Control Policy

## 1. Document Management Framework
{COMPANY_NAME} maintains controlled documentation to ensure accuracy, availability, and appropriate use of information.

## 2. Document Control Authority
Document control is managed by {COMPLIANCE_OFFICER} with technical support from {IT_MANAGER_NAME} and approval authority from {CEO_NAME}.

## 3. Document Classification
- Level 1: Public documents
- Level 2: Internal use only
- Level 3: Confidential
- Level 4: Restricted access

## 4. Version Control
All controlled documents must include:
- Version number
- Approval date
- Review date
- Authorized approver
- Distribution list

## 5. Document Lifecycle
- Creation and authoring
- Review and approval
- Publication and distribution
- Maintenance and updates
- Archival and disposal

Company: {COMPANY_NAME}
Document Controller: {COMPLIANCE_OFFICER}
IT Support: {IT_MANAGER_NAME}`
  },
  {
    id: 'gov-008',
    title: 'Training and Awareness Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Security awareness and training requirements',
    controls: ['GOV-16', 'GOV-17'],
    selected: true,
    template: `# Training and Awareness Policy

## 1. Training Objectives
{COMPANY_NAME} provides comprehensive security awareness training to ensure all personnel understand their security responsibilities.

## 2. Training Program Management
Training programs are coordinated by {CISO_NAME} with content development by {IT_MANAGER_NAME} and executive support from {CEO_NAME}.

## 3. Mandatory Training
All employees must complete:
- Security awareness training (annual)
- Role-specific training
- Incident response training
- Privacy training
- Compliance training

## 4. Training Content
- Threat landscape awareness
- Phishing and social engineering
- Data protection requirements
- Incident reporting procedures
- Company policies and procedures

## 5. Training Effectiveness
Training effectiveness is measured through:
- Knowledge assessments
- Simulated phishing exercises
- Incident response drills
- Feedback surveys

Organization: {COMPANY_NAME}
Training Coordinator: {CISO_NAME}
Executive Sponsor: {CEO_NAME}`
  },
  {
    id: 'gov-009',
    title: 'Vendor Risk Management Policy',
    category: 'Governance',
    priority: 'High',
    domain: 'Governance',
    description: 'Third-party vendor risk assessment and management',
    controls: ['GOV-18', 'GOV-19'],
    selected: true,
    template: `# Vendor Risk Management Policy

## 1. Vendor Risk Framework
{COMPANY_NAME} implements comprehensive vendor risk management to protect against third-party risks and ensure vendor compliance.

## 2. Vendor Risk Governance
Vendor risk management is led by {COMPLIANCE_OFFICER} with security assessment by {CISO_NAME} and executive oversight by {CEO_NAME}.

## 3. Vendor Categories
- Critical vendors: High business impact
- Important vendors: Medium business impact
- Standard vendors: Low business impact

## 4. Risk Assessment Process
All vendors undergo:
- Initial risk assessment
- Due diligence review
- Contract risk analysis
- Ongoing monitoring
- Annual reassessment

## 5. Security Requirements
Vendors must demonstrate:
- Security certifications
- Incident response capabilities
- Data protection measures
- Business continuity plans
- Insurance coverage

Company: {COMPANY_NAME}
Vendor Risk Manager: {COMPLIANCE_OFFICER}
Security Reviewer: {CISO_NAME}`
  },
  {
    id: 'gov-010',
    title: 'Records Management Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Information records retention and disposal',
    controls: ['GOV-20', 'GOV-21'],
    selected: true,
    template: `# Records Management Policy

## 1. Records Management Objectives
{COMPANY_NAME} maintains proper records management to ensure compliance, support business operations, and protect information assets.

## 2. Records Management Authority
Records management is overseen by {COMPLIANCE_OFFICER} with technical implementation by {IT_MANAGER_NAME} and executive approval from {CEO_NAME}.

## 3. Record Categories
- Business records: 7 years retention
- Financial records: 10 years retention
- Personnel records: 7 years after termination
- Legal records: Permanent retention
- Technical records: 5 years retention

## 4. Retention Schedule
Records retention based on:
- Legal requirements
- Regulatory obligations
- Business needs
- Historical value

## 5. Secure Disposal
End-of-life records disposal includes:
- Secure deletion procedures
- Physical destruction methods
- Certificate of destruction
- Audit trail maintenance

Company: {COMPANY_NAME}
Records Manager: {COMPLIANCE_OFFICER}
Location: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'gov-011',
    title: 'Asset Management Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Information asset inventory and protection',
    controls: ['GOV-22', 'GOV-23'],
    selected: true,
    template: `# Asset Management Policy

## 1. Asset Management Framework
{COMPANY_NAME} maintains comprehensive asset management to protect, track, and properly utilize information assets.

## 2. Asset Management Responsibility
Asset management is coordinated by {IT_MANAGER_NAME} with security oversight from {CISO_NAME} and governance from {CEO_NAME}.

## 3. Asset Classification
- Hardware assets
- Software assets
- Information assets
- Personnel assets
- Facilities assets

## 4. Asset Inventory
Asset inventory includes:
- Asset identification
- Asset ownership
- Asset classification
- Asset location
- Asset condition

## 5. Asset Lifecycle
- Acquisition and procurement
- Deployment and configuration
- Operation and maintenance
- Retirement and disposal

Company: {COMPANY_NAME}
Asset Manager: {IT_MANAGER_NAME}
Security Oversight: {CISO_NAME}`
  },
  {
    id: 'gov-012',
    title: 'Communication Security Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Secure communication standards and protocols',
    controls: ['GOV-24', 'GOV-25'],
    selected: true,
    template: `# Communication Security Policy

## 1. Communication Security Framework
{COMPANY_NAME} ensures secure communication channels to protect information during transmission and collaboration.

## 2. Communication Security Management
Communication security is managed by {IT_MANAGER_NAME} with policy oversight from {CISO_NAME} and executive support from {CEO_NAME}.

## 3. Communication Channels
- Email communications
- Instant messaging
- Video conferencing
- File sharing
- Voice communications

## 4. Security Requirements
All communications must use:
- Approved platforms
- Encryption in transit
- Access controls
- Audit logging
- Data loss prevention

## 5. External Communications
External communications require:
- Approved channels only
- Classification marking
- Recipient verification
- Encryption when required

Organization: {COMPANY_NAME}
Communications Manager: {IT_MANAGER_NAME}
Industry: {INDUSTRY}`
  },
  {
    id: 'gov-013',
    title: 'Physical Security Policy',
    category: 'Governance',
    priority: 'High',
    domain: 'Governance',
    description: 'Physical security controls and access management',
    controls: ['GOV-26', 'GOV-27'],
    selected: true,
    template: `# Physical Security Policy

## 1. Physical Security Objectives
{COMPANY_NAME} implements physical security controls to protect personnel, facilities, and information assets from physical threats.

## 2. Physical Security Authority
Physical security is managed by {IT_MANAGER_NAME} with coordination from {CISO_NAME} and executive oversight from {CEO_NAME}.

## 3. Access Control
Physical access control includes:
- Badge-based access systems
- Visitor management procedures
- Security guards and monitoring
- Restricted area controls

## 4. Facility Security
- Perimeter security
- Building access controls
- Server room security
- Environmental monitoring

## 5. Equipment Security
- Asset tracking
- Secure storage
- Equipment disposal
- Mobile device controls

Company: {COMPANY_NAME}
Facility Manager: {IT_MANAGER_NAME}
Location: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'gov-014',
    title: 'Business Impact Analysis Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Business impact assessment and analysis procedures',
    controls: ['GOV-28', 'GOV-29'],
    selected: true,
    template: `# Business Impact Analysis Policy

## 1. Business Impact Analysis Framework
{COMPANY_NAME} conducts regular business impact analysis to understand critical business functions and recovery requirements.

## 2. BIA Governance
Business impact analysis is led by {CISO_NAME} with business input coordinated by {COMPLIANCE_OFFICER} and executive support from {CEO_NAME}.

## 3. Analysis Scope
BIA covers:
- Critical business processes
- Supporting technology systems
- Key personnel requirements
- Vendor dependencies
- Regulatory obligations

## 4. Impact Assessment
Impact analysis includes:
- Financial impact
- Operational impact
- Regulatory impact
- Reputational impact
- Customer impact

## 5. Recovery Requirements
- Recovery time objectives (RTO)
- Recovery point objectives (RPO)
- Minimum staffing levels
- Essential resources

Company: {COMPANY_NAME}
BIA Coordinator: {CISO_NAME}
Executive Sponsor: {CEO_NAME}`
  },
  {
    id: 'gov-015',
    title: 'Legal and Regulatory Compliance Policy',
    category: 'Governance',
    priority: 'High',
    domain: 'Governance',
    description: 'Legal and regulatory compliance framework',
    controls: ['GOV-30', 'GOV-31'],
    selected: true,
    template: `# Legal and Regulatory Compliance Policy

## 1. Compliance Framework
{COMPANY_NAME} maintains compliance with applicable laws, regulations, and contractual obligations governing our business operations.

## 2. Compliance Governance
Compliance management is led by {COMPLIANCE_OFFICER} with technical support from {IT_MANAGER_NAME} and executive oversight from {CEO_NAME}.

## 3. Applicable Regulations
- Data protection laws (GDPR, CCPA)
- Industry regulations
- Financial regulations
- Employment laws
- Environmental regulations

## 4. Compliance Program
- Regulatory monitoring
- Gap assessments
- Remediation planning
- Training and awareness
- Audit and reporting

## 5. Compliance Monitoring
Regular compliance reviews include:
- Legal requirement updates
- Policy compliance assessment
- Control effectiveness testing
- Corrective action tracking

Organization: {COMPANY_NAME}
Compliance Officer: {COMPLIANCE_OFFICER}
Legal Authority: {CEO_NAME}
Industry Sector: {INDUSTRY}`
  },
  {
    id: 'gov-016',
    title: 'Project Security Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Security requirements for project management',
    controls: ['GOV-32', 'GOV-33'],
    selected: true,
    template: `# Project Security Policy

## 1. Project Security Framework
{COMPANY_NAME} integrates security requirements into all project lifecycle phases to ensure secure delivery of business capabilities.

## 2. Project Security Governance
Project security is coordinated by {CISO_NAME} with project management support from {IT_MANAGER_NAME} and executive sponsorship from {CEO_NAME}.

## 3. Security Requirements
All projects must include:
- Security requirements analysis
- Risk assessment and mitigation
- Security architecture review
- Security testing and validation
- Security training and documentation

## 4. Project Phases
- Initiation: Security requirements definition
- Planning: Security architecture design
- Execution: Security control implementation
- Monitoring: Security testing and validation
- Closure: Security documentation and handover

## 5. Project Security Roles
- Project Security Officer: {CISO_NAME}
- Technical Security Lead: {IT_MANAGER_NAME}
- Business Security Liaison: {COMPLIANCE_OFFICER}

Company: {COMPANY_NAME}
Project Security Lead: {CISO_NAME}
Executive Sponsor: {CEO_NAME}`
  },
  {
    id: 'gov-017',
    title: 'Information Handling Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Information handling and processing guidelines',
    controls: ['GOV-34', 'GOV-35'],
    selected: true,
    template: `# Information Handling Policy

## 1. Information Handling Framework
{COMPANY_NAME} establishes clear guidelines for proper handling, processing, and protection of information assets.

## 2. Information Handling Authority
Information handling standards are managed by {COMPLIANCE_OFFICER} with technical implementation by {IT_MANAGER_NAME} and governance from {CEO_NAME}.

## 3. Handling Requirements
Information handling includes:
- Classification marking
- Access controls
- Transmission security
- Storage protection
- Disposal procedures

## 4. Processing Guidelines
Information processing must follow:
- Authorized purpose only
- Minimal access principle
- Data quality standards
- Retention requirements
- Audit trail maintenance

## 5. Sharing and Disclosure
Information sharing requires:
- Authorized recipients only
- Appropriate protection measures
- Legal compliance verification
- Tracking and logging

Company: {COMPANY_NAME}
Information Officer: {COMPLIANCE_OFFICER}
Technical Lead: {IT_MANAGER_NAME}`
  },
  {
    id: 'gov-018',
    title: 'Audit and Assurance Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Internal audit and assurance framework',
    controls: ['GOV-36', 'GOV-37'],
    selected: true,
    template: `# Audit and Assurance Policy

## 1. Audit Framework
{COMPANY_NAME} maintains independent audit and assurance activities to verify compliance and effectiveness of controls.

## 2. Audit Governance
Audit activities are coordinated by {COMPLIANCE_OFFICER} with technical audit support from {CISO_NAME} and executive oversight from {CEO_NAME}.

## 3. Audit Types
- Compliance audits
- Security audits
- Operational audits
- Financial audits
- Vendor audits

## 4. Audit Process
- Audit planning and scoping
- Evidence collection and analysis
- Finding documentation
- Corrective action planning
- Follow-up verification

## 5. Audit Reporting
Audit reports include:
- Executive summary
- Detailed findings
- Risk ratings
- Recommendations
- Management responses

Organization: {COMPANY_NAME}
Chief Auditor: {COMPLIANCE_OFFICER}
Audit Committee Chair: {CEO_NAME}`
  },
  {
    id: 'gov-019',
    title: 'Performance Management Policy',
    category: 'Governance',
    priority: 'Medium',
    domain: 'Governance',
    description: 'Security performance monitoring and measurement',
    controls: ['GOV-38', 'GOV-39'],
    selected: true,
    template: `# Performance Management Policy

## 1. Performance Management Framework
{COMPANY_NAME} monitors and measures security performance to ensure effectiveness and continuous improvement.

## 2. Performance Management Authority
Performance management is led by {CISO_NAME} with metrics coordination by {IT_MANAGER_NAME} and executive review by {CEO_NAME}.

## 3. Key Performance Indicators
- Security incident trends
- Vulnerability remediation rates
- Training completion rates
- Compliance levels
- System availability

## 4. Performance Monitoring
Regular monitoring includes:
- Real-time dashboards
- Monthly performance reports
- Quarterly trend analysis
- Annual performance reviews

## 5. Performance Improvement
Continuous improvement through:
- Performance gap analysis
- Root cause investigation
- Corrective action implementation
- Best practice identification

Company: {COMPANY_NAME}
Performance Manager: {CISO_NAME}
Executive Review: {CEO_NAME}`
  },
  {
    id: 'gov-020',
    title: 'Crisis Management Policy',
    category: 'Governance',
    priority: 'High',
    domain: 'Governance',
    description: 'Crisis response and management procedures',
    controls: ['GOV-40', 'GOV-41'],
    selected: true,
    template: `# Crisis Management Policy

## 1. Crisis Management Framework
{COMPANY_NAME} maintains crisis management capabilities to respond effectively to major incidents and emergencies.

## 2. Crisis Management Authority
Crisis management is led by {CEO_NAME} with operational coordination by {CISO_NAME} and communication management by {COMPLIANCE_OFFICER}.

## 3. Crisis Categories
- Security breaches
- Natural disasters
- Technology failures
- Pandemic response
- Business disruption

## 4. Crisis Response Team
- Crisis Commander: {CEO_NAME}
- Operations Lead: {CISO_NAME}
- Communications Lead: {COMPLIANCE_OFFICER}
- Technical Lead: {IT_MANAGER_NAME}

## 5. Crisis Response Process
- Crisis detection and assessment
- Response team activation
- Immediate response actions
- Ongoing crisis management
- Recovery and lessons learned

Organization: {COMPANY_NAME}
Crisis Commander: {CEO_NAME}
Headquarters: {HEADQUARTERS_LOCATION}`
  },

  // Cybersecurity Defence Domain (20 policies)
  {
    id: 'def-001',
    title: 'Access Control Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'User access management and authentication',
    controls: ['DEF-01', 'DEF-02', 'DEF-03'],
    selected: true,
    template: `# Access Control Policy

## 1. Policy Statement
{COMPANY_NAME} implements access controls to ensure that only authorized individuals can access information systems and data.

## 2. Access Control Principles
- Principle of Least Privilege
- Need-to-Know Basis
- Separation of Duties
- Regular Access Reviews

## 3. User Account Management
{IT_MANAGER_NAME} oversees all user account provisioning, modification, and deprovisioning activities.

## 4. Authentication Requirements
- Multi-factor authentication for all external access
- Strong password requirements
- Regular password changes
- Account lockout after failed attempts

## 5. Authorization Levels
### Administrator Access
- Granted only to essential personnel
- Requires approval from {CISO_NAME}
- Subject to enhanced monitoring

### User Access
- Based on job role and responsibilities
- Approved by direct manager and {IT_MANAGER_NAME}
- Reviewed quarterly

## 6. Privileged Access Management
Special accounts with elevated privileges require:
- Written justification
- Approval from {CEO_NAME} for critical systems
- Enhanced logging and monitoring

Company: {COMPANY_NAME}
Location: {HEADQUARTERS_LOCATION}
Industry Sector: {INDUSTRY}`
  },
  {
    id: 'def-002',
    title: 'Network Security Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Network infrastructure protection measures',
    controls: ['DEF-04', 'DEF-05', 'DEF-06'],
    selected: true,
    template: `# Network Security Policy

## 1. Purpose
{COMPANY_NAME} maintains secure network infrastructure to protect against unauthorized access and ensure business continuity.

## 2. Network Architecture
Our network is designed with defense-in-depth principles under the guidance of {IT_MANAGER_NAME} and oversight of {CISO_NAME}.

## 3. Firewall Management
- Default deny policy
- Regular rule reviews
- Change control procedures
- Logging and monitoring

## 4. Wireless Network Security
- WPA3 encryption minimum
- Guest network isolation
- Regular security assessments
- Access point management

## 5. Remote Access
- VPN required for external access
- Multi-factor authentication
- Endpoint security compliance
- Session monitoring

## 6. Network Monitoring
Continuous monitoring includes:
- Intrusion detection systems
- Traffic analysis
- Anomaly detection
- Incident alerting

## 7. Responsibilities
- Network Administrator: {IT_MANAGER_NAME}
- Security Officer: {CISO_NAME}
- Executive Oversight: {CEO_NAME}

Organization: {COMPANY_NAME}
Established: {ESTABLISHED_YEAR}
Employee Base: {EMPLOYEE_COUNT} staff members`
  },
  {
    id: 'def-003',
    title: 'Endpoint Security Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Endpoint device security requirements',
    controls: ['DEF-07', 'DEF-08'],
    selected: true,
    template: `# Endpoint Security Policy

## 1. Scope
This policy covers all endpoint devices accessing {COMPANY_NAME} networks and information systems.

## 2. Supported Devices
- Corporate-owned workstations
- Mobile devices
- Laptops and tablets
- IoT devices

## 3. Security Requirements
### Antivirus Protection
- Enterprise-grade antivirus on all endpoints
- Real-time scanning enabled
- Regular signature updates
- Centralized management by {IT_MANAGER_NAME}

### Operating System Security
- Automatic security updates
- Approved software only
- Administrative rights restrictions
- Regular vulnerability scanning

### Encryption
- Full disk encryption for laptops
- Encrypted storage for sensitive data
- Secure transmission protocols
- Key management procedures

## 4. Mobile Device Management
{CISO_NAME} oversees mobile device security including:
- Device enrollment requirements
- Application management
- Remote wipe capabilities
- Compliance monitoring

## 5. Bring Your Own Device (BYOD)
Personal devices must:
- Meet minimum security standards
- Install required security software
- Accept management policies
- Undergo security assessment

Management: {CEO_NAME}, Chief Executive Officer
Security Oversight: {CISO_NAME}
Technical Implementation: {IT_MANAGER_NAME}
Headquarters: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'def-004',
    title: 'Email Security Policy',
    category: 'Defence',
    priority: 'Medium',
    domain: 'Cybersecurity Defence',
    description: 'Email system security and usage guidelines',
    controls: ['DEF-09', 'DEF-10'],
    selected: true,
    template: `# Email Security Policy

## 1. Purpose
{COMPANY_NAME} implements email security measures to protect against threats and ensure appropriate use of email systems.

## 2. Email System Security
Under the management of {IT_MANAGER_NAME}, our email infrastructure includes:
- Spam filtering
- Malware scanning
- Phishing protection
- Data loss prevention

## 3. User Responsibilities
All {COMPANY_NAME} employees must:
- Use email professionally
- Avoid clicking suspicious links
- Report phishing attempts
- Protect confidential information

## 4. Email Encryption
Sensitive communications must be encrypted when:
- Containing customer data
- Including financial information
- Discussing strategic plans
- Required by regulation

## 5. Retention and Archiving
Email retention follows {COMPANY_NAME} records management policy:
- Business emails: 7 years
- Administrative emails: 3 years
- Personal emails: Not permitted on corporate systems

## 6. Monitoring and Compliance
{COMPLIANCE_OFFICER} ensures email usage complies with:
- Corporate policies
- Legal requirements
- Industry regulations
- Privacy laws

Approved by: {CEO_NAME}
Company: {COMPANY_NAME}
Website: {WEBSITE}
Location: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'def-005',
    title: 'Web Application Security Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Web application development and security standards',
    controls: ['DEF-11', 'DEF-12'],
    selected: true,
    template: `# Web Application Security Policy

## 1. Objective
{COMPANY_NAME} ensures all web applications meet security standards to protect against vulnerabilities and attacks.

## 2. Secure Development Lifecycle
Under the direction of {CISO_NAME} and {IT_MANAGER_NAME}, all web applications must follow:
- Security requirements analysis
- Secure coding practices
- Code review procedures
- Security testing
- Vulnerability assessments

## 3. Security Controls
### Input Validation
- Validate all user inputs
- Sanitize data before processing
- Use parameterized queries
- Implement output encoding

### Authentication and Authorization
- Strong authentication mechanisms
- Session management
- Access control implementation
- Privilege separation

### Data Protection
- Encrypt sensitive data
- Secure data transmission
- Implement data validation
- Regular backup procedures

## 4. Vulnerability Management
Regular security assessments include:
- Automated scanning
- Manual penetration testing
- Code reviews
- Dependency checking

## 5. Incident Response
Web application security incidents must be reported to {CISO_NAME} immediately for investigation and remediation.

## 6. Compliance
Applications must comply with:
- Industry standards (OWASP)
- Regulatory requirements
- {COMPANY_NAME} security policies

Organization: {COMPANY_NAME}
Industry: {INDUSTRY}
Chief Executive: {CEO_NAME}
Security Officer: {CISO_NAME}`
  },
  {
    id: 'def-006',
    title: 'Data Loss Prevention Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Data leak detection and prevention controls',
    controls: ['DEF-13', 'DEF-14'],
    selected: true,
    template: `# Data Loss Prevention Policy

## 1. DLP Framework
{COMPANY_NAME} implements data loss prevention to protect sensitive information from unauthorized disclosure or exfiltration.

## 2. DLP Management
DLP program is managed by {CISO_NAME} with technical implementation by {IT_MANAGER_NAME} and executive oversight from {CEO_NAME}.

## 3. Protected Data Types
- Customer personal information
- Financial data
- Intellectual property
- Trade secrets
- Regulated information

## 4. DLP Controls
- Email content scanning
- Web traffic monitoring
- Removable media controls
- Cloud application monitoring
- Endpoint data protection

## 5. Incident Response
DLP violations trigger:
- Automatic blocking/quarantine
- Alert to security team
- Investigation procedures
- Remediation actions

Company: {COMPANY_NAME}
DLP Administrator: {CISO_NAME}
Technical Lead: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-007',
    title: 'Malware Protection Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Malware detection and prevention measures',
    controls: ['DEF-15', 'DEF-16'],
    selected: true,
    template: `# Malware Protection Policy

## 1. Malware Protection Framework
{COMPANY_NAME} implements comprehensive malware protection to defend against malicious software threats.

## 2. Malware Protection Management
Malware protection is coordinated by {IT_MANAGER_NAME} with security oversight from {CISO_NAME} and executive support from {CEO_NAME}.

## 3. Protection Layers
- Email gateway filtering
- Web content filtering
- Endpoint protection
- Network-based detection
- Behavioral analysis

## 4. Detection and Response
- Real-time scanning
- Signature-based detection
- Heuristic analysis
- Sandboxing
- Automatic remediation

## 5. Incident Handling
Malware incidents require:
- Immediate isolation
- Forensic analysis
- System remediation
- Security team notification

Organization: {COMPANY_NAME}
Malware Protection Lead: {IT_MANAGER_NAME}
Security Oversight: {CISO_NAME}`
  },
  {
    id: 'def-008',
    title: 'Database Security Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Database security and access controls',
    controls: ['DEF-17', 'DEF-18'],
    selected: true,
    template: `# Database Security Policy

## 1. Database Security Framework
{COMPANY_NAME} protects database systems and data through comprehensive security controls and monitoring.

## 2. Database Security Management
Database security is managed by {IT_MANAGER_NAME} with policy oversight from {CISO_NAME} and governance from {CEO_NAME}.

## 3. Security Controls
- Access control and authentication
- Data encryption at rest and in transit
- Database activity monitoring
- Vulnerability management
- Backup and recovery

## 4. Access Management
Database access requires:
- Role-based permissions
- Principle of least privilege
- Regular access reviews
- Administrative oversight

## 5. Monitoring and Auditing
- User activity logging
- Privileged access monitoring
- Query analysis
- Anomaly detection

Company: {COMPANY_NAME}
Database Administrator: {IT_MANAGER_NAME}
Security Officer: {CISO_NAME}`
  },
  {
    id: 'def-009',
    title: 'Cryptography Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Cryptographic controls and key management',
    controls: ['DEF-19', 'DEF-20'],
    selected: true,
    template: `# Cryptography Policy

## 1. Cryptographic Framework
{COMPANY_NAME} uses cryptography to protect confidentiality, integrity, and authenticity of information.

## 2. Cryptography Management
Cryptographic controls are managed by {CISO_NAME} with technical implementation by {IT_MANAGER_NAME} and governance from {CEO_NAME}.

## 3. Cryptographic Standards
- AES-256 for symmetric encryption
- RSA-2048/ECC-256 for asymmetric encryption
- SHA-256 for hashing
- Approved algorithms only

## 4. Key Management
- Secure key generation
- Protected key storage
- Regular key rotation
- Secure key disposal

## 5. Implementation Requirements
- Use of approved libraries
- Regular algorithm reviews
- Performance considerations
- Compliance validation

Organization: {COMPANY_NAME}
Cryptography Officer: {CISO_NAME}
Implementation Lead: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-010',
    title: 'Mobile Device Security Policy',
    category: 'Defence',
    priority: 'Medium',
    domain: 'Cybersecurity Defence',
    description: 'Mobile device security and management',
    controls: ['DEF-21', 'DEF-22'],
    selected: true,
    template: `# Mobile Device Security Policy

## 1. Mobile Security Framework
{COMPANY_NAME} secures mobile devices accessing corporate resources to protect against mobile-specific threats.

## 2. Mobile Security Management
Mobile security is managed by {IT_MANAGER_NAME} with policy coordination from {CISO_NAME} and executive support from {CEO_NAME}.

## 3. Device Categories
- Corporate-owned devices
- Personal devices (BYOD)
- Contractor devices
- Visitor devices

## 4. Security Requirements
- Device enrollment and management
- Application control
- Data encryption
- Remote wipe capabilities

## 5. Usage Guidelines
- Approved applications only
- Regular security updates
- Physical device protection
- Incident reporting

Company: {COMPANY_NAME}
Mobile Device Administrator: {IT_MANAGER_NAME}
Security Policy: {CISO_NAME}`
  },
  {
    id: 'def-011',
    title: 'Secure Configuration Policy',
    category: 'Defence',
    priority: 'Medium',
    domain: 'Cybersecurity Defence',
    description: 'System hardening and configuration standards',
    controls: ['DEF-23', 'DEF-24'],
    selected: true,
    template: `# Secure Configuration Policy

## 1. Configuration Management Framework
{COMPANY_NAME} implements secure configuration baselines to reduce attack surface and improve security posture.

## 2. Configuration Management Authority
Configuration management is led by {IT_MANAGER_NAME} with security validation by {CISO_NAME} and governance from {CEO_NAME}.

## 3. Configuration Standards
- Operating system hardening
- Application security settings
- Network device configuration
- Database security parameters

## 4. Configuration Process
- Baseline development
- Testing and validation
- Deployment procedures
- Compliance monitoring

## 5. Change Control
Configuration changes require:
- Security impact assessment
- Testing in non-production
- Approval workflows
- Documentation updates

Organization: {COMPANY_NAME}
Configuration Manager: {IT_MANAGER_NAME}
Security Validator: {CISO_NAME}`
  },
  {
    id: 'def-012',
    title: 'Penetration Testing Policy',
    category: 'Defence',
    priority: 'Medium',
    domain: 'Cybersecurity Defence',
    description: 'Authorized penetration testing procedures',
    controls: ['DEF-25', 'DEF-26'],
    selected: true,
    template: `# Penetration Testing Policy

## 1. Penetration Testing Framework
{COMPANY_NAME} conducts regular penetration testing to identify vulnerabilities and validate security controls.

## 2. Testing Management
Penetration testing is coordinated by {CISO_NAME} with technical oversight from {IT_MANAGER_NAME} and executive approval from {CEO_NAME}.

## 3. Testing Scope
- External network testing
- Internal network testing
- Web application testing
- Wireless network testing
- Social engineering testing

## 4. Testing Methodology
- Planning and reconnaissance
- Vulnerability assessment
- Exploitation attempts
- Post-exploitation analysis
- Reporting and remediation

## 5. Testing Authorization
All testing requires:
- Written authorization
- Scope definition
- Timeline agreement
- Incident procedures

Company: {COMPANY_NAME}
Testing Coordinator: {CISO_NAME}
Executive Authorization: {CEO_NAME}`
  },
  {
    id: 'def-013',
    title: 'Log Management Policy',
    category: 'Defence',
    priority: 'Medium',
    domain: 'Cybersecurity Defence',
    description: 'System logging and log analysis requirements',
    controls: ['DEF-27', 'DEF-28'],
    selected: true,
    template: `# Log Management Policy

## 1. Log Management Framework
{COMPANY_NAME} maintains comprehensive logging to support security monitoring, incident response, and compliance requirements.

## 2. Log Management Authority
Log management is coordinated by {IT_MANAGER_NAME} with security analysis by {CISO_NAME} and governance from {CEO_NAME}.

## 3. Logging Requirements
- Security events
- System events
- Application events
- Network events
- Administrative actions

## 4. Log Collection and Storage
- Centralized log collection
- Secure log transmission
- Protected log storage
- Long-term retention

## 5. Log Analysis
- Real-time monitoring
- Trend analysis
- Anomaly detection
- Correlation analysis

Organization: {COMPANY_NAME}
Log Administrator: {IT_MANAGER_NAME}
Security Analyst: {CISO_NAME}`
  },
  {
    id: 'def-014',
    title: 'Security Testing Policy',
    category: 'Defence',
    priority: 'Medium',
    domain: 'Cybersecurity Defence',
    description: 'Security testing standards and procedures',
    controls: ['DEF-29', 'DEF-30'],
    selected: true,
    template: `# Security Testing Policy

## 1. Security Testing Framework
{COMPANY_NAME} implements comprehensive security testing to validate the effectiveness of security controls and identify vulnerabilities.

## 2. Testing Management
Security testing is managed by {CISO_NAME} with technical execution by {IT_MANAGER_NAME} and executive oversight from {CEO_NAME}.

## 3. Testing Types
- Vulnerability scanning
- Security code review
- Configuration testing
- Access control testing
- Encryption validation

## 4. Testing Schedule
- Continuous automated testing
- Monthly vulnerability scans
- Quarterly security assessments
- Annual penetration tests

## 5. Testing Documentation
- Test plans and procedures
- Results documentation
- Remediation tracking
- Lessons learned

Company: {COMPANY_NAME}
Security Testing Lead: {CISO_NAME}
Technical Execution: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-015',
    title: 'Security Architecture Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Security architecture design and implementation',
    controls: ['DEF-31', 'DEF-32'],
    selected: true,
    template: `# Security Architecture Policy

## 1. Security Architecture Framework
{COMPANY_NAME} implements security architecture principles to ensure comprehensive protection across all systems and applications.

## 2. Architecture Authority
Security architecture is led by {CISO_NAME} with technical design by {IT_MANAGER_NAME} and executive approval from {CEO_NAME}.

## 3. Architecture Principles
- Defense in depth
- Least privilege access
- Fail-safe defaults
- Complete mediation
- Separation of duties

## 4. Architecture Components
- Network security architecture
- Application security architecture
- Data security architecture
- Identity architecture

## 5. Architecture Governance
- Design reviews
- Architecture standards
- Technology selection
- Implementation oversight

Organization: {COMPANY_NAME}
Chief Architect: {CISO_NAME}
Technical Lead: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-016',
    title: 'Threat Intelligence Policy',
    category: 'Defence',
    priority: 'Medium',
    domain: 'Cybersecurity Defence',
    description: 'Threat intelligence collection and analysis',
    controls: ['DEF-33', 'DEF-34'],
    selected: true,
    template: `# Threat Intelligence Policy

## 1. Threat Intelligence Framework
{COMPANY_NAME} leverages threat intelligence to enhance security awareness and improve defensive capabilities.

## 2. Intelligence Management
Threat intelligence is managed by {CISO_NAME} with analysis support from {IT_MANAGER_NAME} and strategic oversight from {CEO_NAME}.

## 3. Intelligence Sources
- Commercial threat feeds
- Government advisories
- Industry sharing groups
- Open source intelligence
- Internal analysis

## 4. Intelligence Process
- Collection requirements
- Processing and analysis
- Dissemination and sharing
- Action and response

## 5. Intelligence Application
- Security tool enhancement
- Risk assessment updates
- Incident response support
- Training and awareness

Company: {COMPANY_NAME}
Threat Intelligence Lead: {CISO_NAME}
Analysis Support: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-017',
    title: 'Security Operations Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: '24/7 security operations and monitoring',
    controls: ['DEF-35', 'DEF-36'],
    selected: true,
    template: `# Security Operations Policy

## 1. Security Operations Framework
{COMPANY_NAME} maintains 24/7 security operations to detect, analyze, and respond to security threats and incidents.

## 2. Operations Management
Security operations are led by {CISO_NAME} with operational management by {IT_MANAGER_NAME} and executive support from {CEO_NAME}.

## 3. Operations Scope
- Continuous monitoring
- Incident detection
- Threat analysis
- Response coordination
- Forensic support

## 4. Operations Team
- Security Operations Center (SOC)
- Incident response team
- Threat hunters
- Forensic analysts

## 5. Operations Procedures
- Event monitoring
- Alert triage
- Incident escalation
- Response execution

Organization: {COMPANY_NAME}
SOC Manager: {CISO_NAME}
Operations Lead: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-018',
    title: 'API Security Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'API security design and implementation standards',
    controls: ['DEF-37', 'DEF-38'],
    selected: true,
    template: `# API Security Policy

## 1. API Security Framework
{COMPANY_NAME} secures application programming interfaces (APIs) to protect against unauthorized access and data exposure.

## 2. API Security Management
API security is managed by {CISO_NAME} with development support from {IT_MANAGER_NAME} and governance from {CEO_NAME}.

## 3. API Security Controls
- Authentication and authorization
- Input validation
- Rate limiting
- Encryption and signing
- Monitoring and logging

## 4. API Design Requirements
- Security by design
- Minimal data exposure
- Error handling
- Version management

## 5. API Testing
- Security testing
- Penetration testing
- Vulnerability scanning
- Code review

Company: {COMPANY_NAME}
API Security Lead: {CISO_NAME}
Development Support: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-019',
    title: 'Secure Development Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Secure software development lifecycle practices',
    controls: ['DEF-39', 'DEF-40'],
    selected: true,
    template: `# Secure Development Policy

## 1. Secure Development Framework
{COMPANY_NAME} integrates security throughout the software development lifecycle to prevent vulnerabilities and ensure secure applications.

## 2. Development Security Management
Secure development is coordinated by {CISO_NAME} with development leadership from {IT_MANAGER_NAME} and executive support from {CEO_NAME}.

## 3. Security Requirements
- Security requirements analysis
- Threat modeling
- Secure coding standards
- Security testing
- Code review

## 4. Development Controls
- Static application security testing (SAST)
- Dynamic application security testing (DAST)
- Interactive application security testing (IAST)
- Software composition analysis (SCA)

## 5. Development Training
- Secure coding training
- Security awareness
- Threat modeling techniques
- Tool usage training

Organization: {COMPANY_NAME}
Secure Development Lead: {CISO_NAME}
Development Manager: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-020',
    title: 'Identity Governance Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Identity lifecycle governance and access certification',
    controls: ['DEF-41', 'DEF-42'],
    selected: true,
    template: `# Identity Governance Policy

## 1. Identity Governance Framework
{COMPANY_NAME} implements identity governance to ensure appropriate access rights throughout the identity lifecycle.

## 2. Governance Authority
Identity governance is managed by {IT_MANAGER_NAME} with policy oversight from {CISO_NAME} and executive approval from {CEO_NAME}.

## 3. Identity Lifecycle
- Identity creation and provisioning
- Access request and approval
- Periodic access certification
- Access modification
- Identity deprovisioning

## 4. Governance Processes
- Role-based access control
- Segregation of duties
- Access reviews and certification
- Privileged access governance

## 5. Governance Reporting
- Access compliance reports
- Identity risk assessments
- Governance metrics
- Audit trail documentation

Company: {COMPANY_NAME}
Identity Governance Lead: {IT_MANAGER_NAME}
Policy Authority: {CISO_NAME}
Executive Oversight: {CEO_NAME}`
  },

  // Continue with remaining Defence policies (15-20)
  {
    id: 'def-015',
    title: 'Security Architecture Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Security architecture design and implementation',
    controls: ['DEF-31', 'DEF-32'],
    selected: true,
    template: `# Security Architecture Policy

## 1. Security Architecture Framework
{COMPANY_NAME} implements security architecture principles to ensure comprehensive protection across all systems and applications.

## 2. Architecture Authority
Security architecture is led by {CISO_NAME} with technical design by {IT_MANAGER_NAME} and executive approval from {CEO_NAME}.

## 3. Architecture Principles
- Defense in depth
- Least privilege access
- Fail-safe defaults
- Complete mediation
- Separation of duties

## 4. Architecture Components
- Network security architecture
- Application security architecture
- Data security architecture
- Identity architecture

## 5. Architecture Governance
- Design reviews
- Architecture standards
- Technology selection
- Implementation oversight

Organization: {COMPANY_NAME}
Chief Architect: {CISO_NAME}
Technical Lead: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-016',
    title: 'Threat Intelligence Policy',
    category: 'Defence',
    priority: 'Medium',
    domain: 'Cybersecurity Defence',
    description: 'Threat intelligence collection and analysis',
    controls: ['DEF-33', 'DEF-34'],
    selected: true,
    template: `# Threat Intelligence Policy

## 1. Threat Intelligence Framework
{COMPANY_NAME} leverages threat intelligence to enhance security awareness and improve defensive capabilities.

## 2. Intelligence Management
Threat intelligence is managed by {CISO_NAME} with analysis support from {IT_MANAGER_NAME} and strategic oversight from {CEO_NAME}.

## 3. Intelligence Sources
- Commercial threat feeds
- Government advisories
- Industry sharing groups
- Open source intelligence
- Internal analysis

## 4. Intelligence Process
- Collection requirements
- Processing and analysis
- Dissemination and sharing
- Action and response

## 5. Intelligence Application
- Security tool enhancement
- Risk assessment updates
- Incident response support
- Training and awareness

Company: {COMPANY_NAME}
Threat Intelligence Lead: {CISO_NAME}
Analysis Support: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-017',
    title: 'Security Operations Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: '24/7 security operations and monitoring',
    controls: ['DEF-35', 'DEF-36'],
    selected: true,
    template: `# Security Operations Policy

## 1. Security Operations Framework
{COMPANY_NAME} maintains 24/7 security operations to detect, analyze, and respond to security threats and incidents.

## 2. Operations Management
Security operations are led by {CISO_NAME} with operational management by {IT_MANAGER_NAME} and executive support from {CEO_NAME}.

## 3. Operations Scope
- Continuous monitoring
- Incident detection
- Threat analysis
- Response coordination
- Forensic support

## 4. Operations Team
- Security Operations Center (SOC)
- Incident response team
- Threat hunters
- Forensic analysts

## 5. Operations Procedures
- Event monitoring
- Alert triage
- Incident escalation
- Response execution

Organization: {COMPANY_NAME}
SOC Manager: {CISO_NAME}
Operations Lead: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-018',
    title: 'API Security Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'API security design and implementation standards',
    controls: ['DEF-37', 'DEF-38'],
    selected: true,
    template: `# API Security Policy

## 1. API Security Framework
{COMPANY_NAME} secures application programming interfaces (APIs) to protect against unauthorized access and data exposure.

## 2. API Security Management
API security is managed by {CISO_NAME} with development support from {IT_MANAGER_NAME} and governance from {CEO_NAME}.

## 3. API Security Controls
- Authentication and authorization
- Input validation
- Rate limiting
- Encryption and signing
- Monitoring and logging

## 4. API Design Requirements
- Security by design
- Minimal data exposure
- Error handling
- Version management

## 5. API Testing
- Security testing
- Penetration testing
- Vulnerability scanning
- Code review

Company: {COMPANY_NAME}
API Security Lead: {CISO_NAME}
Development Support: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-019',
    title: 'Secure Development Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Secure software development lifecycle practices',
    controls: ['DEF-39', 'DEF-40'],
    selected: true,
    template: `# Secure Development Policy

## 1. Secure Development Framework
{COMPANY_NAME} integrates security throughout the software development lifecycle to prevent vulnerabilities and ensure secure applications.

## 2. Development Security Management
Secure development is coordinated by {CISO_NAME} with development leadership from {IT_MANAGER_NAME} and executive support from {CEO_NAME}.

## 3. Security Requirements
- Security requirements analysis
- Threat modeling
- Secure coding standards
- Security testing
- Code review

## 4. Development Controls
- Static application security testing (SAST)
- Dynamic application security testing (DAST)
- Interactive application security testing (IAST)
- Software composition analysis (SCA)

## 5. Development Training
- Secure coding training
- Security awareness
- Threat modeling techniques
- Tool usage training

Organization: {COMPANY_NAME}
Secure Development Lead: {CISO_NAME}
Development Manager: {IT_MANAGER_NAME}`
  },
  {
    id: 'def-020',
    title: 'Identity Governance Policy',
    category: 'Defence',
    priority: 'High',
    domain: 'Cybersecurity Defence',
    description: 'Identity lifecycle governance and access certification',
    controls: ['DEF-41', 'DEF-42'],
    selected: true,
    template: `# Identity Governance Policy

## 1. Identity Governance Framework
{COMPANY_NAME} implements identity governance to ensure appropriate access rights throughout the identity lifecycle.

## 2. Governance Authority
Identity governance is managed by {IT_MANAGER_NAME} with policy oversight from {CISO_NAME} and executive approval from {CEO_NAME}.

## 3. Identity Lifecycle
- Identity creation and provisioning
- Access request and approval
- Periodic access certification
- Access modification
- Identity deprovisioning

## 4. Governance Processes
- Role-based access control
- Segregation of duties
- Access reviews and certification
- Privileged access governance

## 5. Governance Reporting
- Access compliance reports
- Identity risk assessments
- Governance metrics
- Audit trail documentation

Company: {COMPANY_NAME}
Identity Governance Lead: {IT_MANAGER_NAME}
Policy Authority: {CISO_NAME}
Executive Oversight: {CEO_NAME}`
  },

  // Cybersecurity Resilience Domain (20 policies)
  {
    id: 'res-001',
    title: 'Backup and Recovery Policy',
    category: 'Resilience',
    priority: 'High',
    domain: 'Cybersecurity Resilience',
    description: 'Data backup and recovery procedures',
    controls: ['RES-01', 'RES-02'],
    selected: true,
    template: `# Backup and Recovery Policy

## 1. Policy Statement
{COMPANY_NAME} maintains comprehensive backup and recovery procedures to ensure business continuity and data availability.

## 2. Backup Strategy
Under the supervision of {IT_MANAGER_NAME} and oversight of {CISO_NAME}, {COMPANY_NAME} implements:
- Daily incremental backups
- Weekly full backups
- Monthly archive backups
- Offsite backup storage

## 3. Backup Scope
### Critical Data
- Customer databases
- Financial records
- Intellectual property
- System configurations

### Recovery Objectives
- Recovery Time Objective: 4 hours
- Recovery Point Objective: 1 hour
- Backup retention: 7 years for critical data

## 4. Recovery Procedures
{IT_MANAGER_NAME} maintains documented procedures for:
- System restoration
- Data recovery
- Application recovery
- Network recovery

## 5. Testing and Validation
- Monthly backup integrity testing
- Quarterly recovery drills
- Annual disaster recovery exercises
- Documentation updates

## 6. Responsibilities
- Executive Sponsor: {CEO_NAME}
- Backup Administrator: {IT_MANAGER_NAME}
- Data Owners: Department Managers
- Compliance Oversight: {COMPLIANCE_OFFICER}

Company: {COMPANY_NAME}
Headquarters: {HEADQUARTERS_LOCATION}
Established: {ESTABLISHED_YEAR}
Staff: {EMPLOYEE_COUNT} employees`
  },
  {
    id: 'res-002',
    title: 'System Monitoring Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'Continuous system monitoring and alerting',
    controls: ['RES-03', 'RES-04'],
    selected: true,
    template: `# System Monitoring Policy

## 1. Purpose
{COMPANY_NAME} implements comprehensive system monitoring to ensure operational availability, performance, and security.

## 2. Monitoring Scope
Under the management of {IT_MANAGER_NAME}, monitoring covers:
- Server infrastructure
- Network devices
- Applications
- Security systems
- Database performance

## 3. Monitoring Objectives
- 99.9% system availability
- Early threat detection
- Performance optimization
- Compliance reporting

## 4. Alerting Procedures
### Critical Alerts
- System outages
- Security incidents
- Data breaches
- Infrastructure failures

Alert recipients:
- Primary: {IT_MANAGER_NAME}
- Secondary: {CISO_NAME}
- Executive: {CEO_NAME}

## 5. Monitoring Tools
- Network monitoring systems
- Security information and event management (SIEM)
- Application performance monitoring
- Infrastructure monitoring

## 6. Reporting
Monthly reports are provided to:
- {CEO_NAME} - Executive summary
- {CISO_NAME} - Security metrics
- {COMPLIANCE_OFFICER} - Compliance status

Organization Details:
Company: {COMPANY_NAME}
Industry: {INDUSTRY}
Website: {WEBSITE}
Location: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'res-003',
    title: 'Vulnerability Management Policy',
    category: 'Resilience',
    priority: 'High',
    domain: 'Cybersecurity Resilience',
    description: 'Systematic vulnerability identification and remediation',
    controls: ['RES-05', 'RES-06'],
    selected: true,
    template: `# Vulnerability Management Policy

## 1. Policy Objective
{COMPANY_NAME} maintains a proactive vulnerability management program to identify, assess, and remediate security vulnerabilities.

## 2. Vulnerability Management Process
{CISO_NAME} leads the vulnerability management program with support from {IT_MANAGER_NAME}:

### Discovery
- Automated vulnerability scanning
- Manual security assessments
- Threat intelligence feeds
- Vendor security advisories

### Assessment
- Risk-based prioritization
- Business impact analysis
- Exploitability assessment
- Compliance requirements

### Remediation
- Critical vulnerabilities: 72 hours
- High vulnerabilities: 30 days
- Medium vulnerabilities: 90 days
- Low vulnerabilities: 180 days

## 3. Responsibilities
- Vulnerability Manager: {CISO_NAME}
- System Administrators: {IT_MANAGER_NAME}
- Business Owners: Department Managers
- Executive Oversight: {CEO_NAME}

## 4. Tools and Technologies
- Vulnerability scanners
- Patch management systems
- Configuration management
- Asset inventory systems

## 5. Reporting and Metrics
Monthly vulnerability reports include:
- Vulnerability trends
- Remediation status
- Risk exposure
- Compliance gaps

## 6. Exception Process
Vulnerabilities that cannot be immediately remediated require:
- Risk assessment by {CISO_NAME}
- Compensating controls
- Executive approval from {CEO_NAME}
- Regular review schedule

Company Information:
Name: {COMPANY_NAME}
Established: {ESTABLISHED_YEAR}
Employees: {EMPLOYEE_COUNT}
Headquarters: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'res-004',
    title: 'Change Management Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'IT change control and approval processes',
    controls: ['RES-07', 'RES-08'],
    selected: true,
    template: `# Change Management Policy

## 1. Purpose
{COMPANY_NAME} implements formal change management procedures to ensure system stability, security, and availability.

## 2. Change Control Process
All IT changes must follow the process overseen by {IT_MANAGER_NAME} and approved by {CISO_NAME}:

### Change Categories
#### Emergency Changes
- Security patches
- System outages
- Critical business requirements
- Approval: {CISO_NAME} or {CEO_NAME}

#### Standard Changes
- Routine maintenance
- Software updates
- Configuration changes
- Approval: {IT_MANAGER_NAME}

#### Major Changes
- System upgrades
- New implementations
- Architecture changes
- Approval: Change Advisory Board

## 3. Change Advisory Board
Members:
- Chair: {CISO_NAME}
- IT Manager: {IT_MANAGER_NAME}
- Compliance Officer: {COMPLIANCE_OFFICER}
- Business Representative
- Executive Sponsor: {CEO_NAME}

## 4. Change Documentation
All changes require:
- Business justification
- Risk assessment
- Implementation plan
- Rollback procedures
- Testing evidence

## 5. Implementation Guidelines
- All changes in maintenance windows
- Documented rollback procedures
- Post-implementation review
- Lessons learned documentation

## 6. Monitoring and Reporting
{IT_MANAGER_NAME} provides monthly change reports to {CEO_NAME} including:
- Change success rates
- Failed changes analysis
- Risk metrics
- Process improvements

Corporate Details:
Organization: {COMPANY_NAME}
Industry Sector: {INDUSTRY}
Corporate Website: {WEBSITE}
Primary Location: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'res-005',
    title: 'Capacity Management Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'IT resource capacity planning and management',
    controls: ['RES-09', 'RES-10'],
    selected: true,
    template: `# Capacity Management Policy

## 1. Policy Statement
{COMPANY_NAME} ensures adequate IT capacity to meet business requirements while optimizing resource utilization and cost.

## 2. Capacity Management Objectives
Under the leadership of {IT_MANAGER_NAME} and oversight of {CEO_NAME}:
- Maintain optimal system performance
- Prevent capacity-related outages
- Support business growth
- Optimize costs

## 3. Capacity Planning Process
### Performance Monitoring
- CPU, memory, storage utilization
- Network bandwidth usage
- Application response times
- Database performance metrics

### Forecasting
- Business growth projections
- Technology refresh cycles
- Application requirements
- User demand patterns

### Resource Optimization
- Virtualization strategies
- Cloud migration opportunities
- Performance tuning
- Resource reallocation

## 4. Capacity Thresholds
Alert levels managed by {IT_MANAGER_NAME}:
- Green: < 70% utilization
- Yellow: 70-85% utilization
- Red: > 85% utilization

## 5. Reporting
Quarterly capacity reports to {CEO_NAME} include:
- Current utilization levels
- Growth forecasts
- Investment recommendations
- Risk assessments

## 6. Roles and Responsibilities
- Capacity Manager: {IT_MANAGER_NAME}
- Security Oversight: {CISO_NAME}
- Business Liaison: {COMPLIANCE_OFFICER}
- Executive Sponsor: {CEO_NAME}

Company Profile:
Name: {COMPANY_NAME}
Founded: {ESTABLISHED_YEAR}
Workforce: {EMPLOYEE_COUNT}
Industry: {INDUSTRY}
Headquarters: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'res-006',
    title: 'Disaster Recovery Policy',
    category: 'Resilience',
    priority: 'High',
    domain: 'Cybersecurity Resilience',
    description: 'Disaster recovery planning and procedures',
    controls: ['RES-11', 'RES-12'],
    selected: true,
    template: `# Disaster Recovery Policy

## 1. Disaster Recovery Framework
{COMPANY_NAME} maintains comprehensive disaster recovery capabilities to restore critical operations following major disruptions.

## 2. DR Management
Disaster recovery is led by {CISO_NAME} with operational coordination by {IT_MANAGER_NAME} and executive oversight from {CEO_NAME}.

## 3. Recovery Strategies
- Data backup and restoration
- System recovery procedures
- Alternative site operations
- Communication plans

## 4. Recovery Teams
- Disaster Recovery Coordinator: {CISO_NAME}
- Technical Recovery Team: {IT_MANAGER_NAME}
- Business Recovery Team: {COMPLIANCE_OFFICER}
- Executive Command: {CEO_NAME}

## 5. Testing and Maintenance
- Annual DR exercises
- Plan updates and reviews
- Technology refresh
- Training programs

Company: {COMPANY_NAME}
DR Coordinator: {CISO_NAME}
Executive Sponsor: {CEO_NAME}`
  },
  {
    id: 'res-007',
    title: 'Incident Management Policy',
    category: 'Resilience',
    priority: 'High',
    domain: 'Cybersecurity Resilience',
    description: 'IT service incident management procedures',
    controls: ['RES-13', 'RES-14'],
    selected: true,
    template: `# Incident Management Policy

## 1. Incident Management Framework
{COMPANY_NAME} implements structured incident management to minimize business impact and restore normal operations quickly.

## 2. Incident Management Authority
Incident management is coordinated by {IT_MANAGER_NAME} with security incidents escalated to {CISO_NAME} and executive notification to {CEO_NAME}.

## 3. Incident Categories
- Priority 1: Critical business impact
- Priority 2: High business impact
- Priority 3: Medium business impact
- Priority 4: Low business impact

## 4. Response Procedures
- Incident detection and logging
- Classification and prioritization
- Investigation and diagnosis
- Resolution and recovery
- Closure and review

## 5. Escalation Matrix
- Level 1: Service Desk
- Level 2: Technical Specialists
- Level 3: Senior Engineers
- Level 4: Vendor Support

Organization: {COMPANY_NAME}
Incident Manager: {IT_MANAGER_NAME}
Security Escalation: {CISO_NAME}`
  },
  {
    id: 'res-008',
    title: 'Problem Management Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'Root cause analysis and problem resolution',
    controls: ['RES-15', 'RES-16'],
    selected: true,
    template: `# Problem Management Policy

## 1. Problem Management Framework
{COMPANY_NAME} implements proactive problem management to identify and resolve root causes of recurring incidents.

## 2. Problem Management Authority
Problem management is led by {IT_MANAGER_NAME} with quality oversight from {CISO_NAME} and governance from {CEO_NAME}.

## 3. Problem Categories
- Known problems with workarounds
- Problem under investigation
- Problem requiring vendor support
- Proactive problem identification

## 4. Problem Process
- Problem identification
- Problem investigation
- Workaround implementation
- Root cause analysis
- Permanent solution

## 5. Problem Review
- Monthly problem reviews
- Trend analysis
- Process improvements
- Knowledge base updates

Company: {COMPANY_NAME}
Problem Manager: {IT_MANAGER_NAME}
Quality Oversight: {CISO_NAME}`
  },
  {
    id: 'res-009',
    title: 'Service Continuity Policy',
    category: 'Resilience',
    priority: 'High',
    domain: 'Cybersecurity Resilience',
    description: 'IT service continuity planning and management',
    controls: ['RES-17', 'RES-18'],
    selected: true,
    template: `# Service Continuity Policy

## 1. Service Continuity Framework
{COMPANY_NAME} ensures continuity of critical IT services to support business operations during disruptions.

## 2. Continuity Management
Service continuity is managed by {IT_MANAGER_NAME} with business alignment by {COMPLIANCE_OFFICER} and executive support from {CEO_NAME}.

## 3. Service Dependencies
- Critical business services
- Supporting IT services
- Infrastructure dependencies
- Vendor service dependencies

## 4. Continuity Strategies
- Service redundancy
- Failover procedures
- Load balancing
- Geographic distribution

## 5. Testing and Validation
- Regular continuity testing
- Service impact analysis
- Recovery validation
- Plan maintenance

Organization: {COMPANY_NAME}
Service Continuity Manager: {IT_MANAGER_NAME}
Business Liaison: {COMPLIANCE_OFFICER}`
  },
  {
    id: 'res-010',
    title: 'Configuration Management Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'IT configuration management and CMDB',
    controls: ['RES-19', 'RES-20'],
    selected: true,
    template: `# Configuration Management Policy

## 1. Configuration Management Framework
{COMPANY_NAME} maintains accurate configuration information to support effective IT service management and change control.

## 2. Configuration Management Authority
Configuration management is led by {IT_MANAGER_NAME} with data governance from {CISO_NAME} and oversight from {CEO_NAME}.

## 3. Configuration Items (CIs)
- Hardware components
- Software applications
- Network components
- Documentation
- Personnel information

## 4. CMDB Management
- Configuration discovery
- Data accuracy validation
- Relationship mapping
- Change tracking

## 5. Configuration Control
- Baseline establishment
- Change authorization
- Version control
- Audit procedures

Company: {COMPANY_NAME}
Configuration Manager: {IT_MANAGER_NAME}
Data Governance: {CISO_NAME}`
  },
  {
    id: 'res-011',
    title: 'Availability Management Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'IT service availability planning and monitoring',
    controls: ['RES-21', 'RES-22'],
    selected: true,
    template: `# Availability Management Policy

## 1. Availability Management Framework
{COMPANY_NAME} ensures IT services meet agreed availability requirements to support business objectives.

## 2. Availability Management Authority
Availability management is coordinated by {IT_MANAGER_NAME} with reliability engineering support and executive oversight from {CEO_NAME}.

## 3. Availability Requirements
- Service level agreements
- Business availability requirements
- Recovery time objectives
- Recovery point objectives

## 4. Availability Design
- Redundancy planning
- Fault tolerance
- Load distribution
- Maintenance windows

## 5. Availability Monitoring
- Real-time monitoring
- Performance trending
- Availability reporting
- Improvement planning

Organization: {COMPANY_NAME}
Availability Manager: {IT_MANAGER_NAME}
Executive Sponsor: {CEO_NAME}`
  },
  {
    id: 'res-012',
    title: 'Performance Management Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'IT performance monitoring and optimization',
    controls: ['RES-23', 'RES-24'],
    selected: true,
    template: `# Performance Management Policy

## 1. Performance Management Framework
{COMPANY_NAME} monitors and optimizes IT performance to ensure services meet business requirements and user expectations.

## 2. Performance Management Authority
Performance management is led by {IT_MANAGER_NAME} with analytics support and governance from {CEO_NAME}.

## 3. Performance Metrics
- Response time
- Throughput
- Resource utilization
- Error rates
- User satisfaction

## 4. Performance Monitoring
- Real-time monitoring
- Trend analysis
- Threshold alerting
- Capacity planning

## 5. Performance Optimization
- Bottleneck identification
- Tuning activities
- Capacity upgrades
- Process improvements

Company: {COMPANY_NAME}
Performance Manager: {IT_MANAGER_NAME}
Analytics Lead: {CISO_NAME}`
  },
  {
    id: 'res-013',
    title: 'IT Asset Recovery Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'IT asset recovery and restoration procedures',
    controls: ['RES-25', 'RES-26'],
    selected: true,
    template: `# IT Asset Recovery Policy

## 1. Asset Recovery Framework
{COMPANY_NAME} maintains procedures for rapid recovery and restoration of critical IT assets during and after incidents.

## 2. Recovery Management
Asset recovery is coordinated by {IT_MANAGER_NAME} with security validation by {CISO_NAME} and executive oversight from {CEO_NAME}.

## 3. Asset Categories
- Critical servers and systems
- Network infrastructure
- Data storage systems
- Security appliances
- Communication systems

## 4. Recovery Procedures
- Asset inventory verification
- Damage assessment
- Recovery prioritization
- Restoration execution
- Validation testing

## 5. Recovery Resources
- Spare equipment inventory
- Vendor support contracts
- Emergency procurement
- Alternative solutions

Organization: {COMPANY_NAME}
Asset Recovery Lead: {IT_MANAGER_NAME}
Security Validation: {CISO_NAME}`
  },
  {
    id: 'res-014',
    title: 'Data Recovery Policy',
    category: 'Resilience',
    priority: 'High',
    domain: 'Cybersecurity Resilience',
    description: 'Data recovery and restoration procedures',
    controls: ['RES-27', 'RES-28'],
    selected: true,
    template: `# Data Recovery Policy

## 1. Data Recovery Framework
{COMPANY_NAME} implements comprehensive data recovery procedures to restore critical information following data loss incidents.

## 2. Recovery Authority
Data recovery is managed by {IT_MANAGER_NAME} with security oversight from {CISO_NAME} and business coordination by {COMPLIANCE_OFFICER}.

## 3. Data Recovery Scope
- Database restoration
- File system recovery
- Application data recovery
- Configuration data restoration

## 4. Recovery Procedures
- Data loss assessment
- Recovery point determination
- Backup verification
- Recovery execution
- Data integrity validation

## 5. Recovery Testing
- Regular recovery drills
- Backup integrity testing
- Recovery time validation
- Process improvement

Company: {COMPANY_NAME}
Data Recovery Manager: {IT_MANAGER_NAME}
Security Oversight: {CISO_NAME}
Business Coordination: {COMPLIANCE_OFFICER}`
  },
  {
    id: 'res-015',
    title: 'Communication Recovery Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'Communication system recovery and continuity',
    controls: ['RES-29', 'RES-30'],
    selected: true,
    template: `# Communication Recovery Policy

## 1. Communication Recovery Framework
{COMPANY_NAME} ensures rapid recovery of communication systems to maintain business operations and stakeholder connectivity.

## 2. Recovery Management
Communication recovery is led by {IT_MANAGER_NAME} with coordination support from {COMPLIANCE_OFFICER} and executive oversight from {CEO_NAME}.

## 3. Communication Systems
- Email systems
- Voice communications
- Video conferencing
- Instant messaging
- External communications

## 4. Recovery Strategies
- Redundant communication paths
- Alternative service providers
- Mobile communication options
- Emergency communication procedures

## 5. Recovery Procedures
- System status assessment
- Alternative activation
- User notification
- Service restoration
- Normal operations resume

Organization: {COMPANY_NAME}
Communication Recovery Lead: {IT_MANAGER_NAME}
Coordination: {COMPLIANCE_OFFICER}`
  },
  {
    id: 'res-016',
    title: 'Supply Chain Resilience Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'IT supply chain resilience and continuity',
    controls: ['RES-31', 'RES-32'],
    selected: true,
    template: `# Supply Chain Resilience Policy

## 1. Supply Chain Resilience Framework
{COMPANY_NAME} builds resilience into IT supply chain relationships to ensure continuity of critical services and supplies.

## 2. Resilience Management
Supply chain resilience is managed by {COMPLIANCE_OFFICER} with technical assessment by {IT_MANAGER_NAME} and governance from {CEO_NAME}.

## 3. Critical Suppliers
- Technology vendors
- Service providers
- Cloud providers
- Maintenance contractors
- Security suppliers

## 4. Resilience Strategies
- Supplier diversification
- Alternate supply sources
- Contract terms for continuity
- Supplier monitoring

## 5. Continuity Planning
- Supplier risk assessment
- Contingency procedures
- Emergency procurement
- Relationship management

Company: {COMPANY_NAME}
Supply Chain Manager: {COMPLIANCE_OFFICER}
Technical Assessment: {IT_MANAGER_NAME}`
  },
  {
    id: 'res-017',
    title: 'Operational Resilience Policy',
    category: 'Resilience',
    priority: 'High',
    domain: 'Cybersecurity Resilience',
    description: 'Overall operational resilience framework',
    controls: ['RES-33', 'RES-34'],
    selected: true,
    template: `# Operational Resilience Policy

## 1. Operational Resilience Framework
{COMPANY_NAME} builds operational resilience to absorb, adapt, and recover from operational disruptions while maintaining critical functions.

## 2. Resilience Governance
Operational resilience is led by {CEO_NAME} with coordination by {CISO_NAME} and operational management by {IT_MANAGER_NAME}.

## 3. Resilience Capabilities
- Risk identification and assessment
- Impact tolerance setting
- Scenario testing
- Response and recovery
- Learning and adaptation

## 4. Critical Operations
- Customer-facing services
- Payment processing
- Data processing
- Communication systems
- Security functions

## 5. Resilience Testing
- Scenario-based testing
- Stress testing
- Recovery exercises
- Lessons learned integration

Organization: {COMPANY_NAME}
Chief Resilience Officer: {CEO_NAME}
Operational Lead: {CISO_NAME}`
  },
  {
    id: 'res-018',
    title: 'Crisis Communication Policy',
    category: 'Resilience',
    priority: 'High',
    domain: 'Cybersecurity Resilience',
    description: 'Crisis communication procedures and protocols',
    controls: ['RES-35', 'RES-36'],
    selected: true,
    template: `# Crisis Communication Policy

## 1. Crisis Communication Framework
{COMPANY_NAME} maintains effective crisis communication to ensure timely, accurate information flow during emergencies.

## 2. Communication Authority
Crisis communication is led by {CEO_NAME} with operational coordination by {COMPLIANCE_OFFICER} and technical support from {CISO_NAME}.

## 3. Communication Audiences
- Internal stakeholders
- Customers and clients
- Regulatory authorities
- Media and public
- Business partners

## 4. Communication Channels
- Internal communication systems
- Public relations channels
- Regulatory reporting
- Customer notification
- Social media management

## 5. Message Management
- Approved messaging templates
- Fact verification procedures
- Spokesperson designation
- Timeline coordination

Company: {COMPANY_NAME}
Crisis Communication Lead: {CEO_NAME}
Operational Coordinator: {COMPLIANCE_OFFICER}`
  },
  {
    id: 'res-019',
    title: 'Recovery Testing Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'Recovery and resilience testing procedures',
    controls: ['RES-37', 'RES-38'],
    selected: true,
    template: `# Recovery Testing Policy

## 1. Recovery Testing Framework
{COMPANY_NAME} conducts regular recovery testing to validate the effectiveness of business continuity and disaster recovery plans.

## 2. Testing Management
Recovery testing is coordinated by {CISO_NAME} with technical execution by {IT_MANAGER_NAME} and executive oversight from {CEO_NAME}.

## 3. Testing Types
- Desktop exercises
- Functional testing
- Full-scale exercises
- Component testing
- End-to-end testing

## 4. Testing Schedule
- Monthly component tests
- Quarterly functional tests
- Annual full-scale exercises
- Ad-hoc scenario testing

## 5. Testing Documentation
- Test plans and procedures
- Results and findings
- Improvement recommendations
- Plan updates

Organization: {COMPANY_NAME}
Recovery Testing Lead: {CISO_NAME}
Technical Execution: {IT_MANAGER_NAME}`
  },
  {
    id: 'res-020',
    title: 'Resilience Metrics Policy',
    category: 'Resilience',
    priority: 'Medium',
    domain: 'Cybersecurity Resilience',
    description: 'Resilience measurement and reporting',
    controls: ['RES-39', 'RES-40'],
    selected: true,
    template: `# Resilience Metrics Policy

## 1. Resilience Metrics Framework
{COMPANY_NAME} measures and reports on resilience capabilities to demonstrate preparedness and drive continuous improvement.

## 2. Metrics Management
Resilience metrics are managed by {CISO_NAME} with data collection by {IT_MANAGER_NAME} and reporting to {CEO_NAME}.

## 3. Key Metrics
- Recovery time actuals vs. objectives
- System availability performance
- Incident response effectiveness
- Test exercise success rates
- Business impact minimization

## 4. Reporting Framework
- Monthly operational reports
- Quarterly resilience assessments
- Annual resilience reviews
- Executive dashboards

## 5. Improvement Process
- Metric trend analysis
- Performance gap identification
- Corrective action planning
- Best practice implementation

Company: {COMPANY_NAME}
Resilience Metrics Lead: {CISO_NAME}
Data Collection: {IT_MANAGER_NAME}
Executive Reporting: {CEO_NAME}`
  },

  // Third Party Cloud Computing Domain (10 policies)
  {
    id: 'cloud-001',
    title: 'Cloud Security Policy',
    category: 'Cloud',
    priority: 'High',
    domain: 'Third Party Cloud Computing',
    description: 'Cloud service security requirements and governance',
    controls: ['CLOUD-01', 'CLOUD-02'],
    selected: true,
    template: `# Cloud Security Policy

## 1. Policy Overview
{COMPANY_NAME} utilizes cloud services to enhance business capabilities while maintaining security, privacy, and compliance requirements.

## 2. Cloud Governance
Cloud security governance is led by {CISO_NAME} with operational support from {IT_MANAGER_NAME} and executive oversight from {CEO_NAME}.

## 3. Cloud Service Categories
### Infrastructure as a Service (IaaS)
- Virtual machines and storage
- Network services
- Security controls validation

### Platform as a Service (PaaS)
- Development platforms
- Database services
- Application frameworks

### Software as a Service (SaaS)
- Business applications
- Collaboration tools
- Productivity software

## 4. Security Requirements
All cloud services must provide:
- Data encryption in transit and at rest
- Identity and access management
- Audit logging and monitoring
- Compliance certifications
- Incident response capabilities

## 5. Vendor Assessment
Cloud providers must demonstrate:
- Security certifications (SOC 2, ISO 27001)
- Compliance frameworks
- Data residency controls
- Breach notification procedures
- Service level agreements

## 6. Data Classification in Cloud
- Public data: Any approved cloud service
- Internal data: Approved cloud services with encryption
- Confidential data: Restricted cloud services only
- Restricted data: On-premises or approved private cloud

## 7. Responsibilities
- Cloud Security Officer: {CISO_NAME}
- Cloud Operations: {IT_MANAGER_NAME}
- Compliance Oversight: {COMPLIANCE_OFFICER}
- Executive Sponsor: {CEO_NAME}

Organization Information:
Company: {COMPANY_NAME}
Industry: {INDUSTRY}
Location: {HEADQUARTERS_LOCATION}
Established: {ESTABLISHED_YEAR}
Website: {WEBSITE}`
  },
  {
    id: 'cloud-002',
    title: 'Cloud Data Protection Policy',
    category: 'Cloud',
    priority: 'High',
    domain: 'Third Party Cloud Computing',
    description: 'Data protection requirements for cloud services',
    controls: ['CLOUD-03', 'CLOUD-04'],
    selected: true,
    template: `# Cloud Data Protection Policy

## 1. Purpose
{COMPANY_NAME} ensures appropriate protection of data stored, processed, or transmitted through cloud services.

## 2. Data Protection Framework
{COMPLIANCE_OFFICER} oversees data protection in cloud environments with technical implementation by {IT_MANAGER_NAME} and security oversight by {CISO_NAME}.

## 3. Data Encryption Requirements
### Data at Rest
- AES-256 encryption minimum
- Key management by {COMPANY_NAME}
- Regular key rotation
- Secure key storage

### Data in Transit
- TLS 1.3 minimum
- Certificate validation
- Perfect forward secrecy
- End-to-end encryption for sensitive data

### Data in Processing
- Confidential computing where available
- Secure enclaves
- Memory encryption
- Process isolation

## 4. Data Residency and Sovereignty
- Customer data remains in approved jurisdictions
- Government access procedures documented
- Legal framework compliance
- Cross-border transfer controls

## 5. Backup and Recovery
Cloud backup requirements:
- Automated backup procedures
- Geographic distribution
- Recovery testing
- Data integrity validation

## 6. Data Loss Prevention
- Cloud DLP solutions deployed
- Content inspection
- Policy enforcement
- Incident alerting to {CISO_NAME}

## 7. Privacy Compliance
Ensure compliance with:
- Data protection regulations
- Privacy frameworks
- Industry standards
- Contractual obligations

Management Authority:
CEO: {CEO_NAME}
CISO: {CISO_NAME}
Company: {COMPANY_NAME}
Employees: {EMPLOYEE_COUNT}
Headquarters: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'cloud-003',
    title: 'Cloud Identity and Access Management Policy',
    category: 'Cloud',
    priority: 'High',
    domain: 'Third Party Cloud Computing',
    description: 'Identity management for cloud services',
    controls: ['CLOUD-05', 'CLOUD-06'],
    selected: true,
    template: `# Cloud Identity and Access Management Policy

## 1. Policy Statement
{COMPANY_NAME} implements centralized identity and access management for all cloud services to ensure secure and compliant access.

## 2. Identity Management Framework
{IT_MANAGER_NAME} administers cloud identity systems with security oversight from {CISO_NAME} and policy governance from {CEO_NAME}.

## 3. Single Sign-On (SSO)
All cloud applications must integrate with {COMPANY_NAME} SSO system:
- SAML 2.0 or OAuth 2.0/OIDC
- Centralized authentication
- Session management
- Audit trail integration

## 4. Multi-Factor Authentication
MFA required for:
- All administrative access
- External network access
- Sensitive application access
- Privileged operations

## 5. Privileged Access Management
Cloud privileged access requires:
- Just-in-time access provisioning
- Session recording
- Approval workflows
- Regular access reviews

## 6. Federation and Trust
Cloud identity federation must:
- Use approved identity providers
- Implement attribute mapping
- Maintain trust relationships
- Monitor federation health

## 7. Access Reviews
Quarterly access reviews conducted by:
- Data owners
- Application administrators
- {IT_MANAGER_NAME}
- {CISO_NAME}

## 8. Deprovisioning
Account deprovisioning procedures:
- Automated where possible
- Manual verification required
- Complete access removal
- Audit trail maintenance

Organization Profile:
Name: {COMPANY_NAME}
Industry: {INDUSTRY}
Founded: {ESTABLISHED_YEAR}
Staff Size: {EMPLOYEE_COUNT}
Primary Location: {HEADQUARTERS_LOCATION}
Corporate Site: {WEBSITE}`
  },
  {
    id: 'cloud-004',
    title: 'Cloud Monitoring and Logging Policy',
    category: 'Cloud',
    priority: 'Medium',
    domain: 'Third Party Cloud Computing',
    description: 'Cloud environment monitoring and audit logging',
    controls: ['CLOUD-07', 'CLOUD-08'],
    selected: true,
    template: `# Cloud Monitoring and Logging Policy

## 1. Objective
{COMPANY_NAME} maintains comprehensive monitoring and logging for all cloud services to ensure security, compliance, and operational visibility.

## 2. Monitoring Framework
Cloud monitoring is managed by {IT_MANAGER_NAME} with security analysis by {CISO_NAME} and compliance oversight by {COMPLIANCE_OFFICER}.

## 3. Log Collection Requirements
### System Logs
- Authentication events
- Authorization decisions
- Administrative actions
- Configuration changes
- Error conditions

### Security Logs
- Failed login attempts
- Privilege escalations
- Policy violations
- Threat detections
- Incident responses

### Application Logs
- User activities
- Data access events
- Transaction logs
- Performance metrics
- Error tracking

## 4. Log Management
Centralized logging includes:
- Real-time log aggregation
- Long-term log retention
- Log integrity protection
- Secure log transmission

## 5. Security Monitoring
24/7 security monitoring covers:
- Threat detection
- Anomaly identification
- Compliance violations
- Performance issues
- Availability problems

## 6. Alerting and Response
Alert escalation procedures:
- Level 1: {IT_MANAGER_NAME}
- Level 2: {CISO_NAME}
- Level 3: {CEO_NAME}

## 7. Compliance Reporting
Regular compliance reports to {COMPLIANCE_OFFICER} include:
- Audit trail summaries
- Policy compliance status
- Security incident reports
- Access review results

Company Details:
Organization: {COMPANY_NAME}
Business Sector: {INDUSTRY}
Establishment Year: {ESTABLISHED_YEAR}
Team Size: {EMPLOYEE_COUNT} personnel
Corporate Headquarters: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'cloud-005',
    title: 'Cloud Vendor Management Policy',
    category: 'Cloud',
    priority: 'Medium',
    domain: 'Third Party Cloud Computing',
    description: 'Cloud service provider evaluation and management',
    controls: ['CLOUD-09', 'CLOUD-10'],
    selected: true,
    template: `# Cloud Vendor Management Policy

## 1. Policy Purpose
{COMPANY_NAME} establishes vendor management procedures to ensure cloud service providers meet security, compliance, and business requirements.

## 2. Vendor Governance
Vendor management is led by {COMPLIANCE_OFFICER} with technical evaluation by {IT_MANAGER_NAME}, security assessment by {CISO_NAME}, and final approval from {CEO_NAME}.

## 3. Vendor Selection Criteria
### Security Requirements
- Security certifications (ISO 27001, SOC 2)
- Compliance frameworks
- Security assessment results
- Incident response capabilities
- Data protection measures

### Business Requirements
- Service level agreements
- Financial stability
- Geographic presence
- Scalability options
- Integration capabilities

## 4. Due Diligence Process
Vendor evaluation includes:
- Security questionnaire
- Technical assessment
- Reference checks
- Financial review
- Risk assessment

## 5. Contract Requirements
All cloud contracts must include:
- Data ownership clauses
- Security requirements
- Compliance obligations
- Audit rights
- Breach notification procedures
- Termination conditions

## 6. Ongoing Management
Regular vendor reviews by {COMPLIANCE_OFFICER}:
- Performance monitoring
- Security assessments
- Compliance audits
- Risk reassessment
- Contract renewals

## 7. Vendor Risk Assessment
Annual risk assessments consider:
- Security posture changes
- Compliance status
- Financial stability
- Technology updates
- Market conditions

## 8. Exit Strategy
Vendor termination procedures:
- Data migration planning
- Service transition
- Contract termination
- Asset return
- Relationship closure

Corporate Information:
Company Name: {COMPANY_NAME}
Industry Classification: {INDUSTRY}
Corporate Website: {WEBSITE}
Year Established: {ESTABLISHED_YEAR}
Workforce: {EMPLOYEE_COUNT} employees
Headquarters Location: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'cloud-006',
    title: 'Cloud Incident Response Policy',
    category: 'Cloud',
    priority: 'High',
    domain: 'Third Party Cloud Computing',
    description: 'Cloud-specific incident response procedures',
    controls: ['CLOUD-11', 'CLOUD-12'],
    selected: true,
    template: `# Cloud Incident Response Policy

## 1. Cloud Incident Response Framework
{COMPANY_NAME} implements specialized incident response procedures for cloud environments to address unique cloud security challenges.

## 2. Cloud Incident Management
Cloud incident response is led by {CISO_NAME} with cloud operations support from {IT_MANAGER_NAME} and executive coordination by {CEO_NAME}.

## 3. Cloud Incident Types
- Data breaches in cloud storage
- Compromised cloud accounts
- Misconfigured cloud services
- Cloud service outages
- Unauthorized cloud access

## 4. Response Procedures
- Cloud-specific detection and analysis
- Cloud service provider notification
- Evidence preservation in cloud
- Containment and eradication
- Cloud service restoration

## 5. Cloud Provider Coordination
- Incident notification procedures
- Evidence collection support
- Forensic investigation assistance
- Recovery coordination

Company: {COMPANY_NAME}
Cloud Incident Lead: {CISO_NAME}
Cloud Operations: {IT_MANAGER_NAME}
Executive Coordination: {CEO_NAME}`
  },
  {
    id: 'cloud-007',
    title: 'Cloud Configuration Management Policy',
    category: 'Cloud',
    priority: 'Medium',
    domain: 'Third Party Cloud Computing',
    description: 'Cloud service configuration and hardening standards',
    controls: ['CLOUD-13', 'CLOUD-14'],
    selected: true,
    template: `# Cloud Configuration Management Policy

## 1. Cloud Configuration Framework
{COMPANY_NAME} implements secure configuration standards for all cloud services to reduce security risks and ensure compliance.

## 2. Configuration Management Authority
Cloud configuration is managed by {IT_MANAGER_NAME} with security validation by {CISO_NAME} and governance from {CEO_NAME}.

## 3. Configuration Standards
- Identity and access management settings
- Network security configurations
- Storage security settings
- Logging and monitoring configurations
- Encryption implementations

## 4. Configuration Baseline
- Secure configuration templates
- Automated deployment scripts
- Compliance validation tools
- Configuration drift detection

## 5. Change Management
- Configuration change approval
- Testing in non-production
- Security impact assessment
- Rollback procedures

Organization: {COMPANY_NAME}
Cloud Configuration Manager: {IT_MANAGER_NAME}
Security Validation: {CISO_NAME}`
  },
  {
    id: 'cloud-008',
    title: 'Multi-Cloud Security Policy',
    category: 'Cloud',
    priority: 'Medium',
    domain: 'Third Party Cloud Computing',
    description: 'Security requirements for multi-cloud environments',
    controls: ['CLOUD-15', 'CLOUD-16'],
    selected: true,
    template: `# Multi-Cloud Security Policy

## 1. Multi-Cloud Security Framework
{COMPANY_NAME} implements consistent security controls across multiple cloud providers to maintain unified security posture.

## 2. Multi-Cloud Governance
Multi-cloud security is coordinated by {CISO_NAME} with cloud architecture by {IT_MANAGER_NAME} and strategy oversight by {CEO_NAME}.

## 3. Cloud Provider Requirements
- Consistent security baselines
- Standardized access controls
- Unified monitoring and logging
- Common incident response procedures

## 4. Cross-Cloud Security
- Identity federation
- Network connectivity security
- Data transfer protection
- Compliance consistency

## 5. Cloud Integration
- API security between clouds
- Workload portability security
- Disaster recovery across clouds
- Cost optimization security

Company: {COMPANY_NAME}
Multi-Cloud Security Lead: {CISO_NAME}
Cloud Architecture: {IT_MANAGER_NAME}`
  },
  {
    id: 'cloud-009',
    title: 'Cloud Backup and Recovery Policy',
    category: 'Cloud',
    priority: 'High',
    domain: 'Third Party Cloud Computing',
    description: 'Cloud-based backup and recovery procedures',
    controls: ['CLOUD-17', 'CLOUD-18'],
    selected: true,
    template: `# Cloud Backup and Recovery Policy

## 1. Cloud Backup Framework
{COMPANY_NAME} implements comprehensive cloud backup and recovery procedures to protect data and ensure business continuity.

## 2. Backup Management
Cloud backup is managed by {IT_MANAGER_NAME} with security oversight from {CISO_NAME} and business coordination by {CEO_NAME}.

## 3. Backup Strategy
- Automated cloud backups
- Cross-region replication
- Point-in-time recovery
- Long-term archival

## 4. Recovery Procedures
- Recovery time objectives (RTO)
- Recovery point objectives (RPO)
- Business priority restoration
- Data integrity validation

## 5. Testing and Validation
- Regular recovery testing
- Backup integrity verification
- Cross-cloud recovery testing
- Disaster simulation exercises

Organization: {COMPANY_NAME}
Cloud Backup Manager: {IT_MANAGER_NAME}
Security Oversight: {CISO_NAME}
Business Coordination: {CEO_NAME}`
  },
  {
    id: 'cloud-010',
    title: 'Cloud Cost Security Policy',
    category: 'Cloud',
    priority: 'Medium',
    domain: 'Third Party Cloud Computing',
    description: 'Security considerations for cloud cost management',
    controls: ['CLOUD-19', 'CLOUD-20'],
    selected: true,
    template: `# Cloud Cost Security Policy

## 1. Cloud Cost Security Framework
{COMPANY_NAME} integrates security considerations into cloud cost management to prevent cost-related security compromises.

## 2. Cost Security Management
Cloud cost security is coordinated by {COMPLIANCE_OFFICER} with technical implementation by {IT_MANAGER_NAME} and oversight by {CEO_NAME}.

## 3. Cost Security Principles
- Security controls maintained during cost optimization
- Resource right-sizing without security compromise
- Reserved instance security validation
- Cost monitoring for security anomalies

## 4. Financial Security Controls
- Budget alerts for security services
- Cost center security accountability
- Vendor payment security
- Contract security compliance

## 5. Cost-Security Balance
- Security investment justification
- Risk-based cost decisions
- Security service optimization
- Compliance cost management

Company: {COMPANY_NAME}
Cloud Financial Security: {COMPLIANCE_OFFICER}
Technical Implementation: {IT_MANAGER_NAME}
Executive Oversight: {CEO_NAME}`
  },

  // Industrial Control Systems Domain (10 policies)
  {
    id: 'ics-001',
    title: 'Industrial Control Systems Security Policy',
    category: 'ICS',
    priority: 'High',
    domain: 'Industrial Control Systems',
    description: 'Security framework for industrial control systems and SCADA',
    controls: ['ICS-01', 'ICS-02'],
    selected: false,
    template: `# Industrial Control Systems Security Policy

## 1. Policy Statement
{COMPANY_NAME} implements comprehensive security measures for industrial control systems (ICS), SCADA systems, and operational technology (OT) environments.

## 2. ICS Security Governance
ICS security is managed by {CISO_NAME} with operational support from {IT_MANAGER_NAME} and executive oversight from {CEO_NAME}.

## 3. Network Segmentation
ICS networks must be:
- Physically separated from corporate networks
- Protected by industrial firewalls
- Monitored continuously
- Access controlled through secure gateways

## 4. Access Control
ICS access requires:
- Role-based access control
- Multi-factor authentication
- Privileged access management
- Regular access reviews

## 5. Change Management
All ICS changes require:
- Risk assessment
- Testing in isolated environment
- Change approval process
- Rollback procedures

## 6. Security Monitoring
Continuous monitoring includes:
- Network traffic analysis
- Anomaly detection
- Threat hunting
- Incident response

## 7. Vendor Management
ICS vendor requirements:
- Security assessments
- Secure development practices
- Vulnerability disclosure
- Incident response procedures

## 8. Personnel Security
ICS personnel must:
- Undergo background checks
- Complete specialized training
- Maintain security clearances
- Follow secure procedures

Authority Structure:
Chief Executive Officer: {CEO_NAME}
Chief Information Security Officer: {CISO_NAME}
IT Manager: {IT_MANAGER_NAME}
Organization: {COMPANY_NAME}
Location: {HEADQUARTERS_LOCATION}`
  },
  {
    id: 'ics-002',
    title: 'SCADA Security Policy',
    category: 'ICS',
    priority: 'High',
    domain: 'Industrial Control Systems',
    description: 'SCADA system specific security requirements',
    controls: ['ICS-03', 'ICS-04'],
    selected: false,
    template: `# SCADA Security Policy

## 1. Purpose
{COMPANY_NAME} protects Supervisory Control and Data Acquisition (SCADA) systems from cyber threats while ensuring operational continuity.

## 2. SCADA Architecture Security
Under the direction of {IT_MANAGER_NAME} and oversight of {CISO_NAME}, SCADA systems implement:
- Defense-in-depth strategies
- Network segmentation
- Secure communication protocols
- Redundancy and failover

## 3. Authentication and Authorization
SCADA access control:
- Strong authentication mechanisms
- Role-based access control
- Principle of least privilege
- Regular credential rotation

## 4. Network Security
SCADA network protection:
- Dedicated network infrastructure
- Industrial firewalls and DMZ
- VPN for remote access
- Network monitoring and intrusion detection

## 5. Data Integrity
SCADA data protection:
- Cryptographic protection
- Data validation
- Secure data transmission
- Backup and recovery procedures

## 6. Incident Response
SCADA-specific incident procedures:
- Rapid detection and analysis
- Isolation and containment
- Recovery and restoration
- Lessons learned integration

## 7. Maintenance and Updates
SCADA system maintenance:
- Scheduled maintenance windows
- Security patch management
- Configuration management
- Change control procedures

## 8. Personnel Training
SCADA operators must complete:
- Security awareness training
- System-specific training
- Incident response procedures
- Regular refresher training

Management Team:
CEO: {CEO_NAME}
CISO: {CISO_NAME}
IT Manager: {IT_MANAGER_NAME}
Compliance Officer: {COMPLIANCE_OFFICER}
Company: {COMPANY_NAME}
Industry: {INDUSTRY}`
  },
  {
    id: 'ics-003',
    title: 'Operational Technology Security Policy',
    category: 'ICS',
    priority: 'Medium',
    domain: 'Industrial Control Systems',
    description: 'Security requirements for operational technology environments',
    controls: ['ICS-05', 'ICS-06'],
    selected: false,
    template: `# Operational Technology Security Policy

## 1. Policy Overview
{COMPANY_NAME} secures operational technology (OT) environments to protect critical infrastructure and maintain operational safety.

## 2. OT Security Framework
OT security management by {CISO_NAME} includes:
- Asset inventory and classification
- Risk assessment and management
- Security control implementation
- Continuous monitoring

## 3. Asset Management
OT asset inventory includes:
- Industrial control systems
- Safety systems
- Manufacturing equipment
- Process control devices
- Supporting infrastructure

## 4. Network Architecture
OT network design principles:
- Air-gapped from IT networks
- Zone-based security architecture
- Secure remote access
- Network monitoring and detection

## 5. Vulnerability Management
OT vulnerability program:
- Regular vulnerability assessments
- Risk-based patching strategy
- Compensating controls
- Vendor coordination

## 6. Incident Response
OT incident response procedures:
- Safety-first approach
- Rapid containment
- Business continuity
- Regulatory notification

## 7. Supply Chain Security
OT vendor requirements:
- Security assessments
- Secure development practices
- Product security lifecycle
- Vulnerability disclosure

## 8. Training and Awareness
OT personnel training covers:
- Security fundamentals
- Threat landscape
- Incident procedures
- Best practices

Leadership Team:
Chief Executive: {CEO_NAME}
Security Chief: {CISO_NAME}
IT Leadership: {IT_MANAGER_NAME}
Compliance: {COMPLIANCE_OFFICER}
Organization: {COMPANY_NAME}
Headquarters: {HEADQUARTERS_LOCATION}
Established: {ESTABLISHED_YEAR}`
  },
  {
    id: 'ics-004',
    title: 'IoT Device Security Policy',
    category: 'ICS',
    priority: 'Medium',
    domain: 'Industrial Control Systems',
    description: 'Security requirements for IoT devices in industrial environments',
    controls: ['ICS-07', 'ICS-08'],
    selected: false,
    template: `# IoT Device Security Policy

## 1. Policy Statement
{COMPANY_NAME} implements security controls for Internet of Things (IoT) devices to protect against vulnerabilities and ensure operational integrity.

## 2. IoT Security Management
IoT security oversight by {IT_MANAGER_NAME} with policy governance from {CISO_NAME} and executive support from {CEO_NAME}.

## 3. Device Categories
### Industrial IoT
- Sensors and actuators
- Smart manufacturing equipment
- Environmental monitoring devices
- Asset tracking systems

### Building IoT
- HVAC control systems
- Security cameras and access controls
- Lighting management
- Energy monitoring

## 4. Security Requirements
All IoT devices must:
- Support secure authentication
- Encrypt communications
- Receive security updates
- Log security events
- Integrate with monitoring systems

## 5. Network Connectivity
IoT network requirements:
- Dedicated IoT network segments
- Network access control
- Traffic monitoring
- Anomaly detection

## 6. Device Lifecycle Management
IoT device management includes:
- Secure provisioning
- Configuration management
- Update management
- Secure decommissioning

## 7. Data Protection
IoT data handling:
- Data classification
- Encryption requirements
- Privacy protection
- Retention policies

## 8. Vendor Requirements
IoT vendors must provide:
- Security documentation
- Vulnerability disclosure process
- Support lifecycle
- Update procedures

Corporate Structure:
Company: {COMPANY_NAME}
Industry: {INDUSTRY}
CEO: {CEO_NAME}
CISO: {CISO_NAME}
IT Manager: {IT_MANAGER_NAME}
Location: {HEADQUARTERS_LOCATION}
Website: {WEBSITE}
Employees: {EMPLOYEE_COUNT}`
  },
  {
    id: 'ics-005',
    title: 'Critical Infrastructure Protection Policy',
    category: 'ICS',
    priority: 'High',
    domain: 'Industrial Control Systems',
    description: 'Protection measures for critical infrastructure systems',
    controls: ['ICS-09', 'ICS-10'],
    selected: false,
    template: `# Critical Infrastructure Protection Policy

## 1. Purpose
{COMPANY_NAME} protects critical infrastructure systems essential for business operations, public safety, and national security.

## 2. Critical Infrastructure Governance
Critical infrastructure protection is managed by {CISO_NAME} with coordination from {IT_MANAGER_NAME} and executive oversight from {CEO_NAME}.

## 3. Critical System Identification
Critical infrastructure includes:
- Power generation and distribution
- Water treatment and distribution
- Transportation control systems
- Communication networks
- Emergency systems

## 4. Security Controls
Enhanced security measures:
- Physical security controls
- Cybersecurity frameworks
- Redundancy and resilience
- Continuous monitoring
- Incident response capabilities

## 5. Risk Management
Critical infrastructure risk management:
- Threat assessment
- Vulnerability analysis
- Impact evaluation
- Risk mitigation strategies
- Regular risk reviews

## 6. Business Continuity
Continuity planning includes:
- Backup systems and procedures
- Alternative operating procedures
- Recovery time objectives
- Coordination with external agencies
- Regular testing and exercises

## 7. Regulatory Compliance
Compliance with applicable regulations:
- Industry-specific requirements
- Government mandates
- International standards
- Best practice frameworks

## 8. Information Sharing
Threat information sharing:
- Government agencies
- Industry partners
- Threat intelligence services
- Security communities

## 9. Personnel Security
Critical infrastructure personnel:
- Background investigations
- Security clearances
- Specialized training
- Continuous evaluation

Management Authority:
Chief Executive Officer: {CEO_NAME}
Chief Information Security Officer: {CISO_NAME}
IT Manager: {IT_MANAGER_NAME}
Compliance Officer: {COMPLIANCE_OFFICER}

Company Information:
Name: {COMPANY_NAME}
Industry Sector: {INDUSTRY}
Establishment Date: {ESTABLISHED_YEAR}
Workforce Size: {EMPLOYEE_COUNT}
Corporate Headquarters: {HEADQUARTERS_LOCATION}
Corporate Website: {WEBSITE}`
  },
  {
    id: 'ics-006',
    title: 'OT Network Security Policy',
    category: 'ICS',
    priority: 'High',
    domain: 'Industrial Control Systems',
    description: 'Operational technology network security requirements',
    controls: ['ICS-11', 'ICS-12'],
    selected: false,
    template: `# OT Network Security Policy

## 1. OT Network Security Framework
{COMPANY_NAME} implements specialized network security controls for operational technology environments to protect industrial processes.

## 2. OT Network Management
OT network security is managed by {CISO_NAME} with operational support from {IT_MANAGER_NAME} and business oversight by {CEO_NAME}.

## 3. Network Architecture
- Air-gapped OT networks
- Industrial DMZ implementation
- Secure remote access
- Network micro-segmentation

## 4. Network Monitoring
- Industrial protocol monitoring
- Anomaly detection systems
- Network traffic analysis
- Security event correlation

## 5. Access Controls
- Role-based network access
- Time-based access restrictions
- Multi-factor authentication
- Session monitoring

Company: {COMPANY_NAME}
OT Network Security Lead: {CISO_NAME}
Operations Support: {IT_MANAGER_NAME}`
  },
  {
    id: 'ics-007',
    title: 'Industrial Asset Management Policy',
    category: 'ICS',
    priority: 'Medium',
    domain: 'Industrial Control Systems',
    description: 'Industrial asset inventory and lifecycle management',
    controls: ['ICS-13', 'ICS-14'],
    selected: false,
    template: `# Industrial Asset Management Policy

## 1. Industrial Asset Framework
{COMPANY_NAME} maintains comprehensive inventory and lifecycle management of industrial control system assets.

## 2. Asset Management Authority
Industrial asset management is coordinated by {IT_MANAGER_NAME} with security classification by {CISO_NAME} and governance by {CEO_NAME}.

## 3. Asset Categories
- Control system hardware
- Industrial software applications
- Network infrastructure
- Safety systems
- Monitoring equipment

## 4. Lifecycle Management
- Asset procurement and deployment
- Configuration and commissioning
- Operational maintenance
- End-of-life disposal

## 5. Security Integration
- Asset security assessment
- Vulnerability management
- Patch management coordination
- Security configuration validation

Organization: {COMPANY_NAME}
Industrial Asset Manager: {IT_MANAGER_NAME}
Security Classification: {CISO_NAME}`
  },
  {
    id: 'ics-008',
    title: 'Industrial Incident Response Policy',
    category: 'ICS',
    priority: 'High',
    domain: 'Industrial Control Systems',
    description: 'ICS-specific incident response procedures',
    controls: ['ICS-15', 'ICS-16'],
    selected: false,
    template: `# Industrial Incident Response Policy

## 1. Industrial Incident Framework
{COMPANY_NAME} implements specialized incident response procedures for industrial control systems with safety and operational priorities.

## 2. Incident Response Authority
Industrial incident response is led by {CISO_NAME} with operational coordination by {IT_MANAGER_NAME} and executive oversight by {CEO_NAME}.

## 3. Incident Types
- Control system compromises
- Safety system failures
- Production disruptions
- OT network intrusions
- Industrial malware infections

## 4. Response Priorities
1. Personnel safety
2. Environmental protection
3. Asset protection
4. Production continuity
5. Evidence preservation

## 5. Response Procedures
- Safety-first assessment
- Operational impact analysis
- Containment strategies
- Recovery coordination
- Lessons learned integration

Company: {COMPANY_NAME}
Industrial Incident Lead: {CISO_NAME}
Operations Coordination: {IT_MANAGER_NAME}`
  },
  {
    id: 'ics-009',
    title: 'Industrial Compliance Policy',
    category: 'ICS',
    priority: 'Medium',
    domain: 'Industrial Control Systems',
    description: 'Industrial control system regulatory compliance',
    controls: ['ICS-17', 'ICS-18'],
    selected: false,
    template: `# Industrial Compliance Policy

## 1. Industrial Compliance Framework
{COMPANY_NAME} ensures industrial control systems comply with applicable safety, security, and operational regulations.

## 2. Compliance Management
Industrial compliance is managed by {COMPLIANCE_OFFICER} with technical assessment by {CISO_NAME} and executive accountability by {CEO_NAME}.

## 3. Regulatory Requirements
- Industry-specific safety standards
- Cybersecurity frameworks (NIST, IEC 62443)
- Environmental regulations
- Operational compliance requirements

## 4. Compliance Program
- Regulatory monitoring
- Gap assessments
- Remediation planning
- Audit coordination

## 5. Compliance Reporting
- Regulatory submissions
- Compliance metrics
- Audit findings
- Corrective actions

Organization: {COMPANY_NAME}
Industrial Compliance Lead: {COMPLIANCE_OFFICER}
Technical Assessment: {CISO_NAME}`
  },
  {
    id: 'ics-010',
    title: 'Industrial Training and Awareness Policy',
    category: 'ICS',
    priority: 'Medium',
    domain: 'Industrial Control Systems',
    description: 'ICS security training and awareness programs',
    controls: ['ICS-19', 'ICS-20'],
    selected: false,
    template: `# Industrial Training and Awareness Policy

## 1. Industrial Training Framework
{COMPANY_NAME} provides specialized security training for industrial control system operators and maintainers.

## 2. Training Management
Industrial security training is coordinated by {CISO_NAME} with operational input from {IT_MANAGER_NAME} and executive support from {CEO_NAME}.

## 3. Training Audience
- Control system operators
- Maintenance technicians
- Engineering staff
- Management personnel
- Vendor personnel

## 4. Training Content
- ICS security fundamentals
- Threat landscape awareness
- Safe operational procedures
- Incident response procedures
- Regulatory requirements

## 5. Training Delivery
- Role-specific curricula
- Hands-on simulations
- Regular refresher training
- Competency assessments

Company: {COMPANY_NAME}
Industrial Training Lead: {CISO_NAME}
Operational Input: {IT_MANAGER_NAME}
Executive Support: {CEO_NAME}
Industry: {INDUSTRY}
Location: {HEADQUARTERS_LOCATION}`
  }
];

export default function PolicyTemplateGenerator() {
  const { toast } = useToast();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyName: '',
    industry: '',
    ceoName: '',
    cisoName: '',
    itManagerName: '',
    complianceOfficer: '',
    headquartersLocation: '',
    employeeCount: '',
    establishedYear: '',
    website: ''
  });

  const [templates, setTemplates] = useState<PolicyTemplate[]>(POLICY_TEMPLATES);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  const domains = ['All', ...Array.from(new Set(templates.map(t => t.domain)))];

  const filteredTemplates = templates.filter(template => {
    const categoryMatch = selectedCategory === 'All' || template.category === selectedCategory;
    const domainMatch = selectedDomain === 'All' || template.domain === selectedDomain;
    return categoryMatch && domainMatch;
  });

  const selectedCount = templates.filter(t => t.selected).length;

  const handleSelectAll = (category?: string) => {
    setTemplates(prev => prev.map(template => {
      if (!category || template.category === category) {
        return { ...template, selected: true };
      }
      return template;
    }));
  };

  const handleDeselectAll = () => {
    setTemplates(prev => prev.map(template => ({ ...template, selected: false })));
  };

  const handleTemplateToggle = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, selected: !template.selected }
        : template
    ));
  };

  const validateCompanyDetails = (): boolean => {
    const required = ['companyName', 'ceoName', 'cisoName', 'itManagerName'];
    for (const field of required) {
      if (!companyDetails[field as keyof CompanyDetails]) {
        toast({
          title: "Missing Information",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const generateDocumentHash = (content: string): string => {
    return CryptoJS.SHA256(content + Date.now().toString()).toString();
  };

  const generateQRCode = async (documentId: string, documentHash: string): Promise<string> => {
    const qrData = JSON.stringify({
      id: documentId,
      hash: documentHash,
      timestamp: new Date().toISOString(),
      verification: 'authentic'
    });
    
    try {
      return await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('QR Code generation failed:', error);
      return '';
    }
  };

  const generateBarcode = (documentId: string): string => {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, documentId, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: true,
        fontSize: 12
      });
      return canvas.toDataURL();
    } catch (error) {
      console.error('Barcode generation failed:', error);
      return '';
    }
  };

  const replaceTemplateVariables = (template: string): string => {
    let content = template;
    
    // Replace all template variables
    content = content.replace(/{COMPANY_NAME}/g, companyDetails.companyName);
    content = content.replace(/{INDUSTRY}/g, companyDetails.industry || 'Technology');
    content = content.replace(/{CEO_NAME}/g, companyDetails.ceoName);
    content = content.replace(/{CISO_NAME}/g, companyDetails.cisoName);
    content = content.replace(/{IT_MANAGER_NAME}/g, companyDetails.itManagerName);
    content = content.replace(/{COMPLIANCE_OFFICER}/g, companyDetails.complianceOfficer || 'Compliance Officer');
    content = content.replace(/{HEADQUARTERS_LOCATION}/g, companyDetails.headquartersLocation || 'Corporate Headquarters');
    content = content.replace(/{EMPLOYEE_COUNT}/g, companyDetails.employeeCount || '100+');
    content = content.replace(/{ESTABLISHED_YEAR}/g, companyDetails.establishedYear || new Date().getFullYear().toString());
    content = content.replace(/{WEBSITE}/g, companyDetails.website || 'www.company.com');
    
    // Add current date and review date
    const currentDate = new Date().toLocaleDateString();
    const reviewDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 1 year from now
    content = content.replace(/{CURRENT_DATE}/g, currentDate);
    content = content.replace(/{REVIEW_DATE}/g, reviewDate);

    return content;
  };

  const generatePolicies = async () => {
    if (!validateCompanyDetails()) return;

    const selectedTemplates = templates.filter(t => t.selected);
    if (selectedTemplates.length === 0) {
      toast({
        title: "No Templates Selected",
        description: "Please select at least one policy template to generate.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setShowGenerateDialog(false);

    try {
      const existingDocuments = JSON.parse(localStorage.getItem('document_lifecycle') || '[]');
      const newDocuments = [];

      for (let i = 0; i < selectedTemplates.length; i++) {
        const template = selectedTemplates[i];
        
        // Generate document content with company details
        const content = replaceTemplateVariables(template.template);
        const documentId = uuidv4();
        const documentHash = generateDocumentHash(content);
        const qrCode = await generateQRCode(documentId, documentHash);
        const barcode = generateBarcode(documentId);

        const document = {
          id: documentId,
          title: template.title,
          type: template.category + ' Policy',
          category: template.domain,
          version: '1.0',
          status: 'draft',
          creator: companyDetails.cisoName,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          qrCode,
          barcode,
          documentHash,
          content,
          controls: template.controls,
          auditTrail: [{
            id: uuidv4(),
            action: 'Document Generated',
            user: companyDetails.cisoName,
            timestamp: new Date().toISOString(),
            details: `Policy generated from template for ${companyDetails.companyName}`,
            documentHash
          }],
          implementationProgress: 0
        };

        newDocuments.push(document);
        setGenerationProgress(Math.round(((i + 1) / selectedTemplates.length) * 100));
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Save to localStorage
      const allDocuments = [...newDocuments, ...existingDocuments];
      localStorage.setItem('document_lifecycle', JSON.stringify(allDocuments));

      toast({
        title: "Policies Generated Successfully",
        description: `Generated ${selectedTemplates.length} policy documents for ${companyDetails.companyName}`,
      });

      // Create download package
      const policyPackage = {
        companyDetails,
        documents: newDocuments,
        generatedAt: new Date().toISOString(),
        packageVersion: '1.0'
      };

      const blob = new Blob([JSON.stringify(policyPackage, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${companyDetails.companyName.replace(/\s+/g, '_')}_Policy_Package.json`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating policies:', error);
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating policies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Governance': return <Shield className="w-4 h-4" />;
      case 'Defence': return <Target className="w-4 h-4" />;
      case 'Resilience': return <Activity className="w-4 h-4" />;
      case 'Cloud': return <Upload className="w-4 h-4" />;
      case 'ICS': return <Settings className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Policy Template Generator
          </h2>
          <p className="text-muted-foreground">
            Generate 80+ customized policy documents for your organization
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowGenerateDialog(true)}
            disabled={selectedCount === 0}
          >
            <Zap className="w-4 h-4 mr-2" />
            Generate {selectedCount} Policies
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Selected</p>
                <p className="text-2xl font-bold text-green-600">{selectedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {templates.filter(t => t.priority === 'High').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Domains</p>
                <p className="text-2xl font-bold text-purple-600">5</p>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Template Selection</CardTitle>
          <CardDescription>
            Choose policy templates to customize for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by Domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map(domain => (
                  <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => handleSelectAll()}>
              Select All
            </Button>

            <Button variant="outline" onClick={() => handleSelectAll(selectedCategory !== 'All' ? selectedCategory : undefined)}>
              Select Category
            </Button>

            <Button variant="outline" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>

          {/* Progress indicator during generation */}
          {isGenerating && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Generating Policies...</span>
                <span className="text-sm text-muted-foreground">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}

          {/* Template List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
                <Checkbox
                  checked={template.selected}
                  onCheckedChange={() => handleTemplateToggle(template.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(template.category)}
                    <h3 className="font-medium">{template.title}</h3>
                    <Badge className={getPriorityColor(template.priority)} variant="outline">
                      {template.priority}
                    </Badge>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div className="flex gap-1 mt-1">
                    {template.controls.map(control => (
                      <Badge key={control} variant="secondary" className="text-xs">
                        {control}
                      </Badge>
                    ))}
                  </div>
                </div>
                <DocumentViewer
                  content={replaceTemplateVariables(template.template)}
                  metadata={{
                    title: template.title,
                    type: 'Policy Template',
                    description: template.description,
                    author: 'Policy Template System',
                    createdDate: new Date().toLocaleDateString(),
                    status: 'draft',
                    priority: template.priority.toLowerCase() as 'high' | 'medium' | 'low',
                    category: template.category
                  }}
                  triggerButton={
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Company Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Company Name *</label>
                <Input
                  value={companyDetails.companyName}
                  onChange={(e) => setCompanyDetails({...companyDetails, companyName: e.target.value})}
                  placeholder="Acme Corporation"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Industry</label>
                <Input
                  value={companyDetails.industry}
                  onChange={(e) => setCompanyDetails({...companyDetails, industry: e.target.value})}
                  placeholder="Technology"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">CEO Name *</label>
                <Input
                  value={companyDetails.ceoName}
                  onChange={(e) => setCompanyDetails({...companyDetails, ceoName: e.target.value})}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="text-sm font-medium">CISO Name *</label>
                <Input
                  value={companyDetails.cisoName}
                  onChange={(e) => setCompanyDetails({...companyDetails, cisoName: e.target.value})}
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">IT Manager Name *</label>
                <Input
                  value={companyDetails.itManagerName}
                  onChange={(e) => setCompanyDetails({...companyDetails, itManagerName: e.target.value})}
                  placeholder="Mike Johnson"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Compliance Officer</label>
                <Input
                  value={companyDetails.complianceOfficer}
                  onChange={(e) => setCompanyDetails({...companyDetails, complianceOfficer: e.target.value})}
                  placeholder="Sarah Wilson"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Headquarters Location</label>
                <Input
                  value={companyDetails.headquartersLocation}
                  onChange={(e) => setCompanyDetails({...companyDetails, headquartersLocation: e.target.value})}
                  placeholder="New York, NY"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Employee Count</label>
                <Input
                  value={companyDetails.employeeCount}
                  onChange={(e) => setCompanyDetails({...companyDetails, employeeCount: e.target.value})}
                  placeholder="500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Established Year</label>
                <Input
                  value={companyDetails.establishedYear}
                  onChange={(e) => setCompanyDetails({...companyDetails, establishedYear: e.target.value})}
                  placeholder="2010"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={companyDetails.website}
                  onChange={(e) => setCompanyDetails({...companyDetails, website: e.target.value})}
                  placeholder="www.company.com"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={generatePolicies} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate {selectedCount} Policies
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}