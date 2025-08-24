import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Shield, 
  Settings, 
  Users, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Calendar,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cisoPolicyTypes, cisoPolicyCategories } from "@shared/schema";
import PolicyCreationForm from "@/components/ciso/policy-creation-form";
import OnboardingExperience from "@/components/ciso/onboarding-experience";

// Mock data for initial display - in real app this would come from API
const mockPolicies = [
  {
    id: 1,
    policyType: "Information Security Policy",
    category: "Governance & Compliance",
    title: "Corporate Information Security Policy v2.1",
    description: "Comprehensive information security policy covering all aspects of data protection and security controls",
    status: "active",
    priority: "critical",
    owner: "CISO Office",
    version: "2.1",
    reviewDate: "2024-12-01",
    expiryDate: "2025-12-01",
    aiGenerated: false,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-08-24T14:30:00Z"
  },
  {
    id: 2,
    policyType: "Incident Response Plan",
    category: "Incident & Crisis Management",
    title: "Cybersecurity Incident Response Plan",
    description: "Detailed procedures for detecting, responding to, and recovering from security incidents",
    status: "draft",
    priority: "high",
    owner: "Security Operations",
    version: "1.0",
    reviewDate: "2024-09-15",
    expiryDate: "2025-09-15",
    aiGenerated: true,
    createdAt: "2024-08-20T09:15:00Z",
    updatedAt: "2024-08-24T11:20:00Z"
  },
  {
    id: 3,
    policyType: "Access Control Policy",
    category: "Access & Identity Management",
    title: "Identity and Access Management Policy",
    description: "Policy governing user access rights, authentication, and authorization procedures",
    status: "review",
    priority: "high",
    owner: "IT Security",
    version: "1.5",
    reviewDate: "2024-10-01",
    expiryDate: "2025-10-01",
    aiGenerated: false,
    createdAt: "2024-06-10T16:45:00Z",
    updatedAt: "2024-08-22T13:10:00Z"
  }
];

const policyStatusColors = {
  draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
  review: "bg-blue-100 text-blue-800 border-blue-200", 
  approved: "bg-green-100 text-green-800 border-green-200",
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  archived: "bg-gray-100 text-gray-800 border-gray-200"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800", 
  critical: "bg-red-100 text-red-800"
};

