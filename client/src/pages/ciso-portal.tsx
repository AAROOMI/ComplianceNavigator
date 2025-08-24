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
                      <Button size="sm" className="flex-1">
                        Generate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
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