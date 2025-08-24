import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, 
  Users, 
  Settings,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Building2,
  Lock,
  Monitor,
  Shield,
  Database,
  Search,
  Code,
  MapPin,
  PlayCircle,
  BookOpen,
  TrendingUp
} from "lucide-react";

interface NCECCDomain {
  id: string;
  name: string;
  description: string;
  icon: any;
  requirements: string[];
  policies: string[];
  status: 'not-started' | 'in-progress' | 'completed' | 'needs-review';
  completionRate: number;
  priority: 'high' | 'medium' | 'low';
}

const NCA_ECC_DOMAINS: NCECCDomain[] = [
  {
    id: 'governance-strategy',
    name: 'Cybersecurity Governance & Strategy',
    description: 'Establish cybersecurity governance structure and strategic direction',
    icon: Building2,
    requirements: [
      'Establish cybersecurity governance structure',
      'Develop cybersecurity policies',
      'Assign roles and responsibilities',
      'Define cybersecurity strategy'
    ],
    policies: [
      'Cybersecurity Governance Policy',
      'Cybersecurity Roles & Responsibilities Policy',
      'Cybersecurity Strategy Document'
    ],
    status: 'in-progress',
    completionRate: 75,
    priority: 'high'
  },
  {
    id: 'risk-management',
    name: 'Risk Management',
    description: 'Implement comprehensive risk assessment and management processes',
    icon: AlertTriangle,
    requirements: [
      'Conduct periodic risk assessments',
      'Implement risk treatment plans',
      'Ensure business continuity planning',
      'Monitor and update risks'
    ],
    policies: [
      'Risk Management Policy',
      'Business Continuity & Disaster Recovery Plan',
      'Incident Response Plan'
    ],
    status: 'completed',
    completionRate: 100,
    priority: 'high'
  },
  {
    id: 'human-resource-security',
    name: 'Human Resource Security',
    description: 'Secure human resource processes and ensure staff competency',
    icon: Users,
    requirements: [
      'Conduct background checks for employees',
      'Provide cybersecurity awareness training',
      'Define access control policies',
      'Screen new hires'
    ],
    policies: [
      'Employee Background Verification Policy',
      'Cybersecurity Training & Awareness Policy',
      'User Access Management Policy'
    ],
    status: 'in-progress',
    completionRate: 60,
    priority: 'medium'
  },
  {
    id: 'asset-management',
    name: 'Asset Management',
    description: 'Maintain comprehensive asset inventory and protection controls',
    icon: Database,
    requirements: [
      'Maintain inventory of assets',
      'Classify and protect critical assets',
      'Define data retention policies',
      'Conduct periodic reviews'
    ],
    policies: [
      'Asset Management Policy',
      'Data Classification Policy',
      'Data Retention & Disposal Policy'
    ],
    status: 'needs-review',
    completionRate: 85,
    priority: 'medium'
  },
  {
    id: 'access-control',
    name: 'Access Control',
    description: 'Implement robust access control and authentication mechanisms',
    icon: Lock,
    requirements: [
      'Implement role-based access controls',
      'Enforce multi-factor authentication (MFA)',
      'Monitor and review access logs',
      'Define user roles and permissions'
    ],
    policies: [
      'Access Control Policy',
      'Multi-Factor Authentication Policy',
      'Privilege Management Policy'
    ],
    status: 'in-progress',
    completionRate: 45,
    priority: 'high'
  },
  {
    id: 'cybersecurity-operations',
    name: 'Cybersecurity Operations',
    description: 'Establish security operations center and monitoring capabilities',
    icon: Monitor,
    requirements: [
      'Establish Security Operations Center (SOC)',
      'Implement security monitoring solutions',
      'Define incident response procedures',
      'Deploy monitoring tools'
    ],
    policies: [
      'Security Operations Policy',
      'Incident Detection & Response Plan',
      'Threat Intelligence Policy'
    ],
    status: 'not-started',
    completionRate: 0,
    priority: 'high'
  },
  {
    id: 'business-continuity',
    name: 'Business Continuity & Disaster Recovery',
    description: 'Ensure business continuity and disaster recovery capabilities',
    icon: Shield,
    requirements: [
      'Develop and test DR plans',
      'Implement backup solutions',
      'Conduct continuity drills',
      'Identify critical business processes'
    ],
    policies: [
      'Business Continuity Policy',
      'Disaster Recovery Plan',
      'Backup & Restoration Policy'
    ],
    status: 'in-progress',
    completionRate: 30,
    priority: 'high'
  },
  {
    id: 'compliance-audit',
    name: 'Compliance & Audit',
    description: 'Maintain compliance with NCA ECC and conduct regular audits',
    icon: CheckCircle,
    requirements: [
      'Conduct periodic security audits',
      'Maintain compliance with NCA ECC',
      'Document cybersecurity incidents',
      'Implement corrective actions'
    ],
    policies: [
      'Audit & Compliance Policy',
      'Regulatory Compliance Tracking Policy',
      'Cybersecurity Incident Documentation Procedure'
    ],
    status: 'in-progress',
    completionRate: 55,
    priority: 'medium'
  },
  {
    id: 'penetration-testing',
    name: 'Penetration Testing',
    description: 'Regular security testing and vulnerability assessments',
    icon: Search,
    requirements: [
      'Conduct penetration testing regularly',
      'Include all technology components',
      'Ensure minimal disruption to production',
      'Document vulnerabilities and remediation'
    ],
    policies: [
      'Penetration Testing Policy',
      'Third-party Cybersecurity Testing Policy',
      'Penetration Testing Data Protection Guidelines'
    ],
    status: 'not-started',
    completionRate: 0,
    priority: 'medium'
  },
  {
    id: 'secure-development',
    name: 'Secure Systems Development',
    description: 'Implement secure software development lifecycle practices',
    icon: Code,
    requirements: [
      'Implement secure SDLC',
      'Conduct threat modeling and risk assessments',
      'Perform vulnerability testing',
      'Integrate security into development'
    ],
    policies: [
      'Secure Software Development Policy',
      'Source Code Security Standards',
      'Software Composition Analysis Guidelines'
    ],
    status: 'not-started',
    completionRate: 0,
    priority: 'low'
  },
  {
    id: 'physical-security',
    name: 'Physical Security',
    description: 'Implement physical security controls and access management',
    icon: MapPin,
    requirements: [
      'Implement access control measures',
      'Monitor physical security through surveillance',
      'Restrict third-party access',
      'Develop physical security plan'
    ],
    policies: [
      'Physical Security Policy',
      'Data Center Access Control Policy',
      'Emergency Response Procedures'
    ],
    status: 'needs-review',
    completionRate: 70,
    priority: 'medium'
  }
];

