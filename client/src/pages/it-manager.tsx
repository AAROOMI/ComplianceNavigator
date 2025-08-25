import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentViewer from "@/components/common/document-viewer";
import { 
  Settings, 
  Server, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Database,
  Network,
  Activity,
  FileText,
  Wand2,
  MessageSquare,
  Archive,
  Monitor,
  HardDrive,
  Cpu,
  Download,
  Search,
  Filter,
  Zap
} from "lucide-react";

export default function ITManagerPortal() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const stats = {
    totalDocuments: 24,
    criticalPriority: 5,
    highPriority: 12,
    categories: 18
  };

  const categories = [
    "All", "Infrastructure", "Network Security", "System Management", 
    "Data Protection", "Access Control", "Backup & Recovery", 
    "Monitoring", "Incident Response", "Compliance", "Operations"
  ];

  const policies = [
    {
      id: 1,
      title: "Network Infrastructure Policy",
      description: "Define network architecture standards and security protocols",
      category: "Infrastructure",
      priority: "High",
      estimatedTime: "4-6 hours",
      status: "Generate"
    },
    {
      id: 2,
      title: "System Administration Procedures",
      description: "Establish procedures for system maintenance and administration",
      category: "System Management", 
      priority: "Critical",
      estimatedTime: "3-5 hours",
      status: "Generate"
    },
    {
      id: 3,
      title: "Data Backup & Recovery Plan",
      description: "Create comprehensive backup strategies and recovery procedures",
      category: "Backup & Recovery",
      priority: "Critical",
      estimatedTime: "5-7 hours", 
      status: "Generate"
    },
    {
      id: 4,
      title: "Access Control Matrix",
      description: "Define user access levels and permission management",
      category: "Access Control",
      priority: "High",
      estimatedTime: "2-4 hours",
      status: "Generate"
    },
    {
      id: 5,
      title: "Network Monitoring Protocol",
      description: "Establish network performance and security monitoring standards",
      category: "Monitoring",
      priority: "High",
      estimatedTime: "3-5 hours",
      status: "Generate"
    },
    {
      id: 6,
      title: "Incident Response Playbook",
      description: "Create step-by-step procedures for IT incident management",
      category: "Incident Response",
      priority: "Critical",
      estimatedTime: "4-6 hours",
      status: "Generate"
    }
  ];

  const filteredPolicies = selectedCategory === "All" 
    ? policies 
    : policies.filter(policy => policy.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-500 text-white";
      case "High": return "bg-orange-500 text-white";
      case "Medium": return "bg-yellow-500 text-white";
      case "Low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const generatePolicy = (policyId: number) => {
    const policy = policies.find(p => p.id === policyId);
    if (!policy) return;

    const content = `
IT MANAGEMENT POLICY: ${policy.title}

OVERVIEW:
${policy.description}

SCOPE:
This policy applies to all IT infrastructure, systems, and operations within the organization.

RESPONSIBILITIES:
- IT Manager: Overall policy implementation and oversight
- System Administrators: Daily operational compliance
- Network Engineers: Infrastructure security and monitoring
- Support Team: User access management and incident response

TECHNICAL REQUIREMENTS:
- Network security protocols and firewall configurations
- System monitoring and performance management
- Data backup and disaster recovery procedures
- User access control and permission management
- Incident response and escalation procedures

COMPLIANCE STANDARDS:
- Industry best practices for IT infrastructure management
- Security frameworks and regulatory requirements
- Change management and documentation standards
- Performance monitoring and reporting requirements

IMPLEMENTATION TIMELINE:
Phase 1: Planning and resource allocation (Week 1-2)
Phase 2: Infrastructure setup and configuration (Week 3-4)
Phase 3: Testing and validation (Week 5-6)
Phase 4: Deployment and training (Week 7-8)

MONITORING & REVIEW:
- Monthly performance reviews
- Quarterly security assessments
- Annual policy updates
- Continuous improvement processes

STATUS: Ready for implementation
PRIORITY: ${policy.priority}
ESTIMATED COMPLETION: ${policy.estimatedTime}
    `;

    return content;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            IT Manager Portal
          </h1>
          <p className="text-muted-foreground mt-1">
            Infrastructure Management & System Policy Generation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button>
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Policy
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalDocuments}</div>
                <div className="text-sm text-muted-foreground">Total Documents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.criticalPriority}</div>
                <div className="text-sm text-muted-foreground">Critical Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.highPriority}</div>
                <div className="text-sm text-muted-foreground">High Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.categories}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Cards */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
            <CardContent className="p-4 text-center">
              <Archive className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold">Document Library</h3>
              <Button size="sm" className="mt-2" variant="outline">
                Browse
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
            <CardContent className="p-4 text-center">
              <Wand2 className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold">Policy Generator</h3>
              <Button size="sm" className="mt-2" variant="outline">
                Create
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold">Expert Consultant</h3>
              <Button size="sm" className="mt-2" variant="outline">
                Ask
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 border-orange-200 dark:border-orange-700">
            <CardContent className="p-4 text-center">
              <Settings className="w-8 h-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold">Manage Library</h3>
              <Button size="sm" className="mt-2" variant="outline">
                Organize
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Policy Generation Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>IT Management Policies</CardTitle>
                  <CardDescription>
                    Generate comprehensive IT policies and procedures
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search policies..."
                      className="pl-10 pr-4 py-2 border rounded-md"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Policy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPolicies.map((policy) => (
                  <Card key={policy.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Server className="w-5 h-5 text-blue-500" />
                          <h3 className="font-semibold">{policy.title}</h3>
                        </div>
                        <Badge className={getPriorityColor(policy.priority)}>
                          {policy.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {policy.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Category: {policy.category}<br />
                          Est. Time: {policy.estimatedTime}
                        </div>
                        <DocumentViewer
                          content={generatePolicy(policy.id)}
                          metadata={{
                            title: policy.title,
                            type: 'IT Management Policy',
                            description: policy.description,
                            author: 'IT Manager Portal',
                            createdDate: new Date().toLocaleDateString(),
                            status: 'draft',
                            priority: policy.priority.toLowerCase() as 'high' | 'medium' | 'low',
                            category: policy.category
                          }}
                          triggerButton={
                            <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white">
                              Generate
                            </Button>
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}