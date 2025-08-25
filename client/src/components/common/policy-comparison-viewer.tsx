import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  GitCompare, 
  Eye, 
  Download, 
  Share2,
  RefreshCw,
  ArrowLeftRight,
  FileText,
  Settings,
  Diff,
  Copy
} from "lucide-react";

interface PolicyDocument {
  id: string;
  title: string;
  content: string;
  version: string;
  lastModified: string;
  author: string;
  status: string;
  category: string;
}

interface PolicyComparisonViewerProps {
  documents: PolicyDocument[];
  triggerButton?: React.ReactNode;
  defaultLeftDoc?: string;
  defaultRightDoc?: string;
}

interface DiffResult {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  content: string;
  lineNumber: number;
}

export function PolicyComparisonViewer({ 
  documents, 
  triggerButton, 
  defaultLeftDoc, 
  defaultRightDoc 
}: PolicyComparisonViewerProps) {
  const [leftDocId, setLeftDocId] = useState(defaultLeftDoc || "");
  const [rightDocId, setRightDocId] = useState(defaultRightDoc || "");
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [highlightChanges, setHighlightChanges] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const leftDoc = documents.find(doc => doc.id === leftDocId);
  const rightDoc = documents.find(doc => doc.id === rightDocId);

  // Simple diff algorithm to highlight changes
  const generateDiff = (leftContent: string, rightContent: string): { left: DiffResult[], right: DiffResult[] } => {
    const leftLines = leftContent.split('\n');
    const rightLines = rightContent.split('\n');
    
    const leftDiff: DiffResult[] = [];
    const rightDiff: DiffResult[] = [];
    
    let leftIndex = 0;
    let rightIndex = 0;
    
    while (leftIndex < leftLines.length || rightIndex < rightLines.length) {
      const leftLine = leftLines[leftIndex] || '';
      const rightLine = rightLines[rightIndex] || '';
      
      if (leftLine === rightLine) {
        // Lines are identical
        leftDiff.push({ type: 'unchanged', content: leftLine, lineNumber: leftIndex + 1 });
        rightDiff.push({ type: 'unchanged', content: rightLine, lineNumber: rightIndex + 1 });
        leftIndex++;
        rightIndex++;
      } else if (leftIndex >= leftLines.length) {
        // Only right side has content (addition)
        rightDiff.push({ type: 'added', content: rightLine, lineNumber: rightIndex + 1 });
        leftDiff.push({ type: 'removed', content: '', lineNumber: -1 });
        rightIndex++;
      } else if (rightIndex >= rightLines.length) {
        // Only left side has content (removal)
        leftDiff.push({ type: 'removed', content: leftLine, lineNumber: leftIndex + 1 });
        rightDiff.push({ type: 'added', content: '', lineNumber: -1 });
        leftIndex++;
      } else {
        // Lines are different (modification)
        leftDiff.push({ type: 'modified', content: leftLine, lineNumber: leftIndex + 1 });
        rightDiff.push({ type: 'modified', content: rightLine, lineNumber: rightIndex + 1 });
        leftIndex++;
        rightIndex++;
      }
    }
    
    return { left: leftDiff, right: rightDiff };
  };

  const { left: leftDiff, right: rightDiff } = leftDoc && rightDoc 
    ? generateDiff(leftDoc.content, rightDoc.content)
    : { left: [], right: [] };

  const filteredLeftDiff = showDifferencesOnly 
    ? leftDiff.filter(line => line.type !== 'unchanged')
    : leftDiff;
    
  const filteredRightDiff = showDifferencesOnly 
    ? rightDiff.filter(line => line.type !== 'unchanged')
    : rightDiff;

  const getLineClassName = (type: DiffResult['type']) => {
    if (!highlightChanges) return '';
    
    switch (type) {
      case 'added':
        return 'bg-green-50 border-l-4 border-green-500 pl-2';
      case 'removed':
        return 'bg-red-50 border-l-4 border-red-500 pl-2';
      case 'modified':
        return 'bg-yellow-50 border-l-4 border-yellow-500 pl-2';
      default:
        return '';
    }
  };

  const swapDocuments = () => {
    const temp = leftDocId;
    setLeftDocId(rightDocId);
    setRightDocId(temp);
  };

  const handleDownloadComparison = () => {
    if (!leftDoc || !rightDoc) return;

    const comparisonReport = `# Policy Comparison Report

## Documents Compared
- **Left Document:** ${leftDoc.title} (v${leftDoc.version})
- **Right Document:** ${rightDoc.title} (v${rightDoc.version})
- **Comparison Date:** ${new Date().toLocaleDateString()}

## Document Details

### ${leftDoc.title}
- **Version:** ${leftDoc.version}
- **Author:** ${leftDoc.author}
- **Last Modified:** ${leftDoc.lastModified}
- **Status:** ${leftDoc.status}
- **Category:** ${leftDoc.category}

### ${rightDoc.title}
- **Version:** ${rightDoc.version}
- **Author:** ${rightDoc.author}
- **Last Modified:** ${rightDoc.lastModified}
- **Status:** ${rightDoc.status}
- **Category:** ${rightDoc.category}

## Changes Summary
- **Added Lines:** ${rightDiff.filter(line => line.type === 'added').length}
- **Removed Lines:** ${leftDiff.filter(line => line.type === 'removed').length}
- **Modified Lines:** ${leftDiff.filter(line => line.type === 'modified').length}
- **Unchanged Lines:** ${leftDiff.filter(line => line.type === 'unchanged').length}

## Detailed Comparison

### Left Document Content
${leftDoc.content}

### Right Document Content
${rightDoc.content}

---
*Generated by Metaworks Policy Comparison Tool*
*© ${new Date().getFullYear()} - All rights reserved*
`;

    const blob = new Blob([comparisonReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `policy-comparison-${leftDoc.title}-vs-${rightDoc.title}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Comparison Downloaded",
      description: "Policy comparison report has been downloaded.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm">
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Documents
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Policy Document Comparison
          </DialogTitle>
          <DialogDescription>
            Compare two policy documents side-by-side to identify differences and changes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 h-full overflow-hidden">
          {/* Document Selection and Controls */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Document Selection & Controls</CardTitle>
                <div className="flex items-center gap-2">
                  <Button onClick={swapDocuments} size="sm" variant="outline">
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleDownloadComparison} size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Document Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Left Document</Label>
                  <Select value={leftDocId} onValueChange={setLeftDocId}>
                    <SelectTrigger data-testid="select-left-document">
                      <SelectValue placeholder="Select left document" />
                    </SelectTrigger>
                    <SelectContent>
                      {documents.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{doc.title}</span>
                            <Badge variant="outline" className="ml-2">v{doc.version}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Right Document</Label>
                  <Select value={rightDocId} onValueChange={setRightDocId}>
                    <SelectTrigger data-testid="select-right-document">
                      <SelectValue placeholder="Select right document" />
                    </SelectTrigger>
                    <SelectContent>
                      {documents.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{doc.title}</span>
                            <Badge variant="outline" className="ml-2">v{doc.version}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* View Options */}
              <div className="flex items-center gap-6 pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="highlight-changes"
                    checked={highlightChanges}
                    onCheckedChange={setHighlightChanges}
                  />
                  <Label htmlFor="highlight-changes" className="text-sm">Highlight Changes</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="differences-only"
                    checked={showDifferencesOnly}
                    onCheckedChange={setShowDifferencesOnly}
                  />
                  <Label htmlFor="differences-only" className="text-sm">Show Differences Only</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Label className="text-sm">View Mode:</Label>
                  <Select value={viewMode} onValueChange={(value: "split" | "unified") => setViewMode(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="split">Split View</SelectItem>
                      <SelectItem value="unified">Unified View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Information */}
          {leftDoc && rightDoc && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-600">Left Document</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {leftDoc.title}</div>
                  <div><strong>Version:</strong> {leftDoc.version}</div>
                  <div><strong>Author:</strong> {leftDoc.author}</div>
                  <div><strong>Status:</strong> <Badge variant="outline">{leftDoc.status}</Badge></div>
                  <div><strong>Last Modified:</strong> {leftDoc.lastModified}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-600">Right Document</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Title:</strong> {rightDoc.title}</div>
                  <div><strong>Version:</strong> {rightDoc.version}</div>
                  <div><strong>Author:</strong> {rightDoc.author}</div>
                  <div><strong>Status:</strong> <Badge variant="outline">{rightDoc.status}</Badge></div>
                  <div><strong>Last Modified:</strong> {rightDoc.lastModified}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Comparison View */}
          {leftDoc && rightDoc && (
            <Card className="flex-1 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Diff className="h-4 w-4" />
                  Document Comparison
                  <Badge variant="secondary">
                    {leftDiff.filter(line => line.type !== 'unchanged').length} differences
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-hidden">
                {viewMode === "split" ? (
                  <div className="grid grid-cols-2 gap-4 h-full overflow-hidden">
                    {/* Left Document */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-blue-50 p-2 border-b">
                        <h4 className="text-sm font-medium text-blue-800">{leftDoc.title}</h4>
                      </div>
                      <div className="h-full overflow-y-auto p-3 text-sm font-mono">
                        {filteredLeftDiff.map((line, index) => (
                          <div
                            key={index}
                            className={`${getLineClassName(line.type)} py-1 ${line.content === '' ? 'min-h-[1.5rem]' : ''}`}
                          >
                            <span className="text-gray-400 mr-2 w-8 inline-block">
                              {line.lineNumber > 0 ? line.lineNumber : ''}
                            </span>
                            {line.content || '\u00A0'}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Document */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-green-50 p-2 border-b">
                        <h4 className="text-sm font-medium text-green-800">{rightDoc.title}</h4>
                      </div>
                      <div className="h-full overflow-y-auto p-3 text-sm font-mono">
                        {filteredRightDiff.map((line, index) => (
                          <div
                            key={index}
                            className={`${getLineClassName(line.type)} py-1 ${line.content === '' ? 'min-h-[1.5rem]' : ''}`}
                          >
                            <span className="text-gray-400 mr-2 w-8 inline-block">
                              {line.lineNumber > 0 ? line.lineNumber : ''}
                            </span>
                            {line.content || '\u00A0'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden h-full">
                    <div className="bg-gray-50 p-2 border-b">
                      <h4 className="text-sm font-medium">Unified Comparison View</h4>
                    </div>
                    <div className="h-full overflow-y-auto p-3 text-sm font-mono">
                      {/* Unified view implementation would interleave changes */}
                      <div className="text-center py-8 text-muted-foreground">
                        <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Unified view coming soon</p>
                        <p className="text-xs">Use split view for detailed comparison</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* No documents selected state */}
          {(!leftDoc || !rightDoc) && (
            <Card className="flex-1">
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select two documents to compare</p>
                  <p className="text-sm">Choose documents from the dropdowns above</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}