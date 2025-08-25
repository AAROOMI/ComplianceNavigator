import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentViewer from "@/components/common/document-viewer";
import { 
  Rocket, 
  TrendingUp, 
  Target, 
  Users, 
  Code, 
  GitBranch,
  BarChart,
  Lightbulb,
  Clock,
  CheckCircle,
  FileText,
  Wand2,
  MessageSquare,
  Archive,
  Download,
  Search,
  Filter,
  Zap,
  Brain,
  Shield
} from "lucide-react";

export default function CTODashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const stats = {
    totalDocuments: 31,
    criticalPriority: 8,
    highPriority: 15,
    categories: 22
  };

  const categories = [
    "All", "Technology Strategy", "Architecture", "Innovation", 
    "Team Management", "Product Development", "Security Architecture", 
    "Digital Transformation", "AI/ML Strategy", "Cloud Strategy", "DevOps"
  ];

  const policies = [
    {
      id: 1,
      title: "Technology Roadmap Strategy",
      description: "Define long-term technology vision and strategic initiatives",
      category: "Technology Strategy",
      priority: "Critical",
      estimatedTime: "6-8 hours",
      status: "Generate"
    },
    {
      id: 2,
      title: "Software Architecture Guidelines",
      description: "Establish architectural standards and design principles",
      category: "Architecture", 
      priority: "High",
      estimatedTime: "5-7 hours",
      status: "Generate"
    },
    {
      id: 3,
      title: "Innovation Management Framework",
      description: "Create processes for evaluating and implementing new technologies",
      category: "Innovation",
      priority: "High",
      estimatedTime: "4-6 hours", 
      status: "Generate"
    },
    {
      id: 4,
      title: "Engineering Team Standards",
      description: "Define coding standards, review processes, and team practices",
      category: "Team Management",
      priority: "Critical",
      estimatedTime: "3-5 hours",
      status: "Generate"
    },
    {
      id: 5,
      title: "Cloud Migration Strategy",
      description: "Plan and execute cloud transformation initiatives",
      category: "Cloud Strategy",
      priority: "Critical",
      estimatedTime: "7-9 hours",
      status: "Generate"
    },
    {
      id: 6,
      title: "AI/ML Implementation Plan",
      description: "Strategy for artificial intelligence and machine learning adoption",
      category: "AI/ML Strategy",
      priority: "High",
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
CTO STRATEGIC DOCUMENT: ${policy.title}

EXECUTIVE SUMMARY:
${policy.description}

STRATEGIC VISION:
This document outlines the technology leadership approach for driving innovation, 
managing technical teams, and ensuring alignment with business objectives.

TECHNOLOGY LEADERSHIP RESPONSIBILITIES:
- Strategic technology planning and roadmap development
- Architecture oversight and technical decision-making
- Innovation management and emerging technology evaluation
- Engineering team leadership and development
- Cross-functional collaboration with business stakeholders

TECHNICAL FRAMEWORK:
- Modern software architecture patterns and practices
- Cloud-native development and deployment strategies
- AI/ML integration and data-driven decision making
- Cybersecurity and compliance considerations
- Performance optimization and scalability planning

STRATEGIC INITIATIVES:
1. Technology Modernization: Upgrade legacy systems and infrastructure
2. Digital Innovation: Implement cutting-edge solutions for competitive advantage
3. Team Excellence: Build high-performing engineering teams
4. Security First: Integrate security throughout the development lifecycle
5. Data Strategy: Leverage data analytics for business insights

IMPLEMENTATION ROADMAP:
Quarter 1: Assessment and planning phase
Quarter 2: Infrastructure and architecture setup
Quarter 3: Development and testing implementation
Quarter 4: Deployment and optimization

GOVERNANCE & METRICS:
- Monthly technology review meetings
- Quarterly innovation assessments
- Annual strategic planning sessions
- KPI tracking and performance monitoring

SUCCESS CRITERIA:
- Improved system performance and reliability
- Faster time-to-market for new features
- Enhanced team productivity and satisfaction
- Increased innovation and competitive advantage

STATUS: Ready for executive review
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
            <Rocket className="w-8 h-8 text-primary" />
            CTO Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Technology Strategy & Leadership Policy Generation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button>
            <Brain className="w-4 h-4 mr-2" />
            Generate Strategy
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
                <Target className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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
                <BarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold">Strategy Generator</h3>
              <Button size="sm" className="mt-2" variant="outline">
                Create
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold">Tech Consultant</h3>
              <Button size="sm" className="mt-2" variant="outline">
                Ask
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 border-orange-200 dark:border-orange-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold">Manage Portfolio</h3>
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
                  <CardTitle>Technology Strategy Documents</CardTitle>
                  <CardDescription>
                    Generate strategic technology plans and leadership frameworks
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search strategies..."
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
                          <Rocket className="w-5 h-5 text-purple-500" />
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
                            type: 'Technology Strategy Document',
                            description: policy.description,
                            author: 'CTO Dashboard',
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