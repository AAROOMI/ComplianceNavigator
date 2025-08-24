import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentCRUDManager from "@/components/document/document-crud-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Archive, FileText } from "lucide-react";

interface PolicyDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  version: string;
  lastModified: Date;
  author: string;
  size: string;
  tags: string[];
  starred: boolean;
  description: string;
}

const MOCK_POLICIES: PolicyDocument[] = [
  {
    id: '1',
    title: 'Information Security Policy',
    content: `# Information Security Policy

## 1. Purpose
This Information Security Policy establishes the framework for protecting organizational information assets and ensuring compliance with regulatory requirements.

## 2. Scope
This policy applies to all employees, contractors, and third parties with access to organizational systems and data.

## 3. Information Classification
- **Public**: Information intended for public disclosure
- **Internal**: Information for internal use only
- **Confidential**: Sensitive information requiring protection
- **Restricted**: Highly sensitive information with limited access

## 4. Access Control
- All access to information systems must be authorized
- User accounts must be regularly reviewed and updated
- Multi-factor authentication required for sensitive systems

## 5. Data Protection
- Personal data must be handled in accordance with GDPR/CCPA
- Data retention policies must be followed
- Regular backups and secure disposal procedures required

## 6. Incident Response
- All security incidents must be reported immediately
- Incident response team activation procedures
- Post-incident review and documentation requirements

## 7. Compliance
This policy ensures compliance with:
- ISO 27001:2013
- NIST Cybersecurity Framework
- SOX requirements
- Industry-specific regulations`,
    category: 'Governance',
    status: 'approved',
    version: '2.1',
    lastModified: new Date('2024-01-15'),
    author: 'John Smith (CISO)',
    size: '245 KB',
    tags: ['iso27001', 'governance', 'baseline'],
    starred: true,
    description: 'Comprehensive information security governance framework'
  },
  {
    id: '2',
    title: 'Incident Response Plan',
    content: `# Incident Response Plan

## 1. Overview
This document outlines the procedures for responding to cybersecurity incidents.

## 2. Incident Response Team
- **Incident Commander**: CISO or designee
- **Technical Lead**: IT Security Manager
- **Communications Lead**: Public Relations Manager
- **Legal Counsel**: Chief Legal Officer

## 3. Incident Classification
### Severity Levels:
- **Critical**: Complete system compromise, data breach
- **High**: Significant system impact, potential data exposure
- **Medium**: Limited system impact, no data exposure
- **Low**: Minor security events, no immediate impact

## 4. Response Procedures
### Detection and Analysis
1. Monitor security alerts and notifications
2. Analyze potential security incidents
3. Determine incident severity and classification
4. Document initial findings

### Containment, Eradication, and Recovery
1. Implement immediate containment measures
2. Identify and eliminate root cause
3. Restore systems to normal operations
4. Monitor for recurring issues

### Post-Incident Activities
1. Conduct post-incident review
2. Document lessons learned
3. Update procedures and controls
4. Provide training on new procedures`,
    category: 'Incident Response',
    status: 'approved',
    version: '1.8',
    lastModified: new Date('2024-01-12'),
    author: 'Sarah Johnson',
    size: '189 KB',
    tags: ['incident', 'emergency', 'response'],
    starred: false,
    description: 'Detailed procedures for cybersecurity incident handling'
  },
  {
    id: '3',
    title: 'Data Classification Policy',
    content: `# Data Classification Policy

## 1. Purpose
Establish consistent data classification standards to ensure appropriate protection measures.

## 2. Data Categories

### Public Data
- Marketing materials
- Published financial reports
- Public website content
- Press releases

### Internal Data
- Internal communications
- Non-sensitive business documents
- General policy documents
- Training materials

### Confidential Data
- Customer information
- Financial records
- Business strategies
- Employee records

### Restricted Data
- Personal identifiable information (PII)
- Payment card information
- Intellectual property
- Legal documents

## 3. Handling Requirements

### Confidential Data Requirements:
- Encryption in transit and at rest
- Access logging and monitoring
- Regular access reviews
- Secure disposal procedures

### Restricted Data Requirements:
- Enhanced encryption standards
- Multi-factor authentication
- Data loss prevention controls
- Legal hold procedures

## 4. Compliance
This policy ensures compliance with:
- GDPR Article 32 (Security of processing)
- PCI DSS Requirements
- HIPAA Security Rule
- SOX Section 404`,
    category: 'Data Protection',
    status: 'review',
    version: '1.2',
    lastModified: new Date('2024-01-10'),
    author: 'Mike Chen',
    size: '156 KB',
    tags: ['data', 'classification', 'privacy'],
    starred: false,
    description: 'Framework for data categorization and handling requirements'
  },
  {
    id: '4',
    title: 'Access Control Policy',
    content: `# Access Control Policy

## 1. Purpose
Define access control requirements to protect organizational resources and information.

## 2. Access Control Principles
- **Principle of Least Privilege**: Users granted minimum access required
- **Separation of Duties**: Critical functions divided among multiple users
- **Need-to-Know**: Access limited to necessary information only
- **Defense in Depth**: Multiple layers of access controls

## 3. User Account Management

### Account Provisioning
1. Formal access request and approval process
2. Manager authorization required
3. HR verification of employment status
4. Role-based access assignment

### Account Maintenance
- Regular access reviews (quarterly)
- Immediate access updates for role changes
- Automated monitoring of inactive accounts
- Password policy enforcement

### Account Termination
- Immediate access revocation upon termination
- Asset recovery procedures
- Exit interview completion
- Final access audit

## 4. Authentication Requirements

### Standard Users
- Strong password policy (12+ characters)
- Account lockout after failed attempts
- Regular password changes

### Privileged Users
- Multi-factor authentication mandatory
- Enhanced password requirements
- Privileged access workstations
- Session monitoring and recording

## 5. Authorization Controls
- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- Regular entitlement reviews
- Segregation of duties enforcement`,
    category: 'Access Management',
    status: 'draft',
    version: '0.9',
    lastModified: new Date('2024-01-08'),
    author: 'Lisa Wong',
    size: '198 KB',
    tags: ['access', 'authentication', 'authorization'],
    starred: true,
    description: 'User access management and authentication requirements'
  },
  {
    id: '5',
    title: 'Business Continuity Plan',
    content: `# Business Continuity Plan

## 1. Purpose
Ensure business operations continue during and after disruptive events.

## 2. Business Impact Analysis

### Critical Business Functions
- Customer service operations
- Financial transaction processing
- Manufacturing processes
- IT infrastructure services

### Recovery Time Objectives (RTO)
- Tier 1 Systems: 4 hours
- Tier 2 Systems: 24 hours
- Tier 3 Systems: 72 hours

### Recovery Point Objectives (RPO)
- Critical Data: 15 minutes
- Important Data: 4 hours
- Standard Data: 24 hours

## 3. Risk Assessment
- Natural disasters (flood, earthquake, fire)
- Technology failures (hardware, software, network)
- Human factors (key personnel loss, cyber attacks)
- Supply chain disruptions

## 4. Continuity Strategies

### Preventive Measures
- Redundant systems and infrastructure
- Regular data backups
- Environmental controls
- Security monitoring

### Response Procedures
1. Incident detection and assessment
2. Emergency response team activation
3. Employee safety procedures
4. Communication protocols

### Recovery Operations
- Alternative site activation
- System restoration procedures
- Data recovery processes
- Vendor coordination

## 5. Testing and Maintenance
- Annual full-scale exercises
- Quarterly tabletop exercises
- Regular plan updates
- Training programs for key personnel`,
    category: 'Business Continuity',
    status: 'approved',
    version: '3.0',
    lastModified: new Date('2024-01-05'),
    author: 'David Brown',
    size: '342 KB',
    tags: ['continuity', 'disaster', 'recovery'],
    starred: false,
    description: 'Comprehensive business continuity and disaster recovery procedures'
  }
];

