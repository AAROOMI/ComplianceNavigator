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
  Settings,
  Network,
  DollarSign
} from "lucide-react";

interface ITDocument {
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
}

const MOCK_IT_DOCUMENTS: ITDocument[] = [
  {
    id: '1',
    title: 'Network Architecture Plan',
    category: 'Infrastructure',
    status: 'approved',
    version: '2.0',
    lastModified: new Date('2024-01-20'),
    author: 'John Smith (IT Manager)',
    size: '342 KB',
    tags: ['network', 'architecture', 'design'],
    starred: true,
    description: 'Comprehensive network infrastructure design and planning document'
  },
  {
    id: '2',
    title: 'IT Budget Proposal 2024',
    category: 'Financial',
    status: 'approved',
    version: '1.5',
    lastModified: new Date('2024-01-18'),
    author: 'Sarah Johnson',
    size: '218 KB',
    tags: ['budget', 'financial', 'planning'],
    starred: false,
    description: 'Annual IT budget planning and resource allocation proposal'
  },
  {
    id: '3',
    title: 'System Upgrade Proposal',
    category: 'Operations',
    status: 'review',
    version: '1.2',
    lastModified: new Date('2024-01-15'),
    author: 'Mike Chen',
    size: '156 KB',
    tags: ['upgrade', 'systems', 'planning'],
    starred: false,
    description: 'Comprehensive system upgrade strategy and implementation plan'
  },
  {
    id: '4',
    title: 'IT Service Level Agreement',
    category: 'Service Management',
    status: 'draft',
    version: '0.9',
    lastModified: new Date('2024-01-12'),
    author: 'Lisa Wong',
    size: '198 KB',
    tags: ['sla', 'service', 'agreement'],
    starred: true,
    description: 'Service level agreements for IT operations and support'
  },
  {
    id: '5',
    title: 'IT Strategic Plan 2024-2026',
    category: 'Strategy',
    status: 'approved',
    version: '3.0',
    lastModified: new Date('2024-01-10'),
    author: 'David Brown',
    size: '421 KB',
    tags: ['strategy', 'planning', 'roadmap'],
    starred: false,
    description: 'Three-year IT strategic planning and technology roadmap'
  },
  {
    id: '6',
    title: 'IT Infrastructure Maintenance Plan',
    category: 'Maintenance',
    status: 'approved',
    version: '1.8',
    lastModified: new Date('2024-01-08'),
    author: 'Alex Turner',
    size: '267 KB',
    tags: ['maintenance', 'infrastructure', 'operations'],
    starred: false,
    description: 'Preventive maintenance procedures and schedules for IT infrastructure'
  }
];

export default function ITDocumentLibrary() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [documents, setDocuments] = useState<ITDocument[]>(MOCK_IT_DOCUMENTS);
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const categories = ["All", ...Array.from(new Set(documents.map(d => d.category)))];
  const statuses = ["All", "draft", "review", "approved", "archived"];

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || document.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || document.status === selectedStatus;
    const matchesStarred = !showStarredOnly || document.starred;
    
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

  const toggleStar = (documentId: string) => {
    setDocuments(prev => prev.map(document => 
      document.id === documentId 
        ? { ...document, starred: !document.starred }
        : document
    ));
  };

  const handleDownload = (document: ITDocument) => {
    toast({
      title: "Download Started",
      description: `Downloading ${document.title} v${document.version}`,
    });
  };

  const handleDelete = (documentId: string) => {
    setDocuments(prev => prev.filter(document => document.id !== documentId));
    toast({
      title: "Document Deleted",
      description: "The document has been removed from the library.",
    });
  };

  const uploadDocument = () => {
    toast({
      title: "Upload Document",
      description: "Document upload functionality coming soon.",
    });
  };

  const getStatsData = () => {
    const total = documents.length;
    const approved = documents.filter(d => d.status === 'approved').length;
    const inReview = documents.filter(d => d.status === 'review').length;
    const draft = documents.filter(d => d.status === 'draft').length;
    const starred = documents.filter(d => d.starred).length;
    
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
          <TabsTrigger value="library">Document Library</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Document Library Tab */}
        <TabsContent value="library" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>IT Document Library Management</CardTitle>
                  <CardDescription>Manage, organize, and track your IT documentation</CardDescription>
                </div>
                <Button onClick={uploadDocument} data-testid="button-upload-it-document">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search IT documents, descriptions, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="input-it-document-search"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={showStarredOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowStarredOnly(!showStarredOnly)}
                    data-testid="button-filter-starred-it"
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
                      data-testid={`button-it-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
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
                    data-testid={`button-it-status-${status}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No IT documents found</p>
                    <p className="text-sm">Try adjusting your search criteria or filters</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredDocuments.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{document.title}</h3>
                          <Badge className={`${getStatusColor(document.status)} text-white`}>
                            {document.status}
                          </Badge>
                          <Badge variant="outline">v{document.version}</Badge>
                          {document.starred && (
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{document.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {document.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {document.lastModified.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {document.size}
                          </div>
                        </div>

                        <div className="flex gap-1 flex-wrap">
                          {document.tags.map((tag) => (
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
                          onClick={() => toggleStar(document.id)}
                          data-testid={`button-star-it-${document.id}`}
                        >
                          <Star className={`w-4 h-4 ${document.starred ? 'text-yellow-400 fill-current' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-view-it-${document.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-edit-it-${document.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(document)}
                          data-testid={`button-download-it-${document.id}`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-share-it-${document.id}`}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(document.id)}
                          data-testid={`button-delete-it-${document.id}`}
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
              <CardTitle>IT Document Templates</CardTitle>
              <CardDescription>Pre-built templates for common IT documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>IT document templates coming soon</p>
                <p className="text-sm">Ready-to-use templates for faster documentation</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Document Analytics</CardTitle>
              <CardDescription>Insights and metrics about your IT documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard coming soon</p>
                <p className="text-sm">Track document usage, compliance, and effectiveness</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}