import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { 
  Shield, 
  FileText, 
  Search, 
  Download,
  Users,
  Lock,
  Activity,
  AlertTriangle,
  Building,
  Database,
  Globe,
  Settings,
  Zap,
  Eye,
  GitBranch,
  Handshake,
  CheckSquare,
  Bug,
  UserCheck,
  Key,
  Server,
  Heart,
  Play
} from "lucide-react";
import PolicyGenerator from "@/components/ciso/policy-generator";
import CISOExpertConsultant from "@/components/ciso/expert-consultant";
import PolicyLibrary from "@/components/ciso/policy-library";
import { PolicyDocumentViewer } from "@/components/common/policy-document-viewer";

const CISO_DOCUMENTS = [
  {
    id: 'security-budget-proposal',
    title: 'Security Budget Proposal',
    description: 'Develop comprehensive budget proposals for cybersecurity investments',
    icon: FileText,
    category: 'Financial',
    priority: 'High',
    estimatedTime: '2-3 hours'
  },
  {
    id: 'business-continuity-plan',
    title: 'Business Continuity Plan',
    description: 'Create plans to ensure business operations during disruptions',
    icon: Building,
    category: 'Operations',
    priority: 'Critical',
    estimatedTime: '4-6 hours'
  },
  {
    id: 'data-classification-policy',
    title: 'Data Classification Policy',
    description: 'Define data categories and handling procedures',
    icon: Database,
    category: 'Data Protection',
    priority: 'High',
    estimatedTime: '2-4 hours'
  },
  {
    id: 'compliance-audit-report',
    title: 'Compliance Audit Report',
    description: 'Generate comprehensive compliance assessment reports',
    icon: CheckSquare,
    category: 'Compliance',
    priority: 'High',
    estimatedTime: '3-5 hours'
  },
  {
    id: 'data-breach-notification-plan',
    title: 'Data Breach Notification Plan',
    description: 'Establish procedures for breach communication and response',
    icon: AlertTriangle,
    category: 'Incident Response',
    priority: 'Critical',
    estimatedTime: '2-3 hours'
  },
  {
    id: 'network-security-policy',
    title: 'Network Security Policy',
    description: 'Define network protection standards and controls',
    icon: Globe,
    category: 'Network Security',
    priority: 'High',
    estimatedTime: '3-4 hours'
  },
  {
    id: 'patch-management-policy',
    title: 'Patch Management Policy',
    description: 'Establish systematic approach to security patching',
    icon: Settings,
    category: 'System Management',
    priority: 'High',
    estimatedTime: '2-3 hours'
  },
  {
    id: 'security-architecture-document',
    title: 'Security Architecture Document',
    description: 'Design comprehensive security architecture frameworks',
    icon: GitBranch,
    category: 'Architecture',
    priority: 'High',
    estimatedTime: '4-8 hours'
  },
  {
    id: 'security-awareness-training',
    title: 'Security Awareness Training Material',
    description: 'Create engaging cybersecurity training content',
    icon: Users,
    category: 'Training',
    priority: 'Medium',
    estimatedTime: '3-5 hours'
  },
  {
    id: 'security-metrics-report',
    title: 'Security Metrics Report',
    description: 'Generate KPI dashboards and security measurements',
    icon: Activity,
    category: 'Metrics',
    priority: 'Medium',
    estimatedTime: '2-4 hours'
  },
  {
    id: 'security-program-roadmap',
    title: 'Security Program Roadmap',
    description: 'Develop strategic cybersecurity implementation plans',
    icon: Zap,
    category: 'Strategy',
    priority: 'High',
    estimatedTime: '4-6 hours'
  },
  {
    id: 'third-party-security-agreement',
    title: 'Third-Party Security Agreement',
    description: 'Create vendor security requirements and contracts',
    icon: Handshake,
    category: 'Third-Party Risk',
    priority: 'High',
    estimatedTime: '2-3 hours'
  },
  {
    id: 'vendor-security-assessment',
    title: 'Vendor Security Assessment Document',
    description: 'Evaluate third-party security postures and risks',
    icon: Eye,
    category: 'Third-Party Risk',
    priority: 'High',
    estimatedTime: '3-4 hours'
  },
  {
    id: 'vulnerability-management-plan',
    title: 'Vulnerability Management Plan',
    description: 'Establish systematic vulnerability identification and remediation',
    icon: Bug,
    category: 'Risk Management',
    priority: 'Critical',
    estimatedTime: '3-5 hours'
  },
  {
    id: 'access-control-policy',
    title: 'Access Control Policy',
    description: 'Define user authentication and authorization frameworks',
    icon: UserCheck,
    category: 'Access Management',
    priority: 'Critical',
    estimatedTime: '2-4 hours'
  },
  {
    id: 'encryption-policy',
    title: 'Encryption Policy',
    description: 'Establish data encryption standards and procedures',
    icon: Key,
    category: 'Data Protection',
    priority: 'High',
    estimatedTime: '2-3 hours'
  },
  {
    id: 'information-security-policy',
    title: 'Information Security Policy',
    description: 'Create comprehensive information security governance',
    icon: Lock,
    category: 'Governance',
    priority: 'Critical',
    estimatedTime: '4-6 hours'
  },
  {
    id: 'disaster-recovery-plan',
    title: 'Disaster Recovery Plan',
    description: 'Design recovery procedures for catastrophic events',
    icon: Heart,
    category: 'Business Continuity',
    priority: 'Critical',
    estimatedTime: '4-8 hours'
  },
  {
    id: 'incident-response-plan',
    title: 'Incident Response Plan',
    description: 'Establish security incident handling procedures',
    icon: Play,
    category: 'Incident Response',
    priority: 'Critical',
    estimatedTime: '3-5 hours'
  }
];

