import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentViewer from "@/components/common/document-viewer";
import { 
  Monitor, 
  Server, 
  Terminal, 
  Shield, 
  Database, 
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Wand2,
  MessageSquare,
  Archive,
  Download,
  Search,
  Filter,
  Zap,
  Settings,
  Lock
} from "lucide-react";

export default function SysAdminTools() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const stats = {
    totalDocuments: 28,
    criticalPriority: 6,
    highPriority: 14,
    categories: 20
  };

  const categories = [
    "All", "Server Management", "Network Administration", "Security Operations", 
    "Backup & Recovery", "System Monitoring", "User Management", 
    "Incident Response", "Maintenance", "Compliance", "Performance"
  ];

  const policies = [
    {
      id: 1,
      title: "Server Administration Manual",
      description: "Comprehensive server management and maintenance procedures",
      category: "Server Management",
      priority: "Critical",
      estimatedTime: "5-7 hours",
      status: "Generate"
    },
    {
      id: 2,
      title: "Network Security Protocol",
      description: "Network monitoring, security, and incident response procedures",
      category: "Network Administration", 
      priority: "Critical",
      estimatedTime: "4-6 hours",
      status: "Generate"
    },
    {
      id: 3,
      title: "System Backup Procedures",
      description: "Automated backup strategies and disaster recovery protocols",
      category: "Backup & Recovery",
      priority: "Critical",
      estimatedTime: "3-5 hours", 
      status: "Generate"
    },
    {
      id: 4,
      title: "User Account Management",
      description: "User provisioning, access control, and account lifecycle management",
      category: "User Management",
      priority: "High",
      estimatedTime: "2-4 hours",
      status: "Generate"
    },
    {
      id: 5,
      title: "System Monitoring Setup",
      description: "Performance monitoring, alerting, and health check procedures",
      category: "System Monitoring",
      priority: "High",
      estimatedTime: "4-6 hours",
      status: "Generate"
    },
    {
      id: 6,
      title: "Security Incident Response",
      description: "Step-by-step procedures for handling security incidents and breaches",
      category: "Incident Response",
      priority: "Critical",
      estimatedTime: "5-7 hours",
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
SYSTEM ADMINISTRATION GUIDE: ${policy.title}

OPERATIONAL OVERVIEW:
${policy.description}

SCOPE & RESPONSIBILITIES:
This document covers system administration tasks, procedures, and best practices 
for maintaining secure, reliable, and high-performance IT infrastructure.

SYSTEM ADMINISTRATOR DUTIES:
- Server configuration, maintenance, and monitoring
- Network security implementation and monitoring
- User account management and access control
- System backup and disaster recovery operations
- Performance optimization and capacity planning
- Security incident response and investigation

TECHNICAL PROCEDURES:
- Daily system health checks and monitoring
- Regular security updates and patch management
- Automated backup verification and testing
- Network traffic analysis and security scanning
- User access reviews and permission audits
- System performance tuning and optimization

SECURITY PROTOCOLS:
- Multi-factor authentication enforcement
- Network segmentation and firewall management
- Intrusion detection and prevention systems
- Security event logging and analysis
- Vulnerability scanning and remediation
- Compliance monitoring and reporting

OPERATIONAL WORKFLOWS:
1. Morning System Checks: Verify all systems are operational
2. Security Monitoring: Review overnight security events
3. Performance Analysis: Check system resource utilization
4. Backup Verification: Confirm successful backup operations
5. User Support: Handle access requests and technical issues
6. Documentation: Update procedures and incident reports

EMERGENCY PROCEDURES:
- System outage response and escalation
- Security breach containment and investigation
- Data recovery and restoration processes
- Communication protocols for stakeholders
- Post-incident analysis and improvement

COMPLIANCE REQUIREMENTS:
- Regular security assessments and audits
- Documentation of all administrative activities
- Change management and approval processes
- Data retention and privacy protection
- Industry-specific regulatory compliance

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
            <Monitor className="w-8 h-8 text-primary" />
            System Admin Tools
          </h1>
          <p className="text-muted-foreground mt-1">
            System Administration & Infrastructure Management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button>
            <Terminal className="w-4 h-4 mr-2" />
            Generate Guide
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
                <Server className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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
              <Terminal className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold">Procedure Generator</h3>
              <Button size="sm" className="mt-2" variant="outline">
                Create
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold">Tech Support</h3>
              <Button size="sm" className="mt-2" variant="outline">
                Ask
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 border-orange-200 dark:border-orange-700">
            <CardContent className="p-4 text-center">
              <Settings className="w-8 h-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold">Manage Tools</h3>
              <Button size="sm" className="mt-2" variant="outline">
                Configure
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
                  <CardTitle>System Administration Guides</CardTitle>
                  <CardDescription>
                    Generate comprehensive system administration procedures and protocols
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search procedures..."
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
                          <Shield className="w-5 h-5 text-green-500" />
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
                            type: 'System Administration Guide',
                            description: policy.description,
                            author: 'System Admin Tools',
                            createdDate: new Date().toLocaleDateString(),
                            status: 'draft',
                            priority: (policy.priority?.toLowerCase() || 'medium') as 'high' | 'medium' | 'low',
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