const DEPLOYMENT_PHASES = [
  {
    id: 'assessment',
    name: 'Assessment Phase',
    description: 'Conduct cybersecurity readiness assessment and gap analysis',
    icon: Target,
    status: 'completed',
    tasks: [
      'Conduct cybersecurity readiness assessment',
      'Identify gaps against NCA ECC requirements',
      'Define compliance roadmap'
    ]
  },
  {
    id: 'planning',
    name: 'Planning Phase',
    description: 'Develop implementation plan and assign responsibilities',
    icon: FileText,
    status: 'in-progress',
    tasks: [
      'Assign responsibilities',
      'Develop policies and procedures',
      'Design risk management framework'
    ]
  },
  {
    id: 'implementation',
    name: 'Implementation Phase',
    description: 'Deploy security controls and conduct training',
    icon: PlayCircle,
    status: 'not-started',
    tasks: [
      'Deploy security controls',
      'Conduct awareness training',
      'Implement monitoring solutions'
    ]
  },
  {
    id: 'validation',
    name: 'Validation Phase',
    description: 'Validate compliance through audits and assessments',
    icon: CheckCircle,
    status: 'not-started',
    tasks: [
      'Perform audits and assessments',
      'Validate compliance with NCA ECC'
    ]
  },
  {
    id: 'improvement',
    name: 'Continuous Improvement',
    description: 'Ongoing monitoring and enhancement of security posture',
    icon: TrendingUp,
    status: 'not-started',
    tasks: [
      'Periodic reviews and updates',
      'Incident management and response refinement'
    ]
  }
];