export default function CISOPortal() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [generatedDocuments, setGeneratedDocuments] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const categories = ["All", ...Array.from(new Set(CISO_DOCUMENTS.map(doc => doc.category)))];
  
  const filteredDocuments = CISO_DOCUMENTS.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getStats = () => {
    const critical = CISO_DOCUMENTS.filter(d => d.priority === 'Critical').length;
    const high = CISO_DOCUMENTS.filter(d => d.priority === 'High').length;
    const medium = CISO_DOCUMENTS.filter(d => d.priority === 'Medium').length;
    return { critical, high, medium, total: CISO_DOCUMENTS.length };
  };

  const stats = getStats();

  const handleGenerateDocument = async (documentId: string, documentTitle: string) => {
    setIsGenerating(documentId);
    
    try {
      // Simulate AI document generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock document content
      const mockContent = generateMockDocument(documentTitle, documentId);
      setGeneratedDocuments(prev => ({ ...prev, [documentId]: mockContent }));
      
      toast({
        title: "Document Generated Successfully",
        description: `${documentTitle} has been generated with QR code and barcode.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const generateMockDocument = (title: string, id: string) => {
    const now = new Date();
    return `# ${title}
## Generated by Metaworks CISO Portal

### Document Overview
This ${title.toLowerCase()} has been automatically generated using AI-powered policy creation aligned with industry best practices and regulatory requirements.

### 1. Purpose and Scope
This document establishes comprehensive guidelines for implementing and maintaining cybersecurity controls within the organization.

### 2. Objectives
- Establish clear security requirements and procedures
- Ensure compliance with NCA Essential Cybersecurity Controls (ECC)
- Minimize cybersecurity risks and vulnerabilities
- Protect confidentiality, integrity, and availability of information assets
- Implement effective incident response capabilities

### 3. Roles and Responsibilities

#### Chief Information Security Officer (CISO)
- Overall policy oversight and strategic implementation
- Coordination with executive leadership and board of directors
- Resource allocation and budget management for security initiatives

#### IT Security Team
- Technical implementation and daily monitoring of security controls
- Vulnerability management and threat response
- Security awareness training coordination

#### Department Heads
- Ensuring compliance within their respective areas of responsibility
- Supporting security initiatives and providing necessary resources
- Regular communication with security team on departmental risks

#### All Personnel
- Following established security procedures and policies
- Reporting security incidents and suspicious activities
- Participating in mandatory security awareness training

### 4. Implementation Requirements

#### Technical Controls
- Multi-factor authentication for all privileged accounts
- Endpoint detection and response (EDR) solutions
- Network segmentation and access controls
- Regular vulnerability assessments and penetration testing
- Encrypted communications for sensitive data transmission

#### Administrative Controls
- Security awareness training programs
- Incident response procedures and escalation paths
- Regular policy reviews and updates
- Documentation of security procedures and configurations
- Vendor risk management processes

#### Physical Controls
- Secure access controls to critical infrastructure
- Environmental monitoring and protection systems
- Backup and recovery procedures with offsite storage
- Clean desk and clear screen policies

### 5. Compliance and Monitoring

#### Regular Assessments
- Quarterly security posture assessments
- Annual third-party security audits
- Continuous monitoring of security controls effectiveness
- Monthly review of security metrics and KPIs

#### Reporting Requirements
- Monthly security dashboard reports to executive leadership
- Quarterly compliance status reports to the board of directors
- Annual comprehensive security program review
- Incident response reports within 24 hours of discovery

### 6. Training and Awareness

#### Security Awareness Program
- Annual mandatory cybersecurity training for all employees
- Specialized training for privileged users and administrators
- Phishing simulation exercises and security testing
- Regular communication about emerging threats and best practices

#### Competency Development
- Professional certifications for security team members
- Regular attendance at security conferences and training events
- Knowledge sharing sessions and internal security briefings
- Mentorship programs for security skill development

### 7. Incident Response

#### Response Framework
- 24/7 security operations center (SOC) monitoring
- Defined incident classification and escalation procedures
- Communication protocols for internal and external stakeholders
- Evidence preservation and forensic investigation capabilities

#### Recovery Procedures
- Business continuity and disaster recovery planning
- Regular testing of backup and recovery systems
- Communication with law enforcement and regulatory bodies
- Post-incident review and lessons learned documentation

### 8. Review and Updates

#### Policy Maintenance
- Annual comprehensive policy review and updates
- Quarterly assessment of policy effectiveness
- Regular alignment with changing regulatory requirements
- Stakeholder feedback integration and continuous improvement

#### Change Management
- Formal change control processes for policy modifications
- Impact assessment for proposed changes
- Approval workflows and documentation requirements
- Communication of policy changes to all stakeholders

---

**Document Information:**
- Document ID: ${id}
- Generated: ${now.toLocaleDateString()}
- Status: Draft
- Version: 1.0
- Next Review: ${new Date(now.setFullYear(now.getFullYear() + 1)).toLocaleDateString()}

**Compliance Frameworks:**
- NCA Essential Cybersecurity Controls (ECC)
- ISO 27001:2022 Information Security Management
- NIST Cybersecurity Framework 2.0
- Saudi Arabia Data Protection Law

---
*This document was automatically generated by Metaworks CISO Portal AI*
*© ${new Date().getFullYear()} Metaworks - All rights reserved*
`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            CISO Portal
          </h1>
          <p className="text-muted-foreground">
            AI-Powered Security Policy Generation & Expert Consultation
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export All
          </Button>
          <Button className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Generate Policy
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Priority</p>
                <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-500">{stats.high}</p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Document Library</TabsTrigger>
          <TabsTrigger value="generator">Policy Generator</TabsTrigger>
          <TabsTrigger value="consultant">Expert Consultant</TabsTrigger>
          <TabsTrigger value="library">Manage Library</TabsTrigger>
        </TabsList>

        {/* Document Library Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search policies and documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-ciso-search"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => {
              const IconComponent = document.icon;
              return (
                <Card key={document.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{document.title}</CardTitle>
                          <Badge 
                            className={`${getPriorityColor(document.priority)} text-white mt-1`}
                            variant="secondary"
                          >
                            {document.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {document.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Category: {document.category}</span>
                      <span>Est. Time: {document.estimatedTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleGenerateDocument(document.id, document.title)}
                        disabled={isGenerating === document.id}
                        data-testid={`button-generate-${document.id}`}
                      >
                        {isGenerating === document.id ? "Generating..." : "Generate"}
                      </Button>
                      {generatedDocuments[document.id] ? (
                        <PolicyDocumentViewer
                          content={generatedDocuments[document.id]}
                          metadata={{
                            id: document.id,
                            title: document.title,
                            type: 'Security Policy',
                            description: document.description,
                            author: 'AI Policy Generator',
                            company: 'Your Organization',
                            createdDate: new Date().toLocaleDateString(),
                            status: 'draft',
                            priority: document.priority.toLowerCase(),
                            category: document.category,
                            version: "1.0"
                          }}
                          triggerButton={
                            <Button size="sm" variant="outline" data-testid={`button-view-${document.id}`}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          }
                        />
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled
                          data-testid={`button-view-${document.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Policy Generator Tab */}
        <TabsContent value="generator">
          <PolicyGenerator />
        </TabsContent>

        {/* Expert Consultant Tab */}
        <TabsContent value="consultant">
          <CISOExpertConsultant />
        </TabsContent>

        {/* Library Management Tab */}
        <TabsContent value="library">
          <PolicyLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
}