export default function PolicyLibrary() {
  const { toast } = useToast();
  const [policies, setPolicies] = useState<PolicyDocument[]>(MOCK_POLICIES);

  const handlePolicyUpdate = (updatedPolicy: PolicyDocument) => {
    setPolicies(prev => prev.map(policy => 
      policy.id === updatedPolicy.id ? updatedPolicy : policy
    ));
  };

  const handlePolicyDelete = (policyId: string) => {
    setPolicies(prev => prev.filter(policy => policy.id !== policyId));
  };

  const handlePolicyCreate = (newPolicy: Partial<PolicyDocument>) => {
    const policy: PolicyDocument = {
      id: Date.now().toString(),
      title: newPolicy.title || 'New Policy',
      content: newPolicy.content || '# New Policy\n\nPolicy content...',
      category: newPolicy.category || 'General',
      status: 'draft',
      version: '1.0',
      lastModified: new Date(),
      author: 'Current User',
      size: '12 KB',
      tags: newPolicy.tags || ['new'],
      starred: false,
      description: newPolicy.description || 'New policy document'
    };
    setPolicies(prev => [...prev, policy]);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library">
            <Shield className="w-4 h-4 mr-2" />
            Policy Library
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Archive className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Policy Library Tab */}
        <TabsContent value="library">
          <DocumentCRUDManager
            documents={policies}
            onDocumentUpdate={handlePolicyUpdate}
            onDocumentDelete={handlePolicyDelete}
            onDocumentCreate={handlePolicyCreate}
            title="CISO Policy Library"
            description="Manage, organize, and track your cybersecurity policies with QR codes and barcodes"
          />
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Policy Templates</CardTitle>
              <CardDescription>Pre-built templates for common security policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Policy templates coming soon</p>
                <p className="text-sm">Ready-to-use templates for faster policy creation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Policy Analytics</CardTitle>
              <CardDescription>Insights and metrics about your policy library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard coming soon</p>
                <p className="text-sm">Track policy adoption, compliance, and effectiveness</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}