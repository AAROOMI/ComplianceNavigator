import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Shield, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  Database,
  AlertTriangle,
  Eye,
  Copy
} from "lucide-react";

interface RiskRegisterEntry {
  id: number;
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  riskLevel: string;
  impact: string;
  likelihood: string;
  threats: string[];
  vulnerabilities: string[];
  assets: string[];
  controls: string[];
  mitigationStrategies: string[];
  complianceFrameworks: string[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  riskLevel: z.string().min(1, "Risk level is required"),
  impact: z.string().min(5, "Impact description is required"),
  likelihood: z.string().min(1, "Likelihood is required"),
  threats: z.array(z.string()).default([]),
  vulnerabilities: z.array(z.string()).default([]),
  assets: z.array(z.string()).default([]),
  controls: z.array(z.string()).default([]),
  mitigationStrategies: z.array(z.string()).default([]),
  complianceFrameworks: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

const riskLevels = ["Critical", "High", "Medium", "Low"];
const likelihoods = ["Very High", "High", "Medium", "Low", "Very Low"];
const categories = [
  "Data Security",
  "Network Security", 
  "Access Control",
  "Physical Security",
  "Operational Security",
  "Compliance & Governance",
  "Business Continuity",
  "Third Party Risk",
  "Cloud Security",
  "Mobile Security"
];

export default function RiskRegister() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<RiskRegisterEntry | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch risk register entries
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/risk-register", selectedCategory, selectedRiskLevel],
    queryFn: () => {
      let url = "/api/risk-register";
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedRiskLevel) params.append("riskLevel", selectedRiskLevel);
      if (params.toString()) url += "?" + params.toString();
      return apiRequest<RiskRegisterEntry[]>("GET", url);
    },
  });

  // Create entry mutation
  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      apiRequest<RiskRegisterEntry>("POST", "/api/risk-register", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/risk-register"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Risk register entry created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create risk register entry.",
        variant: "destructive",
      });
      console.error("Error creating entry:", error);
    },
  });

  // Delete entry mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/risk-register/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/risk-register"] });
      toast({
        title: "Success",
        description: "Risk register entry deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete risk register entry.",
        variant: "destructive",
      });
      console.error("Error deleting entry:", error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      subcategory: "",
      title: "",
      description: "",
      riskLevel: "",
      impact: "",
      likelihood: "",
      threats: [],
      vulnerabilities: [],
      assets: [],
      controls: [],
      mitigationStrategies: [],
      complianceFrameworks: [],
      tags: [],
      isActive: true,
    },
  });

  // Filter entries based on search term
  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEntry = (data: z.infer<typeof formSchema>) => {
    createMutation.mutate(data);
  };

  const handleDeleteEntry = (id: number) => {
    if (confirm("Are you sure you want to delete this risk register entry?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewDetails = (entry: RiskRegisterEntry) => {
    setSelectedEntry(entry);
    setIsDetailDialogOpen(true);
  };

  const handleCopyToRiskPlan = (entry: RiskRegisterEntry) => {
    // This will be implemented when integrating with risk management plans
    toast({
      title: "Feature Coming Soon",
      description: "Copy to risk management plan functionality will be available soon.",
    });
  };

  // Get risk level badge
  function getRiskLevelBadge(level: string) {
    switch (level) {
      case 'Critical':
        return <Badge variant="destructive" className="bg-red-600">{level}</Badge>;
      case 'High':
        return <Badge variant="destructive">{level}</Badge>;
      case 'Medium':
        return <Badge variant="secondary" className="bg-amber-500 hover:bg-amber-600">{level}</Badge>;
      case 'Low':
        return <Badge variant="outline" className="border-green-500 text-green-500">{level}</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Risk Register
          </CardTitle>
          <CardDescription>Loading built-in cybersecurity risk library...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="risk-register">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Risk Register
          </CardTitle>
          <CardDescription>
            Built-in cybersecurity risk library with pre-defined threats, vulnerabilities, and mitigation strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search risks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-risk-input"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]" data-testid="filter-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                <SelectTrigger className="w-[140px]" data-testid="filter-risk-level">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  {riskLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Create Button */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-risk">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Risk
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Risk Register Entry</DialogTitle>
                  <DialogDescription>
                    Add a new risk to the built-in risk register library
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateEntry)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="riskLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Risk Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-risk-level">
                                  <SelectValue placeholder="Select risk level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {riskLevels.map((level) => (
                                  <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Risk title" {...field} data-testid="input-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Detailed risk description..." 
                              {...field} 
                              data-testid="textarea-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="impact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Impact</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe potential business impact..." 
                                {...field} 
                                data-testid="textarea-impact"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="likelihood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Likelihood</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-likelihood">
                                  <SelectValue placeholder="Select likelihood" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {likelihoods.map((likelihood) => (
                                  <SelectItem key={likelihood} value={likelihood}>{likelihood}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(false)}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createMutation.isPending}
                        data-testid="button-submit"
                      >
                        {createMutation.isPending ? "Creating..." : "Create Risk"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Risk Entries */}
      <div className="grid gap-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No risks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory || selectedRiskLevel
                  ? "Try adjusting your search criteria or filters."
                  : "Start by adding your first risk to the register."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{entry.title}</h3>
                      {getRiskLevelBadge(entry.riskLevel)}
                      <Badge variant="outline">{entry.category}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {entry.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {entry.tags?.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags?.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{entry.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(entry)}
                      data-testid={`button-view-${entry.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToRiskPlan(entry)}
                      data-testid={`button-copy-${entry.id}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                      data-testid={`button-delete-${entry.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEntry?.title}
              {selectedEntry && getRiskLevelBadge(selectedEntry.riskLevel)}
            </DialogTitle>
            <DialogDescription>
              {selectedEntry?.category} - Risk Register Entry Details
            </DialogDescription>
          </DialogHeader>
          
          {selectedEntry && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="threats">Threats</TabsTrigger>
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedEntry.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Business Impact</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedEntry.impact}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Likelihood</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedEntry.likelihood}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedEntry.category}
                      {selectedEntry.subcategory && ` > ${selectedEntry.subcategory}`}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="threats" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Threats</Label>
                    <div className="mt-2 space-y-1">
                      {selectedEntry.threats?.map((threat, index) => (
                        <Badge key={index} variant="destructive" className="mr-2 mb-1">
                          {threat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Vulnerabilities</Label>
                    <div className="mt-2 space-y-1">
                      {selectedEntry.vulnerabilities?.map((vuln, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-1">
                          {vuln}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Affected Assets</Label>
                  <div className="mt-2 space-y-1">
                    {selectedEntry.assets?.map((asset, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-1">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="controls" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Recommended Controls</Label>
                  <div className="mt-2 space-y-1">
                    {selectedEntry.controls?.map((control, index) => (
                      <Badge key={index} variant="default" className="mr-2 mb-1">
                        {control}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Mitigation Strategies</Label>
                  <div className="mt-2 space-y-1">
                    {selectedEntry.mitigationStrategies?.map((strategy, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-1">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="compliance" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Compliance Frameworks</Label>
                  <div className="mt-2 space-y-1">
                    {selectedEntry.complianceFrameworks?.map((framework, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-1 border-blue-500 text-blue-500">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="mt-2 space-y-1">
                    {selectedEntry.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}