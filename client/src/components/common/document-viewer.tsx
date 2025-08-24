import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, 
  Download, 
  Share2, 
  Copy, 
  QrCode, 
  BarChart3, 
  FileText, 
  Calendar,
  User,
  Building2,
  Hash,
  CheckCircle
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

interface DocumentMetadata {
  title: string;
  type: string;
  description?: string;
  author?: string;
  company?: string;
  createdDate?: string;
  version?: string;
  status?: 'draft' | 'review' | 'approved' | 'published';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
}

interface DocumentViewerProps {
  content: string;
  metadata: DocumentMetadata;
  triggerButton?: React.ReactNode;
  className?: string;
}

export default function DocumentViewer({ 
  content, 
  metadata, 
  triggerButton,
  className = ""
}: DocumentViewerProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [barcode, setBarcode] = useState<string>("");
  const [documentId] = useState(() => uuidv4());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCodes = async () => {
    try {
      // Generate document URL for QR code
      const documentUrl = `${window.location.origin}/document/${documentId}`;
      
      // Generate QR Code
      const qrCodeDataURL = await QRCode.toDataURL(documentUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCode(qrCodeDataURL);

      // Generate Barcode
      if (canvasRef.current) {
        JsBarcode(canvasRef.current, documentId, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 12,
          margin: 10
        });
        
        const barcodeDataURL = canvasRef.current.toDataURL();
        setBarcode(barcodeDataURL);
      }
    } catch (error) {
      console.error('Error generating codes:', error);
      toast({
        title: "Code Generation Failed",
        description: "Failed to generate QR code and barcode.",
        variant: "destructive",
      });
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    generateCodes();
  };

  const downloadDocument = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Document Downloaded",
      description: `${metadata.title} has been downloaded successfully.`,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to Clipboard",
        description: "Document content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const shareDocument = async () => {
    const documentUrl = `${window.location.origin}/document/${documentId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: metadata.title,
          text: metadata.description || `${metadata.type} document`,
          url: documentUrl,
        });
      } catch (error) {
        // User cancelled or share failed
        await copyUrlToClipboard(documentUrl);
      }
    } else {
      await copyUrlToClipboard(documentUrl);
    }
  };

  const copyUrlToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Document link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to copy document link.",
        variant: "destructive",
      });
    }
  };

  const printDocument = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${metadata.title}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px; 
            line-height: 1.6; 
            color: #333;
          }
          .document-header { 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .document-title { 
            font-size: 28px; 
            font-weight: bold; 
            color: #1e40af; 
            margin: 0 0 10px 0; 
          }
          .document-meta { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 15px; 
            margin: 20px 0; 
          }
          .meta-item { 
            display: flex; 
            flex-direction: column; 
          }
          .meta-label { 
            font-weight: 600; 
            color: #6b7280; 
            font-size: 12px; 
            text-transform: uppercase; 
            margin-bottom: 4px; 
          }
          .meta-value { 
            color: #374151; 
            font-weight: 500; 
          }
          .document-content { 
            white-space: pre-wrap; 
            font-size: 14px; 
            line-height: 1.8; 
          }
          .document-footer { 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            text-align: center; 
            font-size: 12px; 
            color: #6b7280; 
          }
          .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-draft { background-color: #fef3c7; color: #92400e; }
          .status-review { background-color: #dbeafe; color: #1e40af; }
          .status-approved { background-color: #dcfce7; color: #166534; }
          .status-published { background-color: #f3e8ff; color: #7c3aed; }
          .priority-low { background-color: #f0f9ff; color: #0369a1; }
          .priority-medium { background-color: #fefce8; color: #ca8a04; }
          .priority-high { background-color: #fef2f2; color: #dc2626; }
          .priority-critical { background-color: #fdf2f8; color: #be185d; }
          @media print {
            body { margin: 0; padding: 20px; }
            .document-header { break-after: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="document-header">
          <h1 class="document-title">${metadata.title}</h1>
          ${metadata.description ? `<p style="color: #6b7280; margin: 10px 0 0 0;">${metadata.description}</p>` : ''}
        </div>
        
        <div class="document-meta">
          <div class="meta-item">
            <span class="meta-label">Document Type</span>
            <span class="meta-value">${metadata.type}</span>
          </div>
          ${metadata.company ? `
            <div class="meta-item">
              <span class="meta-label">Organization</span>
              <span class="meta-value">${metadata.company}</span>
            </div>
          ` : ''}
          ${metadata.author ? `
            <div class="meta-item">
              <span class="meta-label">Author</span>
              <span class="meta-value">${metadata.author}</span>
            </div>
          ` : ''}
          <div class="meta-item">
            <span class="meta-label">Created Date</span>
            <span class="meta-value">${metadata.createdDate || new Date().toLocaleDateString()}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Document ID</span>
            <span class="meta-value">${documentId}</span>
          </div>
          ${metadata.version ? `
            <div class="meta-item">
              <span class="meta-label">Version</span>
              <span class="meta-value">${metadata.version}</span>
            </div>
          ` : ''}
          ${metadata.status ? `
            <div class="meta-item">
              <span class="meta-label">Status</span>
              <span class="meta-value">
                <span class="status-badge status-${metadata.status}">${metadata.status}</span>
              </span>
            </div>
          ` : ''}
          ${metadata.priority ? `
            <div class="meta-item">
              <span class="meta-label">Priority</span>
              <span class="meta-value">
                <span class="status-badge priority-${metadata.priority}">${metadata.priority}</span>
              </span>
            </div>
          ` : ''}
        </div>
        
        <div class="document-content">${content}</div>
        
        <div class="document-footer">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Document ID: ${documentId}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = function() {
      printWindow.print();
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'published': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-sky-100 text-sky-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {triggerButton || (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpen}
              className={className}
              data-testid="button-view-document"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Document
            </Button>
          )}
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span data-testid="text-document-title">{metadata.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={downloadDocument}
                  data-testid="button-download-document"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  data-testid="button-copy-document"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={shareDocument}
                  data-testid="button-share-document"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={printDocument}
                  data-testid="button-print-document"
                >
                  Print
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-hidden">
            {/* Document Content */}
            <div className="lg:col-span-2 space-y-4 overflow-auto">
              {/* Document Metadata */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Document Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Type:</span>
                      <span className="ml-2" data-testid="text-document-type">{metadata.type}</span>
                    </div>
                    {metadata.company && (
                      <div>
                        <span className="font-medium text-muted-foreground">Company:</span>
                        <span className="ml-2" data-testid="text-document-company">{metadata.company}</span>
                      </div>
                    )}
                    {metadata.author && (
                      <div>
                        <span className="font-medium text-muted-foreground">Author:</span>
                        <span className="ml-2" data-testid="text-document-author">{metadata.author}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-muted-foreground">Created:</span>
                      <span className="ml-2" data-testid="text-document-date">{metadata.createdDate || new Date().toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Document ID:</span>
                      <span className="ml-2 font-mono text-xs" data-testid="text-document-id">{documentId}</span>
                    </div>
                    {metadata.version && (
                      <div>
                        <span className="font-medium text-muted-foreground">Version:</span>
                        <span className="ml-2" data-testid="text-document-version">{metadata.version}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {metadata.status && (
                      <Badge className={getStatusColor(metadata.status)} data-testid="badge-document-status">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {metadata.status.toUpperCase()}
                      </Badge>
                    )}
                    {metadata.priority && (
                      <Badge className={getPriorityColor(metadata.priority)} data-testid="badge-document-priority">
                        {metadata.priority.toUpperCase()} PRIORITY
                      </Badge>
                    )}
                    {metadata.category && (
                      <Badge variant="outline" data-testid="badge-document-category">
                        {metadata.category}
                      </Badge>
                    )}
                  </div>
                  
                  {metadata.description && (
                    <p className="text-sm text-muted-foreground" data-testid="text-document-description">
                      {metadata.description}
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {/* Document Content */}
              <Card className="flex-1 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Document Content</CardTitle>
                </CardHeader>
                <CardContent className="overflow-auto max-h-96">
                  <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg" data-testid="text-document-content">
                    {content}
                  </pre>
                </CardContent>
              </Card>
            </div>
            
            {/* QR Code and Barcode */}
            <div className="space-y-4">
              {/* QR Code */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {qrCode ? (
                    <div className="space-y-3">
                      <img 
                        src={qrCode} 
                        alt="Document QR Code" 
                        className="mx-auto border rounded-lg"
                        data-testid="img-qr-code"
                      />
                      <p className="text-xs text-muted-foreground">
                        Scan to access document online
                      </p>
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center text-muted-foreground">
                      Generating QR Code...
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Barcode */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Barcode
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {barcode ? (
                    <div className="space-y-3">
                      <img 
                        src={barcode} 
                        alt="Document Barcode" 
                        className="mx-auto border rounded-lg"
                        data-testid="img-barcode"
                      />
                      <p className="text-xs text-muted-foreground font-mono">
                        {documentId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Document tracking ID
                      </p>
                    </div>
                  ) : (
                    <div className="h-20 flex items-center justify-center text-muted-foreground">
                      Generating Barcode...
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={downloadDocument}
                    data-testid="button-download-quick"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={copyToClipboard}
                    data-testid="button-copy-quick"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Content
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={shareDocument}
                    data-testid="button-share-quick"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Document
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}