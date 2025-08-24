import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  Eye,
  Trash2,
  Star,
  Share2,
  Monitor,
  Archive
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  dateCreated: Date;
  dateModified: Date;
  size: string;
  status: 'draft' | 'approved' | 'archived';
  author: string;
  version: string;
  description: string;
  isFavorite: boolean;
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: 'System Maintenance Procedures',
    type: 'Maintenance Procedures',
    category: 'Maintenance',
    dateCreated: new Date('2024-01-15'),
    dateModified: new Date('2024-01-20'),
    size: '1.8 MB',
    status: 'approved',
    author: 'System Administrator',
    version: '3.2',
    description: 'Comprehensive system maintenance and operational procedures',
    isFavorite: true
  },
  {
    id: '2',
    name: 'Backup and Recovery Procedures',
    type: 'Backup Procedures',
    category: 'Data Protection',
    dateCreated: new Date('2024-01-10'),
    dateModified: new Date('2024-01-18'),
    size: '2.1 MB',
    status: 'approved',
    author: 'Backup Administrator',
    version: '2.5',
    description: 'Complete backup and disaster recovery procedures and guidelines',
    isFavorite: true
  },
  {
    id: '3',
    name: 'User Account Management Policy',
    type: 'Access Control Policy',
    category: 'Access Control',
    dateCreated: new Date('2024-01-08'),
    dateModified: new Date('2024-01-15'),
    size: '1.2 MB',
    status: 'approved',
    author: 'Security Administrator',
    version: '1.8',
    description: 'Policies and procedures for user account lifecycle management',
    isFavorite: false
  },
  {
    id: '4',
    name: 'System Security Configuration Standards',
    type: 'Security Standards',
    category: 'Security',
    dateCreated: new Date('2024-01-05'),
    dateModified: new Date('2024-01-12'),
    size: '2.8 MB',
    status: 'draft',
    author: 'Security Team',
    version: '0.9',
    description: 'Security hardening and configuration standards for all systems',
    isFavorite: false
  },
  {
    id: '5',
    name: 'Network Administration Procedures',
    type: 'Network Procedures',
    category: 'Network',
    dateCreated: new Date('2024-01-03'),
    dateModified: new Date('2024-01-10'),
    size: '1.9 MB',
    status: 'approved',
    author: 'Network Administrator',
    version: '2.1',
    description: 'Network configuration, monitoring, and troubleshooting procedures',
    isFavorite: false
  },
  {
    id: '6',
    name: 'System Monitoring Guidelines',
    type: 'Monitoring Guidelines',
    category: 'Monitoring',
    dateCreated: new Date('2023-12-20'),
    dateModified: new Date('2024-01-05'),
    size: '1.5 MB',
    status: 'archived',
    author: 'Operations Team',
    version: '1.5',
    description: 'System monitoring setup, alerting, and response procedures',
    isFavorite: false
  },
  {
    id: '7',
    name: 'Database Administration Procedures',
    type: 'Database Procedures',
    category: 'Database',
    dateCreated: new Date('2024-01-01'),
    dateModified: new Date('2024-01-08'),
    size: '2.3 MB',
    status: 'approved',
    author: 'Database Administrator',
    version: '1.7',
    description: 'Database maintenance, backup, and performance optimization procedures',
    isFavorite: true
  },
  {
    id: '8',
    name: 'Incident Response Procedures',
    type: 'Incident Procedures',
    category: 'Incident Management',
    dateCreated: new Date('2023-12-28'),
    dateModified: new Date('2024-01-06'),
    size: '1.6 MB',
    status: 'approved',
    author: 'IT Operations',
    version: '2.2',
    description: 'System incident response and escalation procedures',
    isFavorite: false
  }
];

const DOCUMENT_CATEGORIES = ['All', 'Maintenance', 'Security', 'Network', 'Database', 'Monitoring', 'Data Protection', 'Access Control', 'Incident Management'];
const DOCUMENT_STATUSES = ['All', 'draft', 'approved', 'archived'];

export default function SysAdminDocumentLibrary() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || doc.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleFavorite = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, isFavorite: !doc.isFavorite } : doc
    ));
    
    const doc = documents.find(d => d.id === docId);
    toast({
      title: doc?.isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: `${doc?.name} has been ${doc?.isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  const handleDownload = (doc: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}...`,
    });
  };

  const handleDelete = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(prev => prev.filter(d => d.id !== docId));
    toast({
      title: "Document Deleted",
      description: `${doc?.name} has been moved to trash.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✓';
      case 'draft': return '✏️';
      case 'archived': return '📦';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Archive className="w-6 h-6 text-primary" />
            System Administration Document Library
          </h2>
          <p className="text-muted-foreground">
            Manage and access your system administration procedures and documentation
          </p>
        </div>
        <Button data-testid="button-new-sysadmin-document">
          <FileText className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Documents</CardTitle>
          <CardDescription>Search and filter your system administration document collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Documents</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-sysadmin-documents"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-sysadmin-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger data-testid="select-sysadmin-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Monitor className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{doc.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{doc.description}</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(doc.id)}
                  data-testid={`button-favorite-${doc.id}`}
                >
                  <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="outline">{doc.type}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getStatusColor(doc.status)}>
                    {getStatusIcon(doc.status)} {doc.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Version:</span>
                  <span>{doc.version}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size:</span>
                  <span>{doc.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Modified:</span>
                  <span>{doc.dateModified.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Author:</span>
                  <span className="truncate">{doc.author}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDownload(doc)}>
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDownload(doc)}>
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(doc.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No documents found matching your criteria</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Document Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{documents.length}</p>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{documents.filter(d => d.status === 'approved').length}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{documents.filter(d => d.status === 'draft').length}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{documents.filter(d => d.isFavorite).length}</p>
              <p className="text-sm text-muted-foreground">Favorites</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}