import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Info,
  FileText,
  Trash2
} from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface RiskData {
  id?: number;
  title: string;
  description: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  subcategory?: string;
  mitigationStrategy: string;
  responsibleParty: string;
  targetDate: string;
  budget?: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'On Hold';
  progress: number;
  impact?: string;
  likelihood?: string;
  currentControls?: string;
  residualRisk?: string;
}

interface ExcelRiskImporterProps {
  userId: number;
  onImportComplete?: (importedCount: number) => void;
  onClose?: () => void;
}

export default function ExcelRiskImporter({ userId, onImportComplete, onClose }: ExcelRiskImporterProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<RiskData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'completed'>('upload');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processExcelFile(file);
    }
  };

  const processExcelFile = async (file: File) => {
    setIsProcessing(true);
    setValidationErrors([]);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        throw new Error('Excel file must contain at least a header row and one data row');
      }
      
      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1) as any[][];
      
      // Map Excel columns to risk data structure
      const risks: RiskData[] = [];
      const errors: string[] = [];
      
      rows.forEach((row, index) => {
        if (row.some(cell => cell !== undefined && cell !== '')) {
          try {
            const risk = mapExcelRowToRisk(headers, row, index + 2);
            const validation = validateRiskData(risk);
            
            if (validation.isValid) {
              risks.push(risk);
            } else {
              errors.push(`Row ${index + 2}: ${validation.errors.join(', ')}`);
            }
          } catch (error) {
            errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      });
      
      setPreviewData(risks);
      setValidationErrors(errors);
      setStep('preview');
      
      toast({
        title: "File Processed",
        description: `Found ${risks.length} valid risks. ${errors.length > 0 ? `${errors.length} errors detected.` : ''}`,
      });
      
    } catch (error) {
      toast({
        title: "File Processing Error",
        description: error instanceof Error ? error.message : 'Failed to process Excel file',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const mapExcelRowToRisk = (headers: string[], row: any[], rowNumber: number): RiskData => {
    const getColumnValue = (columnNames: string[], defaultValue: any = '') => {
      for (const name of columnNames) {
        const index = headers.findIndex(h => 
          h && h.toLowerCase().includes(name.toLowerCase())
        );
        if (index !== -1 && row[index] !== undefined && row[index] !== '') {
          return row[index];
        }
      }
      return defaultValue;
    };

    // Handle date conversion
    const parseDate = (dateValue: any): string => {
      if (!dateValue) return new Date().toISOString().split('T')[0];
      
      if (typeof dateValue === 'number') {
        // Excel date serial number
        const date = new Date((dateValue - 25569) * 86400 * 1000);
        return date.toISOString().split('T')[0];
      }
      
      if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      }
      
      return new Date().toISOString().split('T')[0];
    };

    // Normalize risk level
    const normalizeRiskLevel = (level: string): 'Critical' | 'High' | 'Medium' | 'Low' => {
      const normalized = level?.toString().toLowerCase() || 'medium';
      if (normalized.includes('critical') || normalized.includes('4')) return 'Critical';
      if (normalized.includes('high') || normalized.includes('3')) return 'High';
      if (normalized.includes('low') || normalized.includes('1')) return 'Low';
      return 'Medium';
    };

    // Normalize status
    const normalizeStatus = (status: string): 'Planned' | 'In Progress' | 'Completed' | 'On Hold' => {
      const normalized = status?.toString().toLowerCase() || 'planned';
      if (normalized.includes('progress') || normalized.includes('active')) return 'In Progress';
      if (normalized.includes('complete') || normalized.includes('done')) return 'Completed';
      if (normalized.includes('hold') || normalized.includes('pause')) return 'On Hold';
      return 'Planned';
    };

    return {
      title: getColumnValue(['title', 'risk title', 'name', 'risk name']) || `Risk ${rowNumber}`,
      description: getColumnValue(['description', 'risk description', 'details']) || 'Imported from Excel',
      riskLevel: normalizeRiskLevel(getColumnValue(['risk level', 'level', 'severity', 'priority'])),
      category: getColumnValue(['category', 'risk category', 'domain', 'area']) || 'General',
      subcategory: getColumnValue(['subcategory', 'subdomain', 'subarea']),
      mitigationStrategy: getColumnValue(['mitigation', 'mitigation strategy', 'controls', 'treatment']) || 'To be defined',
      responsibleParty: getColumnValue(['responsible', 'owner', 'assignee', 'responsible party']) || 'To be assigned',
      targetDate: parseDate(getColumnValue(['target date', 'due date', 'deadline', 'completion date'])),
      budget: getColumnValue(['budget', 'cost', 'investment']),
      status: normalizeStatus(getColumnValue(['status', 'state', 'progress status'])),
      progress: Math.max(0, Math.min(100, parseInt(getColumnValue(['progress', 'completion', 'percent'], 0)))),
      impact: getColumnValue(['impact', 'business impact', 'consequence']),
      likelihood: getColumnValue(['likelihood', 'probability', 'chance']),
      currentControls: getColumnValue(['current controls', 'existing controls', 'controls in place']),
      residualRisk: getColumnValue(['residual risk', 'remaining risk', 'final risk']),
    };
  };

  const validateRiskData = (risk: RiskData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!risk.title || risk.title.length < 3) {
      errors.push('Title must be at least 3 characters');
    }
    
    if (!risk.description || risk.description.length < 10) {
      errors.push('Description must be at least 10 characters');
    }
    
    if (!risk.mitigationStrategy || risk.mitigationStrategy.length < 10) {
      errors.push('Mitigation strategy must be at least 10 characters');
    }
    
    if (!risk.responsibleParty || risk.responsibleParty.length < 3) {
      errors.push('Responsible party is required');
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleImport = async () => {
    setStep('importing');
    setImportProgress(0);
    
    try {
      let importedCount = 0;
      const total = previewData.length;
      
      for (let i = 0; i < previewData.length; i++) {
        const risk = previewData[i];
        
        try {
          const response = await fetch('/api/risk-management-plans', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              title: risk.title,
              description: risk.description,
              riskLevel: risk.riskLevel,
              mitigationStrategy: risk.mitigationStrategy,
              responsibleParty: risk.responsibleParty,
              targetDate: risk.targetDate,
              budget: risk.budget || '',
              status: risk.status,
              progress: risk.progress,
            }),
          });
          
          if (response.ok) {
            importedCount++;
          }
        } catch (error) {
          console.error(`Failed to import risk: ${risk.title}`, error);
        }
        
        setImportProgress(Math.round(((i + 1) / total) * 100));
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setStep('completed');
      
      toast({
        title: "Import Completed",
        description: `Successfully imported ${importedCount} out of ${total} risks.`,
      });
      
      if (onImportComplete) {
        onImportComplete(importedCount);
      }
      
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "An error occurred during the import process.",
        variant: "destructive",
      });
      setStep('preview');
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      [
        'Title',
        'Description', 
        'Risk Level',
        'Category',
        'Subcategory',
        'Mitigation Strategy',
        'Responsible Party',
        'Target Date',
        'Budget',
        'Status',
        'Progress',
        'Impact',
        'Likelihood',
        'Current Controls',
        'Residual Risk'
      ],
      [
        'Data Breach Risk',
        'Risk of unauthorized access to customer personal data through weak access controls',
        'High',
        'Data Protection',
        'Access Control',
        'Implement multi-factor authentication and regular access reviews',
        'IT Security Manager',
        '2024-06-30',
        '$15,000',
        'Planned',
        '0',
        'High financial and reputational damage',
        'Medium',
        'Basic password protection',
        'Low'
      ],
      [
        'System Outage Risk',
        'Risk of critical business systems becoming unavailable during peak hours',
        'Critical',
        'Business Continuity',
        'Infrastructure',
        'Deploy redundant systems and implement automated failover',
        'Infrastructure Manager',
        '2024-05-15',
        '$50,000',
        'In Progress',
        '25',
        'Business operations disruption',
        'Low',
        'Single system deployment',
        'Medium'
      ]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Risk Template');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'risk_import_template.xlsx');
    
    toast({
      title: "Template Downloaded",
      description: "Excel template has been downloaded. Use this format for importing risks.",
    });
  };

  const resetImporter = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setValidationErrors([]);
    setImportProgress(0);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Excel Risk Importer
            </CardTitle>
            <CardDescription>
              Import risk data from Excel files to automatically populate your risk management plans
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="excel-file">Select Excel File</Label>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </div>
            
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                Upload an Excel file (.xlsx) containing risk data. Use the template to ensure proper formatting.
                Required columns: Title, Description, Risk Level, Mitigation Strategy, Responsible Party.
              </AlertDescription>
            </Alert>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Click to upload Excel file</p>
              <p className="text-sm text-gray-500">or drag and drop</p>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            {isProcessing && (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Processing Excel file...</span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview Import Data</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetImporter}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button 
                  onClick={handleImport} 
                  disabled={previewData.length === 0}
                  data-testid="button-import-risks"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import {previewData.length} Risks
                </Button>
              </div>
            </div>
            
            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Validation Errors:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    {validationErrors.slice(0, 5).map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                    {validationErrors.length > 5 && (
                      <li className="text-sm">... and {validationErrors.length - 5} more errors</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Risk Level</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Responsible Party</th>
                    <th className="px-4 py-2 text-left">Target Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((risk, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 font-medium">{risk.title}</td>
                      <td className="px-4 py-2">
                        <Badge 
                          variant={risk.riskLevel === 'Critical' ? 'destructive' : 'secondary'}
                          className={
                            risk.riskLevel === 'High' ? 'bg-orange-500 text-white' :
                            risk.riskLevel === 'Medium' ? 'bg-yellow-500 text-white' :
                            risk.riskLevel === 'Low' ? 'bg-green-500 text-white' : ''
                          }
                        >
                          {risk.riskLevel}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">{risk.category}</td>
                      <td className="px-4 py-2">{risk.responsibleParty}</td>
                      <td className="px-4 py-2">{risk.targetDate}</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline">{risk.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 3: Importing */}
        {step === 'importing' && (
          <div className="space-y-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h3 className="text-lg font-semibold">Importing Risks...</h3>
            <Progress value={importProgress} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-gray-600">{importProgress}% Complete</p>
          </div>
        )}

        {/* Step 4: Completed */}
        {step === 'completed' && (
          <div className="space-y-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">Import Completed!</h3>
            <p className="text-gray-600">
              Your risks have been successfully imported and are now available in your risk management system.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={resetImporter}>
                Import More Risks
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}