import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, 
  Edit, 
  Download, 
  Trash2,
  Plus,
  Search,
  Filter,
  FileText,
  QrCode,
  Scan,
  Star,
  Calendar,
  User,
  Tag
} from "lucide-react";
import DocumentViewer from "./document-viewer";

interface Document {
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

interface DocumentCRUDManagerProps {
  documents: Document[];
  onDocumentUpdate?: (updatedDocument: Document) => void;
  onDocumentDelete?: (documentId: string) => void;
  onDocumentCreate?: (newDocument: Partial<Document>) => void;
  title?: string;
  description?: string;
}

export default function DocumentCRUDManager({ 
  documents, 
  onDocumentUpdate, 
  onDocumentDelete, 
  onDocumentCreate,
  title = "Document Management",
  description = "Manage, view, edit, and track your documents"
}: DocumentCRUDManagerProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };

  const handleUpdateDocument = (updatedDocument: Document) => {
    if (onDocumentUpdate) {
      onDocumentUpdate(updatedDocument);
    }
    setSelectedDocument(updatedDocument);
    toast({
      title: "Document Updated",
      description: `${updatedDocument.title} has been updated successfully.`,
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    if (onDocumentDelete) {
      onDocumentDelete(documentId);
    }
    setIsViewerOpen(false);
    setSelectedDocument(null);
    toast({
      title: "Document Deleted",
      description: "Document has been permanently deleted.",
    });
  };

  const toggleStar = (documentId: string) => {
    const document = documents.find(d => d.id === documentId);
    if (document && onDocumentUpdate) {
      onDocumentUpdate({
        ...document,
        starred: !document.starred
      });
    }
  };

  const handleQuickDownload = (document: Document) => {
    const blob = new Blob([document.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title.replace(/\s+/g, '-')}-v${document.version}.md`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `${document.title} has been downloaded.`,
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            {onDocumentCreate && (
              <Button data-testid="button-create-document">
                <Plus className="w-4 h-4 mr-2" />
                New Document
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-document-search"
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

          <div className="flex gap-2">
            <span className="text-sm font-medium">Status:</span>
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

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No documents found</p>
                <p className="text-sm">Try adjusting your search criteria or filters</p>
              </div>
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

                        <div className="flex gap-1 flex-wrap mb-3">
                          {document.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* QR Code and Barcode Indicators */}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <QrCode className="w-4 h-4" />
                            QR Code Available
                          </div>
                          <div className="flex items-center gap-1">
                            <Scan className="w-4 h-4" />
                            Barcode: DOC-{document.id}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStar(document.id)}
                          data-testid={`button-star-${document.id}`}
                        >
                          <Star className={`w-4 h-4 ${document.starred ? 'text-yellow-400 fill-current' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleViewDocument(document)}
                          data-testid={`button-view-${document.id}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDocument(document)}
                          data-testid={`button-edit-${document.id}`}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickDownload(document)}
                          data-testid={`button-download-${document.id}`}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        {onDocumentDelete && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this document?')) {
                                onDocumentDelete(document.id);
                              }
                            }}
                            data-testid={`button-delete-${document.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
          <div className="h-[95vh] overflow-auto p-6">
            {selectedDocument && (
              <DocumentViewer
                document={selectedDocument}
                onUpdate={handleUpdateDocument}
                onDelete={handleDeleteDocument}
                onClose={() => setIsViewerOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}