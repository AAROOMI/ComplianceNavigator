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
  },

  "Technology Budget": {
    description: "Strategic technology budget planning and resource allocation",
    sections: ["Budget Overview", "Technology Investments", "Operational Costs", "ROI Analysis", "Strategic Initiatives"],
    template: `# Technology Budget

## 1. Executive Summary
This Technology Budget outlines [Organization Name]'s strategic technology investments and operational requirements for [Budget Period].

## 2. Budget Overview
### 2.1 Total Technology Investment
- Total technology budget: $[Amount]
- Capital expenditures (CAPEX): [Amount]
- Operational expenditures (OPEX): [Amount]
- Strategic initiatives: [Amount]

### 2.2 Budget Allocation
- Infrastructure & Cloud Services: [Percentage]%
- Software Development & Innovation: [Percentage]%
- Security & Compliance: [Percentage]%
- Data & Analytics: [Percentage]%
- Digital Transformation: [Percentage]%

## 3. Technology Infrastructure Investments
### 3.1 Cloud Infrastructure
- Cloud platform subscriptions and services
- Data storage and compute resources
- Content delivery networks and edge computing
- Disaster recovery and backup solutions

### 3.2 Development & Innovation
- Development tools and platforms
- Testing and quality assurance tools
- DevOps and CI/CD pipeline infrastructure
- Emerging technology research and prototyping

## 4. Strategic Technology Initiatives
### 4.1 Digital Transformation Projects
- Customer experience enhancement platforms
- Business process automation and optimization
- Data analytics and artificial intelligence
- Internet of Things (IoT) and edge computing

### 4.2 Innovation Investments
- Research and development projects
- Proof of concept and pilot programs
- Technology partnership and collaboration
- Intellectual property and patent development

## 5. Operational Technology Expenses
### 5.1 Software Licensing and Subscriptions
- Enterprise software license renewals
- Development and productivity tools
- Security and monitoring software
- Third-party API and service subscriptions

### 5.2 Technology Operations
- IT support and maintenance contracts
- Technology staff training and certification
- Vendor management and consulting services
- Technology governance and compliance

## 6. Return on Investment Analysis
### 6.1 Expected Benefits
- Revenue growth through technology enablement
- Cost reduction through automation and efficiency
- Risk mitigation through security investments
- Competitive advantage through innovation

### 6.2 Performance Metrics
- Technology ROI measurement and tracking
- Innovation pipeline and time-to-market metrics
- Customer satisfaction and digital experience scores
- Operational efficiency and cost optimization`,
    requiredFields: ["organization_name", "cto_name", "budget_period"]
  },

  "Software Development Lifecycle Plan": {
    description: "Comprehensive SDLC methodology and process framework",
    sections: ["SDLC Overview", "Development Phases", "Quality Assurance", "DevOps Integration", "Governance"],
    template: `# Software Development Lifecycle Plan

## 1. SDLC Framework Overview
This Software Development Lifecycle Plan establishes the methodology and processes for [Organization Name]'s software development initiatives.

## 2. Development Methodology
### 2.1 Agile Development Framework
- Scrum methodology with 2-week sprints
- Cross-functional development teams
- Continuous integration and deployment
- Regular stakeholder feedback and iteration

### 2.2 Development Phases
1. **Requirements Analysis**
   - Stakeholder requirement gathering
   - User story development and prioritization
   - Technical feasibility assessment
   - Risk analysis and mitigation planning

2. **Design and Architecture**
   - System architecture design
   - Database design and modeling
   - User interface and experience design
   - API design and documentation

3. **Implementation and Development**
   - Code development following best practices
   - Code review and peer programming
   - Unit testing and test-driven development
   - Version control and branch management

4. **Testing and Quality Assurance**
   - Automated testing framework implementation
   - Integration and system testing
   - Performance and security testing
   - User acceptance testing coordination

5. **Deployment and Release**
   - Continuous integration/continuous deployment (CI/CD)
   - Environment management and configuration
   - Release planning and rollback procedures
   - Production monitoring and alerting

## 3. Quality Assurance Framework
### 3.1 Code Quality Standards
- Coding standards and style guides
- Code review processes and criteria
- Static code analysis and security scanning
- Documentation requirements and maintenance

### 3.2 Testing Strategy
- Test automation and coverage requirements
- Performance testing and optimization
- Security testing and vulnerability assessment
- Accessibility and usability testing

## 4. DevOps and Automation
### 4.1 CI/CD Pipeline
- Automated build and deployment processes
- Environment provisioning and management
- Configuration management and infrastructure as code
- Monitoring and logging implementation

### 4.2 Development Tools and Platforms
- Version control systems and branching strategies
- Development environment standardization
- Project management and collaboration tools
- Performance monitoring and analytics

## 5. Governance and Compliance
### 5.1 Project Governance
- Project approval and prioritization processes
- Resource allocation and team management
- Progress tracking and reporting
- Risk management and issue escalation

### 5.2 Compliance and Security
- Security development lifecycle integration
- Data privacy and protection requirements
- Regulatory compliance considerations
- Audit trail and documentation standards`,
    requiredFields: ["organization_name", "development_manager", "methodology"]
  },

  "Product Development Plan": {
    description: "Strategic product development roadmap and execution plan",
    sections: ["Product Strategy", "Development Roadmap", "Resource Planning", "Go-to-Market", "Success Metrics"],
    template: `# Product Development Plan

## 1. Product Vision and Strategy
This Product Development Plan outlines the strategy and execution plan for [Product Name] at [Organization Name].

## 2. Product Overview
### 2.1 Product Vision
[Product vision statement and long-term objectives]

### 2.2 Target Market and Customer Segments
- Primary target audience and user personas
- Market size and opportunity analysis
- Competitive landscape and positioning
- Customer needs and pain point analysis

## 3. Development Roadmap
### 3.1 Phase 1: Foundation (Months 1-3)
- Core platform development and architecture
- Basic feature implementation and testing
- User interface design and prototyping
- Technical infrastructure setup

### 3.2 Phase 2: Enhancement (Months 4-6)
- Advanced feature development and integration
- User experience optimization and refinement
- Performance optimization and scalability
- Security implementation and testing

### 3.3 Phase 3: Launch (Months 7-9)
- Beta testing and user feedback incorporation
- Production environment deployment
- Go-to-market strategy execution
- Customer onboarding and support processes

## 4. Technical Architecture
### 4.1 Technology Stack
- Frontend technologies and frameworks
- Backend systems and database architecture
- Cloud infrastructure and deployment strategy
- Third-party integrations and APIs

### 4.2 Development Approach
- Agile development methodology
- Cross-functional team collaboration
- Continuous integration and deployment
- Quality assurance and testing protocols

## 5. Resource Requirements
### 5.1 Development Team Structure
- Product management and strategy roles
- Software engineering and development resources
- User experience and design professionals
- Quality assurance and testing specialists

### 5.2 Budget and Timeline
- Development cost estimates and allocation
- Infrastructure and operational expenses
- Marketing and go-to-market investment
- Timeline milestones and deliverables

## 6. Go-to-Market Strategy
### 6.1 Launch Strategy
- Product positioning and messaging
- Marketing channels and campaigns
- Sales strategy and channel partnerships
- Customer acquisition and retention plans

### 6.2 Success Metrics and KPIs
- User adoption and engagement metrics
- Revenue and business impact measurements
- Customer satisfaction and feedback tracking
- Technical performance and reliability metrics`,
    requiredFields: ["organization_name", "product_manager", "launch_date"]
  },

  "System Architecture Document": {
    description: "Comprehensive system architecture design and documentation",
    sections: ["Architecture Overview", "System Components", "Integration Design", "Security Architecture", "Scalability"],
    template: `# System Architecture Document

## 1. Architecture Overview
This System Architecture Document provides a comprehensive design for [System Name] at [Organization Name].

## 2. System Requirements
### 2.1 Functional Requirements
- Core business functionality and capabilities
- User interface and experience requirements
- Integration and interoperability needs
- Performance and scalability expectations

### 2.2 Non-Functional Requirements
- Availability and reliability targets (99.9% uptime)
- Performance requirements (response time < 2 seconds)
- Scalability requirements (support 10,000+ concurrent users)
- Security and compliance standards

## 3. High-Level Architecture
### 3.1 System Components
- Presentation layer (web and mobile interfaces)
- Business logic layer (application services)
- Data access layer (database and storage)
- Integration layer (APIs and messaging)

### 3.2 Technology Stack
- **Frontend**: React.js, TypeScript, Material-UI
- **Backend**: Node.js, Express.js, GraphQL
- **Database**: PostgreSQL, Redis for caching
- **Cloud Platform**: AWS with multi-region deployment
- **Monitoring**: Prometheus, Grafana, ELK stack

## 4. Detailed Component Design
### 4.1 User Interface Layer
- Responsive web application design
- Mobile-first approach with Progressive Web App (PWA)
- Component-based architecture with reusable UI libraries
- Accessibility compliance (WCAG 2.1 AA)

### 4.2 Application Services Layer
- Microservices architecture with domain-driven design
- RESTful APIs and GraphQL for data access
- Event-driven architecture with message queues
- Business logic encapsulation and separation of concerns

### 4.3 Data Layer
- Relational database design with normalized schema
- Data caching strategy for performance optimization
- Data backup and disaster recovery procedures
- Data privacy and protection implementation

## 5. Integration Architecture
### 5.1 Internal Integrations
- Service-to-service communication patterns
- API gateway for routing and security
- Event sourcing and CQRS implementation
- Database synchronization and consistency

### 5.2 External Integrations
- Third-party API integration and management
- Data import/export mechanisms
- Real-time data synchronization
- Legacy system integration approaches

## 6. Security Architecture
### 6.1 Authentication and Authorization
- Multi-factor authentication implementation
- Role-based access control (RBAC)
- JWT token-based session management
- Single sign-on (SSO) integration

### 6.2 Data Security
- Encryption at rest and in transit
- Secure API design and implementation
- Input validation and sanitization
- Security monitoring and threat detection

## 7. Scalability and Performance
### 7.1 Horizontal Scaling Strategy
- Load balancing and auto-scaling configuration
- Database sharding and replication
- Content delivery network (CDN) implementation
- Caching strategies at multiple layers

### 7.2 Performance Optimization
- Code optimization and best practices
- Database query optimization
- Network latency reduction techniques
- Resource utilization monitoring and tuning`,
    requiredFields: ["organization_name", "system_architect", "technology_stack"]
  },

  "Technology Evaluation Report": {
    description: "Comprehensive technology assessment and recommendation report",
    sections: ["Evaluation Criteria", "Technology Assessment", "Cost Analysis", "Risk Assessment", "Recommendations"],
    template: `# Technology Evaluation Report

## 1. Executive Summary
This Technology Evaluation Report assesses [Technology Name/Solution] for potential adoption at [Organization Name].

## 2. Evaluation Scope and Objectives
### 2.1 Evaluation Purpose
- Strategic technology alignment assessment
- Technical capability and performance evaluation
- Cost-benefit analysis and ROI calculation
- Risk assessment and mitigation strategies

### 2.2 Evaluation Criteria
- **Technical Requirements**: Functionality, performance, scalability
- **Business Alignment**: Strategic fit, competitive advantage
- **Financial Impact**: Total cost of ownership, ROI
- **Risk Factors**: Implementation complexity, vendor stability

## 3. Technology Overview
### 3.1 Solution Description
[Detailed description of the technology solution being evaluated]

### 3.2 Key Features and Capabilities
- Core functionality and feature set
- Integration capabilities and APIs
- Scalability and performance characteristics
- Security and compliance features

## 4. Technical Assessment
### 4.1 Functionality Evaluation
- Feature completeness against requirements
- User interface and experience assessment
- Integration capabilities and compatibility
- Customization and configuration options

### 4.2 Performance Analysis
- Performance benchmarking results
- Scalability testing and load handling
- Reliability and availability metrics
- Security assessment and vulnerability testing

## 5. Cost-Benefit Analysis
### 5.1 Total Cost of Ownership
- **Initial Investment**: Licensing, hardware, implementation
- **Ongoing Costs**: Maintenance, support, training
- **Hidden Costs**: Integration, customization, migration
- **5-Year TCO**: $[Amount] over evaluation period

### 5.2 Expected Benefits
- **Quantifiable Benefits**: Cost savings, efficiency gains
- **Strategic Benefits**: Competitive advantage, innovation enablement
- **Risk Mitigation**: Security improvements, compliance adherence
- **ROI Calculation**: [Percentage]% return over [Time Period]

## 6. Risk Assessment
### 6.1 Implementation Risks
- Technical complexity and integration challenges
- Timeline and resource requirements
- Change management and user adoption
- Data migration and system compatibility

### 6.2 Vendor and Technology Risks
- Vendor financial stability and market position
- Technology roadmap and future development
- Support quality and service levels
- Exit strategy and data portability

## 7. Comparison Analysis
### 7.1 Alternative Solutions
[Comparison with other evaluated technologies/vendors]

### 7.2 Pros and Cons Summary
**Advantages:**
- [List key advantages and strengths]

**Disadvantages:**
- [List limitations and concerns]

## 8. Recommendations
### 8.1 Final Recommendation
[Clear recommendation: Proceed, Proceed with conditions, or Do not proceed]

### 8.2 Implementation Considerations
- Recommended implementation approach
- Critical success factors and requirements
- Timeline and resource recommendations
- Risk mitigation strategies

### 8.3 Next Steps
- Pilot program or proof of concept
- Vendor negotiations and contracting
- Implementation planning and resource allocation
- Success metrics and evaluation criteria`,
    requiredFields: ["organization_name", "evaluator", "technology_name"]
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
        "IT Strategic Plan": "Strategic Planning",
        "IT Vendor Management Policy": "Third-Party Management",
        "IT Training Plan": "Training & Awareness",
        "IT Training and Development Plan": "Training & Awareness",
        "Technology Budget": "Technology Strategy & Innovation",
        "System Architecture Document": "Technology Strategy & Innovation",
        "Software Development Lifecycle Plan": "Software Development & Engineering",
        "Technology Evaluation Report": "Technology Operations & Performance",
        "IT Performance Metrics Report": "Technology Operations & Performance",
        "IT Asset Management Plan": "IT Management & Operations",
        "IT Performance Metrics and Reporting Document": "Technology Operations & Performance",
        "IT Service Management Plan": "IT Service Management",
        "IT Vendor Management Plan": "Third-Party Management",
        "IT Project Management Framework Document": "IT Project & Resource Management",
        "IT Governance Framework Document": "Technology Governance",
        "IT Compliance Plan": "Governance & Compliance",
        "Product Development Plan": "Software Development & Engineering",
        "Software Development Lifecycle (SDLC) Policy": "Software Development & Engineering",
        "IT Change Management Plan": "IT Management & Operations",
        "Data Privacy Policy": "Data Protection",
        "IT Compliance And Audit Plan": "Governance & Compliance",
        "CTO Security Policy": "Security Operations"
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