export default function NCAECCImplementation() {
  const [selectedDomain, setSelectedDomain] = useState<NCECCDomain | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'needs-review': return 'bg-yellow-500';
      case 'not-started': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'needs-review': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'not-started': return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const overallProgress = Math.round(
    NCA_ECC_DOMAINS.reduce((sum, domain) => sum + domain.completionRate, 0) / NCA_ECC_DOMAINS.length
  );

  const completedDomains = NCA_ECC_DOMAINS.filter(d => d.status === 'completed').length;
  const inProgressDomains = NCA_ECC_DOMAINS.filter(d => d.status === 'in-progress').length;
  const needsReviewDomains = NCA_ECC_DOMAINS.filter(d => d.status === 'needs-review').length;

  return (
    <div className="space-y-6" data-testid="nca-ecc-implementation">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            NCA ECC Implementation Portal
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive deployment strategy for National Cybersecurity Authority Essential Cybersecurity Controls
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Implementation Guide
          </Button>
          <Button className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            Start Assessment
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{overallProgress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-500">{completedDomains}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-500">{inProgressDomains}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Needs Review</p>
                <p className="text-2xl font-bold text-yellow-500">{needsReviewDomains}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Implementation Overview</TabsTrigger>
          <TabsTrigger value="domains">Domain Management</TabsTrigger>
          <TabsTrigger value="workflow">Deployment Workflow</TabsTrigger>
          <TabsTrigger value="policies">Policy Templates</TabsTrigger>
        </TabsList>

        {/* Implementation Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Domain Status Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Domain Implementation Status</CardTitle>
                <CardDescription>Current status of all 11 NCA ECC domains</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {NCA_ECC_DOMAINS.slice(0, 6).map((domain) => {
                    const Icon = domain.icon;
                    return (
                      <div key={domain.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">{domain.name}</p>
                            <p className="text-sm text-muted-foreground">{domain.completionRate}% complete</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(domain.status)}
                          <Badge className={getPriorityColor(domain.priority)}>
                            {domain.priority}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("domains")}>
                    View All Domains
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Deployment Phases */}
            <Card>
              <CardHeader>
                <CardTitle>Deployment Workflow</CardTitle>
                <CardDescription>5-phase implementation approach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DEPLOYMENT_PHASES.map((phase, index) => {
                    const Icon = phase.icon;
                    return (
                      <div key={phase.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          phase.status === 'completed' ? 'bg-green-500' : 
                          phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                        }`}>
                          {phase.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{phase.name}</p>
                          <p className="text-sm text-muted-foreground">{phase.description}</p>
                        </div>
                        {getStatusIcon(phase.status)}
                      </div>
                    );
                  })}
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("workflow")}>
                    View Detailed Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Personnel Section */}
          <Card>
            <CardHeader>
              <CardTitle>Key Personnel & Responsibilities</CardTitle>
              <CardDescription>Assign roles and responsibilities for NCA ECC implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { role: 'Chief Technology Officer (CTO)', responsibilities: 'Technology strategy and oversight', icon: Settings },
                  { role: 'Chief Information Officer (CIO)', responsibilities: 'Information systems management', icon: Database },
                  { role: 'Cybersecurity Officer', responsibilities: 'Security implementation and compliance', icon: Shield },
                  { role: 'Risk & Compliance Officer', responsibilities: 'Risk management and regulatory compliance', icon: AlertTriangle }
                ].map((person, index) => {
                  const Icon = person.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                          <Icon className="w-8 h-8 mx-auto text-primary" />
                          <h3 className="font-semibold">{person.role}</h3>
                          <p className="text-sm text-muted-foreground">{person.responsibilities}</p>
                          <Button variant="outline" size="sm">Assign Personnel</Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Management Tab */}
        <TabsContent value="domains" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {NCA_ECC_DOMAINS.map((domain) => {
              const Icon = domain.icon;
              return (
                <Card key={domain.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedDomain(domain)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="w-6 h-6 text-primary" />
                      <Badge className={getPriorityColor(domain.priority)}>
                        {domain.priority}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{domain.name}</CardTitle>
                    <CardDescription>{domain.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{domain.completionRate}%</span>
                      </div>
                      <Progress value={domain.completionRate} />
                      <div className="flex items-center gap-2">
                        {getStatusIcon(domain.status)}
                        <span className="text-sm capitalize">{domain.status.replace('-', ' ')}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {domain.requirements.length} requirements • {domain.policies.length} policies
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Deployment Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <div className="space-y-6">
            {DEPLOYMENT_PHASES.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <Card key={phase.id}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        phase.status === 'completed' ? 'bg-green-500' : 
                        phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Phase {index + 1}: {phase.name}
                          {getStatusIcon(phase.status)}
                        </CardTitle>
                        <CardDescription>{phase.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {phase.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">Start Phase</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Policy Templates Tab */}
        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>NCA ECC Policy Template Generator</CardTitle>
              <CardDescription>Generate compliance-ready policies for all domains</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Policy template generator coming soon</p>
                <p className="text-sm">Auto-generate compliance policies based on NCA ECC requirements</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Domain Detail Modal */}
      {selectedDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <selectedDomain.icon className="w-6 h-6 text-primary" />
                  <CardTitle>{selectedDomain.name}</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedDomain(null)}>
                  Close
                </Button>
              </div>
              <CardDescription>{selectedDomain.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-medium">Implementation Progress</span>
                <span className="text-sm text-muted-foreground">{selectedDomain.completionRate}%</span>
              </div>
              <Progress value={selectedDomain.completionRate} />
              
              <div>
                <h4 className="font-semibold mb-3">Requirements</h4>
                <div className="space-y-2">
                  {selectedDomain.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Required Policies</h4>
                <div className="space-y-2">
                  {selectedDomain.policies.map((policy, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{policy}</span>
                      <Button size="sm" variant="outline">Generate</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Start Implementation</Button>
                <Button variant="outline">View Assessment</Button>
                <Button variant="outline">Generate Policies</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}