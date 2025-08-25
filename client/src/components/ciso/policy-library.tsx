import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Download, 
  Upload,
  FileText, 
  Trash2, 
  Edit,
  Eye,
  Star,
  Calendar,
  User,
  Tag,
  Filter,
  Archive,
  Share2,
  GitCompare
} from "lucide-react";
import { PolicyDocumentViewer } from "@/components/common/policy-document-viewer";
import { PolicyComparisonViewer } from "@/components/common/policy-comparison-viewer";

interface PolicyDocument {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  version: string;
  lastModified: Date;
  author: string;
  size: string;
  tags: string[];
  starred: boolean;
  description: string;
  content: string;
}

const MOCK_POLICIES: PolicyDocument[] = [
  {
    id: '1',
    title: 'Information Security Policy',
    category: 'Governance',
    status: 'approved',
    version: '2.1',
    lastModified: new Date('2024-01-15'),
    author: 'John Smith (CISO)',
    size: '245 KB',
    tags: ['iso27001', 'governance', 'baseline'],
    starred: true,
    description: 'Comprehensive information security governance framework',
    content: `# Information Security Policy

## 1. Purpose and Scope
This Information Security Policy establishes the framework for protecting information assets and ensuring compliance with regulatory requirements.

## 2. Objectives
- Protect confidentiality, integrity, and availability of information
- Ensure compliance with applicable laws and regulations
- Establish clear security responsibilities
- Minimize security risks to the organization

## 3. Policy Statement
The organization is committed to protecting its information assets through comprehensive security controls and procedures.

## 4. Roles and Responsibilities
- CISO: Overall security strategy and governance
- IT Team: Technical implementation and monitoring
- All Employees: Following security procedures

## 5. Implementation
Security controls will be implemented across all information systems and processes.`
  },
  {
    id: '2',
    title: 'Incident Response Plan',
    category: 'Incident Response',
    status: 'approved',
    version: '1.8',
    lastModified: new Date('2024-01-12'),
    author: 'Sarah Johnson',
    size: '189 KB',
    tags: ['incident', 'emergency', 'response'],
    starred: false,
    description: 'Detailed procedures for cybersecurity incident handling',
    content: `# Incident Response Plan

## 1. Overview
This plan provides comprehensive procedures for detecting, responding to, and recovering from cybersecurity incidents.

## 2. Incident Classification
- Level 1: Low impact incidents
- Level 2: Medium impact incidents  
- Level 3: High impact incidents
- Level 4: Critical incidents

## 3. Response Team
- Incident Commander: Leads response efforts
- Technical Team: Handles technical response
- Communications Team: Manages internal/external communications
- Legal Team: Provides legal guidance

## 4. Response Procedures
1. Detection and Analysis
2. Containment, Eradication, and Recovery
3. Post-Incident Activity

## 5. Communication Protocols
Clear escalation and notification procedures for all incident types.`
  },
  {
    id: '3',
    title: 'Data Classification Policy',
    category: 'Data Protection',
    status: 'review',
    version: '1.2',
    lastModified: new Date('2024-01-10'),
    author: 'Mike Chen',
    size: '156 KB',
    tags: ['data', 'classification', 'privacy'],
    starred: false,
    description: 'Framework for data categorization and handling requirements',
    content: `# Data Classification Policy

## 1. Purpose
This policy establishes a framework for classifying data based on sensitivity and business value.

## 2. Data Classification Levels
- Public: Information that can be freely shared
- Internal: Information for internal use only
- Confidential: Sensitive information requiring protection
- Restricted: Highly sensitive information with strict access controls

## 3. Classification Criteria
Data classification is based on:
- Sensitivity level
- Regulatory requirements
- Business impact if compromised
- Legal obligations

## 4. Handling Requirements
Each classification level has specific handling, storage, and transmission requirements.

## 5. Responsibilities
Data owners are responsible for classifying data and ensuring appropriate protection measures.`
  },
  {
    id: '4',
    title: 'Access Control Policy',
    category: 'Access Management',
    status: 'draft',
    version: '0.9',
    lastModified: new Date('2024-01-08'),
    author: 'Lisa Wong',
    size: '198 KB',
    tags: ['access', 'authentication', 'authorization'],
    starred: true,
    description: 'User access management and authentication requirements',
    content: `# Access Control Policy

## 1. Overview
This policy defines requirements for managing user access to information systems and resources.

## 2. Access Control Principles
- Principle of least privilege
- Need-to-know basis
- Regular access reviews
- Strong authentication requirements

## 3. User Account Management
- Account provisioning procedures
- Password requirements and policies
- Multi-factor authentication requirements
- Account deprovisioning procedures

## 4. Access Reviews
Regular reviews of user access rights to ensure appropriateness and compliance.

## 5. Technical Controls
Implementation of technical controls to enforce access policies and monitor compliance.`
  },
  {
    id: '5',
    title: 'Business Continuity Plan',
    category: 'Business Continuity',
    status: 'approved',
    version: '3.0',
    lastModified: new Date('2024-01-05'),
    author: 'David Brown',
    size: '342 KB',
    tags: ['continuity', 'disaster', 'recovery'],
    starred: false,
    description: 'Comprehensive business continuity and disaster recovery procedures',
    content: `# Business Continuity Plan

## 1. Purpose
This plan ensures the organization can continue critical operations during and after a disruptive event.

## 2. Business Impact Analysis
Identification of critical business processes and their recovery requirements:
- Recovery Time Objectives (RTO)
- Recovery Point Objectives (RPO)
- Maximum Tolerable Downtime (MTD)

## 3. Continuity Strategies
- Alternative work arrangements
- Backup systems and data recovery
- Vendor and supplier alternatives
- Communication systems

## 4. Recovery Procedures
Step-by-step procedures for restoring operations after a disruption.

## 5. Testing and Maintenance
Regular testing and updates to ensure plan effectiveness and currency.`
  }
];

