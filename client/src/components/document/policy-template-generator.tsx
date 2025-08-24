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
  AlertTriangle
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