import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, FileText, Calendar, AlertTriangle } from 'lucide-react';

interface RiskManagementPlan {
  id: number;
  userId: number;
  vulnerabilityId?: number;
  title: string;
  description: string;
  riskLevel: string;
  mitigationStrategy: string;
  responsibleParty: string;
  targetDate: string;
  budget?: string;
  status: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

interface RiskManagementTableProps {
  userId: number;
  vulnerabilityId?: number;
  showActions?: boolean;
}

export default function RiskManagementTable({ 
  userId, 
  vulnerabilityId,
  showActions = true 
}: RiskManagementTableProps) {
  const { toast } = useToast();
  const [plans, setPlans] = useState<RiskManagementPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<RiskManagementPlan | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, [userId, vulnerabilityId]);

  // Fetch risk management plans
  async function fetchPlans() {
    setIsLoading(true);
    try {
      let url = `/api/risk-management-plans/${userId}`;
      if (vulnerabilityId) {
        url += `?vulnerabilityId=${vulnerabilityId}`;
      }
      
      const response = await apiRequest<RiskManagementPlan[]>('GET', url);
      setPlans(response || []);
    } catch (error) {
      console.error("Error fetching risk management plans:", error);
      toast({
        title: "Error",
        description: "Failed to load risk management plans.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle plan deletion
  async function handleDeletePlan() {
    if (!selectedPlan) return;
    
    try {
      await apiRequest('DELETE', `/api/risk-management-plans/${selectedPlan.id}`);
      
      toast({
        title: "Plan Deleted",
        description: "Risk management plan has been successfully deleted.",
      });
      
      // Refresh the plans list
      queryClient.invalidateQueries({ queryKey: ['/api/risk-management-plans', userId] });
      fetchPlans();
    } catch (error) {
      console.error("Error deleting risk management plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete the risk management plan.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedPlan(null);
    }
  }

  // Generate a report of the risk management plan
  function generatePlanReport() {
    if (!selectedPlan) return;
    
    const reportContent = `
      # Risk Management Plan Report
      
      ## General Information
      - Title: ${selectedPlan.title}
      - Risk Level: ${selectedPlan.riskLevel}
      - Status: ${selectedPlan.status}
      - Progress: ${selectedPlan.progress}%
      - Created: ${new Date(selectedPlan.createdAt).toLocaleDateString()}
      - Last Updated: ${new Date(selectedPlan.updatedAt).toLocaleDateString()}
      
      ## Risk Details
      ${selectedPlan.description}
      
      ## Mitigation Strategy
      ${selectedPlan.mitigationStrategy}
      
      ## Implementation Details
      - Responsible Party: ${selectedPlan.responsibleParty}
      - Target Completion Date: ${new Date(selectedPlan.targetDate).toLocaleDateString()}
      ${selectedPlan.budget ? `- Allocated Budget: ${selectedPlan.budget}` : ''}
    `;
    
    // Create a blob and download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `risk-plan-${selectedPlan.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Render badges for different statuses
  function getStatusBadge(status: string) {
    switch (status) {
      case 'Planned':
        return <Badge variant="outline">{status}</Badge>;
      case 'In Progress':
        return <Badge variant="secondary">{status}</Badge>;
      case 'Completed':
        return <Badge variant="default" className="bg-green-600">{status}</Badge>;
      case 'Delayed':
        return <Badge variant="destructive">{status}</Badge>;
      case 'Cancelled':
        return <Badge variant="outline" className="border-red-500 text-red-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  // Render badges for risk levels
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

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Management Plans</CardTitle>
          <CardDescription>Loading risk management plans...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-700 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Risk Management Plans</CardTitle>
          <CardDescription>
            Manage and track your organization's security risk mitigation strategies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-lg font-semibold">No Risk Management Plans</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                No risk management plans have been created yet. Create a plan to track and mitigate identified security risks.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Responsible</TableHead>
                    <TableHead>Target Date</TableHead>
                    {showActions && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.title}</TableCell>
                      <TableCell>{getRiskLevelBadge(plan.riskLevel)}</TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell>
                        <div className="w-[100px] flex items-center gap-2">
                          <Progress value={plan.progress} className="h-2" />
                          <span className="text-xs">{plan.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{plan.responsibleParty}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(plan.targetDate)}
                      </TableCell>
                      {showActions && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedPlan(plan);
                                generatePlanReport();
                              }}
                              title="Generate Report"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-amber-500 hover:text-amber-600"
                              title="Edit Plan"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => {
                                setSelectedPlan(plan);
                                setShowDeleteDialog(true);
                              }}
                              title="Delete Plan"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the risk management plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}