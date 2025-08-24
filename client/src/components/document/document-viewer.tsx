import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, 
  Edit, 
  Download, 
  Save, 
  X, 
  FileText, 
  QrCode, 
  Scan,
  Share2,
  Printer,
  Copy,
  Calendar,
  User,
  Tag,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

interface DocumentViewerProps {
  document: {
    id: string;
    title: string;
    content: string;
    category: string;
    status: 'draft' | 'review' | 'approved' | 'archived';
    version: string;
    lastModified: Date;
    author: string;
    tags: string[];
    description: string;
  };
  onUpdate?: (updatedDocument: any) => void;
  onDelete?: (documentId: string) => void;
  onClose?: () => void;
}

export default function DocumentViewer({ document, onUpdate, onDelete, onClose }: DocumentViewerProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState(document);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [barcodeUrl, setBarcodeUrl] = useState<string>('');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const barcodeCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQRCode();
    generateBarcode();
  }, [document.id]);

  const generateQRCode = async () => {
    try {
      const qrData = {
        documentId: document.id,
        title: document.title,
        version: document.version,
        lastModified: document.lastModified.toISOString(),
        url: `${window.location.origin}/documents/${document.id}`
      };
      
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const generateBarcode = () => {
    try {
      const canvas = window.document.createElement('canvas');
      JsBarcode(canvas, `DOC-${document.id}`, {
        format: "CODE128",
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 14,
        margin: 10
      });
      
      setBarcodeUrl(canvas.toDataURL());
    } catch (error) {
      console.error('Failed to generate barcode:', error);
    }
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...editedDocument,
        lastModified: new Date(),
        version: incrementVersion(editedDocument.version)
      });
    }
    setIsEditing(false);
    
    // Regenerate codes after update
    setTimeout(() => {
      generateQRCode();
      generateBarcode();
    }, 100);
    
    toast({
      title: "Document Updated",
      description: "Document has been successfully updated.",
    });
  };

  const incrementVersion = (version: string): string => {
    const parts = version.split('.');
    const patch = parseInt(parts[parts.length - 1]) + 1;
    parts[parts.length - 1] = patch.toString();
    return parts.join('.');
  };

  const handleDownload = async (format: 'md' | 'pdf' | 'txt') => {
    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      switch (format) {
        case 'md':
          content = editedDocument.content;
          filename = `${editedDocument.title.replace(/\s+/g, '-')}-v${editedDocument.version}.md`;
          mimeType = 'text/markdown';
          break;
        case 'txt':
          content = editedDocument.content.replace(/[#*_`]/g, '');
          filename = `${editedDocument.title.replace(/\s+/g, '-')}-v${editedDocument.version}.txt`;
          mimeType = 'text/plain';
          break;
        case 'pdf':
          // For PDF, we would need to implement PDF generation
          toast({
            title: "PDF Export",
            description: "PDF export functionality coming soon.",
          });
          return;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = filename;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `${filename} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyQRCode = async () => {
    if (qrCodeUrl) {
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        toast({
          title: "QR Code Copied",
          description: "QR code has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy QR code to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCopyBarcode = async () => {
    if (barcodeUrl) {
      try {
        const response = await fetch(barcodeUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        toast({
          title: "Barcode Copied",
          description: "Barcode has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy barcode to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'review': return 'bg-yellow-500';
      case 'draft': return 'bg-blue-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'review': return <Clock className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'archived': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6" />
              {isEditing ? (
                <Input
                  value={editedDocument.title}
                  onChange={(e) => setEditedDocument(prev => ({ ...prev, title: e.target.value }))}
                  className="text-2xl font-bold border-none p-0 h-auto"
                />
              ) : (
                editedDocument.title
              )}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getStatusColor(editedDocument.status)} text-white`}>
                {getStatusIcon(editedDocument.status)}
                <span className="ml-1">{editedDocument.status}</span>
              </Badge>
              <Badge variant="outline">v{editedDocument.version}</Badge>
              <Badge variant="secondary">{editedDocument.category}</Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} data-testid="button-save-document">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)} data-testid="button-edit-document">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={() => handleDownload('md')} data-testid="button-download-document">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" data-testid="button-share-document">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" data-testid="button-print-document">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedDocument.description}
                  onChange={(e) => setEditedDocument(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Document description..."
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground">{editedDocument.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle>Document Content</CardTitle>
              <CardDescription>
                {isEditing ? 'Edit document content' : 'View document content'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedDocument.content}
                  onChange={(e) => setEditedDocument(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Document content..."
                  rows={20}
                  className="font-mono text-sm"
                />
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {editedDocument.content}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{editedDocument.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{editedDocument.lastModified.toLocaleDateString()}</span>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tags</Label>
                <div className="flex flex-wrap gap-1">
                  {editedDocument.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code
              </CardTitle>
              <CardDescription>Scan to access document</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrCodeUrl && (
                <div className="flex flex-col items-center space-y-2">
                  <img src={qrCodeUrl} alt="Document QR Code" className="border rounded" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyQRCode}>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      const link = window.document.createElement('a');
                      link.download = `qr-code-${document.id}.png`;
                      link.href = qrCodeUrl;
                      link.click();
                    }}>
                      <Download className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Barcode */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scan className="w-5 h-5" />
                Barcode
              </CardTitle>
              <CardDescription>For tracking and inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {barcodeUrl && (
                <div className="flex flex-col items-center space-y-2">
                  <img src={barcodeUrl} alt="Document Barcode" className="border rounded" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyBarcode}>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      const link = window.document.createElement('a');
                      link.download = `barcode-${document.id}.png`;
                      link.href = barcodeUrl;
                      link.click();
                    }}>
                      <Download className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Download Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Download Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => handleDownload('md')}
                data-testid="button-download-markdown"
              >
                <Download className="w-4 h-4 mr-2" />
                Markdown (.md)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => handleDownload('txt')}
                data-testid="button-download-text"
              >
                <Download className="w-4 h-4 mr-2" />
                Text (.txt)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => handleDownload('pdf')}
                data-testid="button-download-pdf"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF (.pdf)
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          {onDelete && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this document?')) {
                      onDelete(document.id);
                    }
                  }}
                  data-testid="button-delete-document"
                >
                  Delete Document
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}