export default function CisoPolicies() {
  const [policies, setPolicies] = useState(mockPolicies);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();

  // Check if user has seen onboarding before (in real app, this would be from user preferences/localStorage)
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('ciso-policies-onboarding-completed');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Filter policies based on search and filters
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.policyType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || policy.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || policy.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Group policies by category for overview
  const policiesByCategory = cisoPolicyCategories.reduce((acc, category) => {
    acc[category] = filteredPolicies.filter(p => p.category === category);
    return acc;
  }, {} as Record<string, any[]>);

  const getPolicyIcon = (policyType: string) => {
    switch (policyType) {
      case "Information Security Policy":
        return Shield;
      case "Incident Response Plan":
        return AlertTriangle;
      case "Access Control Policy":
        return Users;
      case "Network Security Policy":
        return Settings;
      default:
        return FileText;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle;
      case "draft":
        return Edit;
      case "review":
        return Clock;
      case "archived":
        return XCircle;
      default:
        return FileText;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleCreatePolicy = (template?: string) => {
    setSelectedTemplate(template || "");
    setShowCreateDialog(true);
  };

  const handlePolicyCreated = (newPolicy: any) => {
    setPolicies([...policies, { ...newPolicy, id: Date.now() }]);
    toast({
      title: "Policy Created",
      description: `${newPolicy.title} has been created successfully.`,
    });
  };

  const handleViewPolicy = (policy: any) => {
    setSelectedPolicy(policy);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('ciso-policies-onboarding-completed', 'true');
    toast({
      title: "Welcome aboard! 🎉",
      description: "You're all set to start managing your cybersecurity policies.",
    });
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('ciso-policies-onboarding-completed', 'true');
  };

  const startOnboardingTour = () => {
    setShowOnboarding(true);
  };

  const getPolicyStats = () => {
    const total = policies.length;
    const active = policies.filter(p => p.status === "active").length;
    const draft = policies.filter(p => p.status === "draft").length;
    const review = policies.filter(p => p.status === "review").length;
    const critical = policies.filter(p => p.priority === "critical").length;
    
    return { total, active, draft, review, critical };
  };

  const stats = getPolicyStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">CISO Policies & Procedures</h1>
            <p className="text-muted-foreground">Comprehensive cybersecurity policy management system</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={startOnboardingTour}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Take Tour
          </Button>
          <Button 
            onClick={() => handleCreatePolicy()} 
            className="flex items-center gap-2"
            data-onboarding="create-button"
          >
            <Plus className="w-4 h-4" />
            Create Policy
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Policies</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Draft</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <Edit className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Review</p>
                <p className="text-2xl font-bold text-blue-600">{stats.review}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Priority</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <Star className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-policies"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {cisoPolicyCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-onboarding="overview-tab">Overview</TabsTrigger>
          <TabsTrigger value="policies" data-onboarding="policies-tab">All Policies</TabsTrigger>
          <TabsTrigger value="templates" data-onboarding="templates-tab">Templates</TabsTrigger>
          <TabsTrigger value="analytics" data-onboarding="analytics-tab">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Policy Categories Overview */}
          <div className="grid gap-6">
            {cisoPolicyCategories.map(category => {
              const categoryPolicies = policiesByCategory[category] || [];
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category}</span>
                      <Badge variant="outline">{categoryPolicies.length} policies</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categoryPolicies.length > 0 ? (
                      <div className="grid gap-3">
                        {categoryPolicies.slice(0, 3).map(policy => {
                          const Icon = getPolicyIcon(policy.policyType);
                          const StatusIcon = getStatusIcon(policy.status);
                          return (
                            <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="font-medium">{policy.title}</p>
                                  <p className="text-sm text-muted-foreground">{policy.policyType}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs ${policyStatusColors[policy.status as keyof typeof policyStatusColors]}`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {policy.status}
                                </Badge>
                                <Badge className={`text-xs ${priorityColors[policy.priority as keyof typeof priorityColors]}`}>
                                  {policy.priority}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewPolicy(policy)}
                                  data-testid={`button-view-policy-${policy.id}`}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                        {categoryPolicies.length > 3 && (
                          <Button variant="outline" size="sm" onClick={() => setActiveTab("policies")}>
                            View all {categoryPolicies.length} policies in {category}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No policies in this category yet</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => handleCreatePolicy()}>
                          Create First Policy
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          {/* All Policies List */}
          <div className="grid gap-4">
            {filteredPolicies.length > 0 ? (
              filteredPolicies.map(policy => {
                const Icon = getPolicyIcon(policy.policyType);
                const StatusIcon = getStatusIcon(policy.status);
                return (
                  <Card key={policy.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Icon className="w-8 h-8 text-primary mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{policy.title}</h3>
                              {policy.aiGenerated && (
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                  AI Generated
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-3">{policy.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {policy.owner}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Review: {formatDate(policy.reviewDate)}
                              </span>
                              <span>Version {policy.version}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${policyStatusColors[policy.status as keyof typeof policyStatusColors]}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {policy.status}
                          </Badge>
                          <Badge className={`${priorityColors[policy.priority as keyof typeof priorityColors]}`}>
                            {policy.priority}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPolicy(policy)}
                            data-testid={`button-view-policy-detail-${policy.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">No policies found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter !== "all" || statusFilter !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Create your first policy to get started"}
                  </p>
                  <Button onClick={() => handleCreatePolicy()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Policy
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {/* Policy Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cisoPolicyTypes.map(policyType => {
              const Icon = getPolicyIcon(policyType);
              return (
                <Card key={policyType} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                      <h3 className="font-semibold">{policyType}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ready-to-use template for creating a comprehensive {policyType.toLowerCase()}
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCreatePolicy(policyType)}
                      data-testid={`button-use-template-${policyType.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Policy Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cisoPolicyCategories.map(category => {
                    const count = policiesByCategory[category]?.length || 0;
                    const percentage = policies.length > 0 ? (count / policies.length) * 100 : 0;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Policy Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["active", "draft", "review", "approved", "archived"].map(status => {
                    const count = policies.filter(p => p.status === status).length;
                    const percentage = policies.length > 0 ? (count / policies.length) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Policy Details Dialog */}
      {selectedPolicy && (
        <Dialog open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = getPolicyIcon(selectedPolicy.policyType);
                  return <Icon className="w-5 h-5" />;
                })()}
                {selectedPolicy.title}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Policy Type</label>
                    <p>{selectedPolicy.policyType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <p>{selectedPolicy.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <p className="capitalize">{selectedPolicy.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                    <p className="capitalize">{selectedPolicy.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Owner</label>
                    <p>{selectedPolicy.owner}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Version</label>
                    <p>{selectedPolicy.version}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1">{selectedPolicy.description}</p>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Policy
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button size="sm" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Assign Reviewers
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {/* Policy Creation Form */}
      <PolicyCreationForm
        isOpen={showCreateDialog}
        onClose={() => {
          setShowCreateDialog(false);
          setSelectedTemplate("");
        }}
        selectedTemplate={selectedTemplate}
        onPolicyCreated={handlePolicyCreated}
      />

      {/* Onboarding Experience */}
      <OnboardingExperience
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
}