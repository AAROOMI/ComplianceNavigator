import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, 
  FileText, 
  Video, 
  Download, 
  Search, 
  Filter,
  Play,
  Clock,
  Star,
  Eye,
  Shield,
  AlertTriangle,
  Lock,
  Users,
  Target
} from "lucide-react";

interface TrainingMaterial {
  id: number;
  title: string;
  description: string;
  type: "document" | "video" | "interactive" | "presentation";
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  rating: number;
  downloads: number;
  author: string;
  lastUpdated: Date;
  tags: string[];
  fileSize?: string;
  language: string;
}

export default function TrainingMaterials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const trainingMaterials: TrainingMaterial[] = [
    {
      id: 1,
      title: "NCA ECC Controls Implementation Guide",
      description: "Comprehensive guide to implementing National Cybersecurity Authority Essential Cybersecurity Controls in your organization",
      type: "document",
      category: "NCA ECC",
      difficulty: "intermediate",
      duration: 45,
      rating: 4.8,
      downloads: 1250,
      author: "Dr. Sarah Al-Mansouri",
      lastUpdated: new Date("2024-01-15"),
      tags: ["governance", "controls", "implementation", "compliance"],
      fileSize: "2.5 MB",
      language: "English"
    },
    {
      id: 2,
      title: "Phishing Attack Recognition Training",
      description: "Interactive video course on identifying and responding to phishing attempts across various communication channels",
      type: "video",
      category: "Threat Awareness",
      difficulty: "beginner",
      duration: 30,
      rating: 4.9,
      downloads: 2100,
      author: "Ahmed Khalid",
      lastUpdated: new Date("2024-02-10"),
      tags: ["phishing", "email security", "social engineering", "recognition"],
      fileSize: "850 MB",
      language: "English"
    },
    {
      id: 3,
      title: "Social Engineering Defense Strategies",
      description: "Advanced techniques and psychological insights for defending against social engineering attacks",
      type: "presentation",
      category: "Social Engineering",
      difficulty: "advanced",
      duration: 60,
      rating: 4.7,
      downloads: 890,
      author: "Prof. Fatima Hassan",
      lastUpdated: new Date("2024-01-28"),
      tags: ["social engineering", "psychology", "defense", "awareness"],
      fileSize: "45 MB",
      language: "English"
    },
    {
      id: 4,
      title: "Data Classification Hands-On Workshop",
      description: "Interactive workshop materials for learning proper data classification and handling procedures",
      type: "interactive",
      category: "Data Protection",
      difficulty: "intermediate",
      duration: 90,
      rating: 4.6,
      downloads: 750,
      author: "Omar Al-Zahra",
      lastUpdated: new Date("2024-02-05"),
      tags: ["data classification", "handling", "workshop", "hands-on"],
      fileSize: "120 MB",
      language: "English"
    },
    {
      id: 5,
      title: "Incident Response Playbook",
      description: "Step-by-step procedures and checklists for effective cybersecurity incident response",
      type: "document",
      category: "Incident Response",
      difficulty: "intermediate",
      duration: 40,
      rating: 4.9,
      downloads: 1680,
      author: "Khalid Al-Rashid",
      lastUpdated: new Date("2024-02-12"),
      tags: ["incident response", "playbook", "procedures", "checklist"],
      fileSize: "1.8 MB",
      language: "English"
    },
    {
      id: 6,
      title: "Advanced Persistent Threats (APT) Analysis",
      description: "Deep dive into APT tactics, techniques, and procedures with real-world case studies",
      type: "video",
      category: "Advanced Threats",
      difficulty: "advanced",
      duration: 120,
      rating: 4.8,
      downloads: 420,
      author: "Dr. Nadia Qasimi",
      lastUpdated: new Date("2024-01-20"),
      tags: ["APT", "analysis", "case studies", "advanced"],
      fileSize: "1.2 GB",
      language: "English"
    },
    {
      id: 7,
      title: "Cybersecurity Awareness for Non-Technical Staff",
      description: "Easy-to-understand cybersecurity concepts and practices for employees without technical background",
      type: "presentation",
      category: "General Awareness",
      difficulty: "beginner",
      duration: 25,
      rating: 4.5,
      downloads: 3200,
      author: "Layla Mahmood",
      lastUpdated: new Date("2024-02-08"),
      tags: ["awareness", "non-technical", "basics", "employees"],
      fileSize: "25 MB",
      language: "English"
    },
    {
      id: 8,
      title: "Password Security Best Practices",
      description: "Comprehensive guide to creating, managing, and protecting passwords effectively",
      type: "interactive",
      category: "Access Control",
      difficulty: "beginner",
      duration: 20,
      rating: 4.4,
      downloads: 2850,
      author: "Hassan Al-Mutairi",
      lastUpdated: new Date("2024-02-01"),
      tags: ["passwords", "authentication", "security", "best practices"],
      fileSize: "75 MB",
      language: "English"
    }
  ];

  const categories = ["all", "NCA ECC", "Threat Awareness", "Social Engineering", "Data Protection", "Incident Response", "Advanced Threats", "General Awareness", "Access Control"];
  const types = ["all", "document", "video", "interactive", "presentation"];

  const filteredMaterials = trainingMaterials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    const matchesType = selectedType === "all" || material.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document": return FileText;
      case "video": return Video;
      case "interactive": return Target;
      case "presentation": return Play;
      default: return Book;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "NCA ECC": return Shield;
      case "Threat Awareness": case "Social Engineering": return AlertTriangle;
      case "Data Protection": case "Access Control": return Lock;
      case "Advanced Threats": return Target;
      default: return Book;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Training Materials Library
        </h1>
        <p className="text-muted-foreground">
          Access comprehensive cybersecurity training resources and educational materials
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredMaterials.length} of {trainingMaterials.length} materials
        </p>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Sort by: Most Downloaded</span>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const TypeIcon = getTypeIcon(material.type);
          const CategoryIcon = getCategoryIcon(material.category);
          
          return (
            <Card key={material.id} className="glass-card border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="w-5 h-5 text-primary" />
                    <Badge variant="outline" className="text-xs">
                      {material.category}
                    </Badge>
                  </div>
                  <TypeIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg leading-tight">{material.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-3">
                  {material.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getDifficultyColor(material.difficulty)}>
                    {material.difficulty.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{material.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{material.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>{material.downloads}</span>
                  </div>
                </div>

                <div className="text-sm">
                  <p><strong>Author:</strong> {material.author}</p>
                  <p><strong>Updated:</strong> {material.lastUpdated.toLocaleDateString()}</p>
                  <p><strong>Size:</strong> {material.fileSize}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {material.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {material.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{material.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <Card className="glass-card border-0">
          <CardContent className="p-12 text-center">
            <Book className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No materials found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find relevant training materials.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Popular Downloads Section */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Most Popular Downloads
          </CardTitle>
          <CardDescription>
            Top training materials downloaded by the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trainingMaterials
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 5)
              .map((material, index) => (
                <div key={material.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{material.title}</p>
                    <p className="text-sm text-muted-foreground">{material.downloads} downloads</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {material.category}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}