export default function PolicyLibrary() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [policies, setPolicies] = useState<PolicyDocument[]>(MOCK_POLICIES);
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const categories = ["All", ...Array.from(new Set(policies.map(p => p.category)))];
  const statuses = ["All", "draft", "review", "approved", "archived"];

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || policy.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || policy.status === selectedStatus;
    const matchesStarred = !showStarredOnly || policy.starred;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesStarred;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'review': return 'bg-yellow-500';
      case 'draft': return 'bg-blue-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleStar = (policyId: string) => {
    setPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { ...policy, starred: !policy.starred }
        : policy
    ));
  };

  const handleDownload = (policy: PolicyDocument) => {
    toast({
      title: "Download Started",
      description: `Downloading ${policy.title} v${policy.version}`,
    });
  };

  const handleDelete = (policyId: string) => {
    setPolicies(prev => prev.filter(policy => policy.id !== policyId));
    toast({
      title: "Policy Deleted",
      description: "The policy has been removed from the library.",
    });
  };

  const uploadPolicy = () => {
    toast({
      title: "Upload Policy",
      description: "Policy upload functionality coming soon.",
    });
  };

  const getStatsData = () => {
    const total = policies.length;
    const approved = policies.filter(p => p.status === 'approved').length;
    const inReview = policies.filter(p => p.status === 'review').length;
    const draft = policies.filter(p => p.status === 'draft').length;
    const starred = policies.filter(p => p.starred).length;
    
    return { total, approved, inReview, draft, starred };
  };

  const stats = getStatsData();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Policies</p>
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
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
              </div>
              <Badge className="bg-green-500 text-white">✓</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Review</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.inReview}</p>
              </div>
              <Badge className="bg-yellow-500 text-white">⏳</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-blue-500">{stats.draft}</p>
              </div>
              <Badge className="bg-blue-500 text-white">📝</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Starred</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.starred}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="library" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library">Policy Library</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Policy Library Tab */}
        <TabsContent value="library" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Policy Library Management</CardTitle>
                  <CardDescription>Manage, organize, and track your security policies</CardDescription>
                </div>
                <div className="flex gap-2">
                  <PolicyComparisonViewer 
                    documents={policies.map(p => ({
                      id: p.id,
                      title: p.title,
                      content: p.content,
                      version: p.version,
                      lastModified: p.lastModified.toLocaleDateString(),
                      author: p.author,
                      status: p.status,
                      category: p.category
                    }))}
                    triggerButton={
                      <Button variant="outline" data-testid="button-compare-policies">
                        <GitCompare className="w-4 h-4 mr-2" />
                        Compare Documents
                      </Button>
                    }
                  />
                  <Button onClick={uploadPolicy} data-testid="button-upload-policy">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Policy
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search policies, descriptions, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="input-policy-search"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={showStarredOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowStarredOnly(!showStarredOnly)}
                    data-testid="button-filter-starred"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Starred
                  </Button>
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
              <div className="flex gap-2 mt-4">
                <Label className="text-sm font-medium">Status:</Label>
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    data-testid={`button-status-${status}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Policies List */}
          <div className="space-y-4">
            {filteredPolicies.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No policies found</p>
                    <p className="text-sm">Try adjusting your search criteria or filters</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredPolicies.map((policy) => (
                <Card key={policy.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{policy.title}</h3>
                          <Badge className={`${getStatusColor(policy.status)} text-white`}>
                            {policy.status}
                          </Badge>
                          <Badge variant="outline">v{policy.version}</Badge>
                          {policy.starred && (
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{policy.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {policy.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {policy.lastModified.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {policy.size}
                          </div>
                        </div>

                        <div className="flex gap-1 flex-wrap">
                          {policy.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStar(policy.id)}
                          data-testid={`button-star-${policy.id}`}
                        >
                          <Star className={`w-4 h-4 ${policy.starred ? 'text-yellow-400 fill-current' : ''}`} />
                        </Button>
                        <PolicyDocumentViewer
                          content={policy.content}
                          metadata={{
                            id: policy.id,
                            title: policy.title,
                            type: 'Security Policy',
                            description: policy.description,
                            author: policy.author,
                            company: 'Your Organization',
                            createdDate: policy.lastModified.toLocaleDateString(),
                            status: policy.status,
                            priority: 'medium',
                            category: policy.category,
                            version: policy.version
                          }}
                          triggerButton={
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid={`button-view-${policy.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          }
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-edit-${policy.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(policy)}
                          data-testid={`button-download-${policy.id}`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-share-${policy.id}`}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(policy.id)}
                          data-testid={`button-delete-${policy.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
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