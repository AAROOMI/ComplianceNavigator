import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Plus, FileText, BarChart3, Shield, TrendingUp, Activity, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RiskAssessmentForm from "@/components/risk/risk-assessment-form";
import InteractiveRiskHeatMap from "@/components/risk/interactive-heat-map";
import ExcelRiskImporter from "@/components/assessment/excel-risk-importer";
import type { RiskRegister } from "@shared/schema";

export default function RiskAssessment() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const { data: riskData = [], isLoading: riskLoading } = useQuery<RiskRegister[]>({
    queryKey: ['/api/risk-register'],
  });

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getRiskStats = () => {
    const stats = {
      total: riskData.length,
      critical: riskData.filter(r => r.riskLevel.toLowerCase() === 'critical').length,
      high: riskData.filter(r => r.riskLevel.toLowerCase() === 'high').length,
      medium: riskData.filter(r => r.riskLevel.toLowerCase() === 'medium').length,
      low: riskData.filter(r => r.riskLevel.toLowerCase() === 'low').length,
    };
    return stats;
  };

  const handleAssessmentSuccess = (newRisk: any) => {
    setIsAssessmentDialogOpen(false);
    toast({
      title: "Risk Assessment Complete",
      description: `Successfully added "${newRisk.title}" to the risk register.`,
    });
  };

  const riskStats = getRiskStats();

  if (riskLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Professional Risk Assessment Platform
          </h1>
          <p className="text-muted-foreground">
            Loading risk data...
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional Risk Assessment Platform
            </h1>
            <p className="text-muted-foreground">
              Comprehensive risk identification, analysis, and management following industry best practices
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isAssessmentDialogOpen} onOpenChange={setIsAssessmentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" data-testid="button-new-risk-assessment">
                  <Plus className="w-4 h-4" />
                  New Risk Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
                <div className="max-h-[95vh] overflow-y-auto">
                  <RiskAssessmentForm 
                    onSuccess={handleAssessmentSuccess}
                    onCancel={() => setIsAssessmentDialogOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2" data-testid="button-import-risks-excel">
                  <FileSpreadsheet className="w-4 h-4" />
                  Import from Excel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Import Risk Data from Excel</DialogTitle>
                </DialogHeader>
                <div className="max-h-[80vh] overflow-y-auto">
                  <ExcelRiskImporter 
                    userId={1} // This should come from auth context
                    onImportComplete={(count) => {
                      toast({
                        title: "Risks Imported",
                        description: `Successfully imported ${count} risk entries.`,
                      });
                      setIsImportDialogOpen(false);
                    }}
                    onClose={() => setIsImportDialogOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Risk Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Risks</p>
                <p className="text-2xl font-bold">{riskStats.total}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{riskStats.critical}</p>
              </div>
              <div className="w-3 h-8 bg-red-500 rounded" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High</p>
                <p className="text-2xl font-bold text-orange-600">{riskStats.high}</p>
              </div>
              <div className="w-3 h-8 bg-orange-500 rounded" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medium</p>
                <p className="text-2xl font-bold text-yellow-600">{riskStats.medium}</p>
              </div>
              <div className="w-3 h-8 bg-yellow-500 rounded" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low</p>
                <p className="text-2xl font-bold text-green-600">{riskStats.low}</p>
              </div>
              <div className="w-3 h-8 bg-green-500 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Risk Heat Map
          </TabsTrigger>
          <TabsTrigger value="register" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Risk Register
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recent High-Risk Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskData.filter(r => ['critical', 'high'].includes(r.riskLevel.toLowerCase())).slice(0, 5).map((risk) => (
                    <div key={risk.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getRiskLevelColor(risk.riskLevel)}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{risk.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{risk.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{risk.category}</Badge>
                          <Badge className={`text-xs ${getRiskLevelColor(risk.riskLevel)} text-white`}>
                            {risk.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {riskData.filter(r => ['critical', 'high'].includes(r.riskLevel.toLowerCase())).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No high-risk items found</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Categories Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(riskData.map(r => r.category))).slice(0, 8).map((category) => {
                    const categoryCount = riskData.filter(r => r.category === category).length;
                    const percentage = ((categoryCount / riskData.length) * 100).toFixed(1);
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
                            {categoryCount} ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap">
          <InteractiveRiskHeatMap />
        </TabsContent>

        <TabsContent value="register" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Register</CardTitle>
              <CardDescription>
                Comprehensive list of all identified risks with detailed information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskData.map((risk) => (
                  <Card key={risk.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{risk.title}</h4>
                            <Badge className={`${getRiskLevelColor(risk.riskLevel)} text-white`}>
                              {risk.riskLevel.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div>
                              <p className="font-medium text-muted-foreground">Category</p>
                              <p>{risk.category}</p>
                              {risk.subcategory && <p className="text-muted-foreground">{risk.subcategory}</p>}
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Impact / Likelihood</p>
                              <p>{risk.impact} / {risk.likelihood}</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Assets Affected</p>
                              <p>{risk.assets?.slice(0, 2).join(", ")}</p>
                              {(risk.assets?.length ?? 0) > 2 && (
                                <p className="text-muted-foreground">+{(risk.assets?.length ?? 0) - 2} more</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {riskData.length === 0 && (
                  <div className="text-center py-12">
                    <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No risks identified yet</h3>
                    <p className="text-muted-foreground mb-4">Start by creating your first risk assessment</p>
                    <Button onClick={() => setIsAssessmentDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Risk Assessment
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Risk trend analysis will be available once more historical data is collected.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Compliance Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(riskData.flatMap(r => r.complianceFrameworks || []))).slice(0, 6).map((framework) => {
                    const frameworkCount = riskData.filter(r => r.complianceFrameworks?.includes(framework)).length;
                    
                    return (
                      <div key={framework} className="flex items-center justify-between">
                        <span className="text-sm">{framework}</span>
                        <Badge variant="outline">{frameworkCount} risks</Badge>
                      </div>
                    );
                  })}
                  
                  {riskData.flatMap(r => r.complianceFrameworks || []).length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No compliance framework data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}