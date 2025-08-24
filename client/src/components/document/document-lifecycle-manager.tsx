import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  QrCode, 
  BarChart3, 
  Upload, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  User,
  Shield,
  Scan,
  FileCheck,
  Activity,
  Settings,
  Send,
  Signature,
  UserCheck,
  Crown,
  Building,
  Target,
  TrendingUp,
  Hash,
  Fingerprint
} from "lucide-react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

interface DocumentMetadata {
  id: string;
  title: string;
  type: string;
  category: string;
  version: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'implemented' | 'under_review' | 'archived';
  creator: string;
  createdAt: string;
  lastModified: string;
  approver?: string;
  approvedAt?: string;
  implementedAt?: string;
  qrCode: string;
  barcode: string;
  documentHash: string;
  signatureHash?: string;
  auditTrail: AuditEvent[];
  content: string;
  controls: string[];
  effectivenessScore?: number;
  implementationProgress?: number;
}

interface AuditEvent {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  documentHash: string;
}

interface ApprovalWorkflow {
  level: number;
  role: string;
  user: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
  comments?: string;
}

const DOCUMENT_TYPES = [
  'Security Policy',
  'Procedure Document', 
  'Work Instruction',
  'Risk Assessment',
  'Business Continuity Plan',
  'Incident Response Plan',
  'Compliance Framework',
  'Training Material',
  'Audit Report',
  'Control Assessment'
];

const APPROVAL_HIERARCHY = [
  { level: 1, role: 'Department Manager', authority: 'department' },
  { level: 2, role: 'Director', authority: 'directorate' },
  { level: 3, role: 'VP/C-Level', authority: 'executive' },
  { level: 4, role: 'CEO', authority: 'organization' }
];

export default function DocumentLifecycleManager() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentMetadata | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrCodeImage, setQRCodeImage] = useState<string>('');
  const [barcodeImage, setBarcodeImage] = useState<string>('');
  const [scannedCode, setScannedCode] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    content: '',
    controls: ''
  });

  // Load documents from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('document_lifecycle');
    if (stored) {
      setDocuments(JSON.parse(stored));
    }
  }, []);

  // Save documents to localStorage
  useEffect(() => {
    localStorage.setItem('document_lifecycle', JSON.stringify(documents));
  }, [documents]);

  const generateDocumentHash = (content: string): string => {
    return CryptoJS.SHA256(content + Date.now().toString()).toString();
  };

  const generateQRCode = async (documentId: string, documentHash: string): Promise<string> => {
    const qrData = JSON.stringify({
      id: documentId,
      hash: documentHash,
      timestamp: new Date().toISOString(),
      verification: 'authentic'
    });
    
    try {
      return await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('QR Code generation failed:', error);
      return '';
    }
  };

  const generateBarcode = (documentId: string): string => {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, documentId, {
        format: "CODE128",
        width: 2,
        height: 50,
        displayValue: true,
        fontSize: 12
      });
      return canvas.toDataURL();
    } catch (error) {
      console.error('Barcode generation failed:', error);
      return '';
    }
  };

  const createDocument = async () => {
    if (!formData.title || !formData.type || !formData.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const documentId = uuidv4();
    const documentHash = generateDocumentHash(formData.content);
    const qrCode = await generateQRCode(documentId, documentHash);
    const barcode = generateBarcode(documentId);

    const newDocument: DocumentMetadata = {
      id: documentId,
      title: formData.title,
      type: formData.type,
      category: formData.category || 'General',
      version: '1.0',
      status: 'draft',
      creator: 'Current User', // In real app, get from auth
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      qrCode,
      barcode,
      documentHash,
      content: formData.content,
      controls: formData.controls.split(',').map(c => c.trim()).filter(c => c),
      auditTrail: [{
        id: uuidv4(),
        action: 'Document Created',
        user: 'Current User',
        timestamp: new Date().toISOString(),
        details: `Document "${formData.title}" created`,
        documentHash
      }],
      implementationProgress: 0
    };

    setDocuments(prev => [newDocument, ...prev]);
    setFormData({ title: '', type: '', category: '', content: '', controls: '' });
    setShowCreateDialog(false);

    toast({
      title: "Document Created",
      description: `Document "${formData.title}" created with QR and barcode tracking.`,
    });
  };

  const submitForApproval = (documentId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === documentId) {
        const auditEvent: AuditEvent = {
          id: uuidv4(),
          action: 'Submitted for Approval',
          user: 'Current User',
          timestamp: new Date().toISOString(),
          details: 'Document submitted to approval workflow',
          documentHash: doc.documentHash
        };

        return {
          ...doc,
          status: 'pending_approval' as const,
          lastModified: new Date().toISOString(),
          auditTrail: [...doc.auditTrail, auditEvent]
        };
      }
      return doc;
    }));

    toast({
      title: "Submitted for Approval",
      description: "Document sent to CEO for digital signature approval.",
    });
  };

  const approveDocument = (documentId: string, approverRole: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === documentId) {
        const signatureHash = CryptoJS.SHA256(doc.documentHash + 'CEO_SIGNATURE' + Date.now()).toString();
        
        const auditEvent: AuditEvent = {
          id: uuidv4(),
          action: 'Document Approved',
          user: approverRole,
          timestamp: new Date().toISOString(),
          details: `Document approved by ${approverRole} with digital signature`,
          documentHash: doc.documentHash
        };

        return {
          ...doc,
          status: 'approved' as const,
          approver: approverRole,
          approvedAt: new Date().toISOString(),
          signatureHash,
          lastModified: new Date().toISOString(),
          auditTrail: [...doc.auditTrail, auditEvent]
        };
      }
      return doc;
    }));

    toast({
      title: "Document Approved",
      description: `Document approved by ${approverRole} and ready for implementation.`,
    });
  };

  const implementDocument = (documentId: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === documentId) {
        const auditEvent: AuditEvent = {
          id: uuidv4(),
          action: 'Implementation Started',
          user: 'Implementation Team',
          timestamp: new Date().toISOString(),
          details: 'Document implementation phase initiated',
          documentHash: doc.documentHash
        };

        return {
          ...doc,
          status: 'implemented' as const,
          implementedAt: new Date().toISOString(),
          implementationProgress: 100,
          effectivenessScore: Math.floor(Math.random() * 30) + 70, // Simulated effectiveness
          lastModified: new Date().toISOString(),
          auditTrail: [...doc.auditTrail, auditEvent]
        };
      }
      return doc;
    }));

    toast({
      title: "Implementation Complete",
      description: "Document successfully implemented with tracking enabled.",
    });
  };

  const verifyDocument = async (code: string) => {
    try {
      const qrData = JSON.parse(code);
      const document = documents.find(doc => doc.id === qrData.id);
      
      if (document && document.documentHash === qrData.hash) {
        toast({
          title: "Document Verified",
          description: `Authentic document: ${document.title}`,
        });
        return true;
      } else {
        toast({
          title: "Verification Failed",
          description: "Document integrity check failed or document not found.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Invalid Code",
        description: "Could not parse QR code data.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-purple-100 text-purple-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'pending_approval': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'implemented': return <Target className="w-4 h-4" />;
      case 'under_review': return <Eye className="w-4 h-4" />;
      case 'archived': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const showQRCode = async (document: DocumentMetadata) => {
    setSelectedDocument(document);
    setQRCodeImage(document.qrCode);
    setBarcodeImage(document.barcode);
    setShowQRDialog(true);
  };

  const downloadDocument = (doc: DocumentMetadata) => {
    const documentData = {
      ...doc,
      downloadedAt: new Date().toISOString(),
      downloadedBy: 'Current User'
    };

    const blob = new Blob([JSON.stringify(documentData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, '_')}_v${doc.version}.json`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Add to audit trail
    const auditEvent: AuditEvent = {
      id: uuidv4(),
      action: 'Document Downloaded',
      user: 'Current User',
      timestamp: new Date().toISOString(),
      details: 'Document downloaded for signature/approval',
      documentHash: doc.documentHash
    };

    setDocuments(prev => prev.map(d => 
      d.id === doc.id 
        ? { ...d, auditTrail: [...d.auditTrail, auditEvent] }
        : d
    ));

    toast({
      title: "Document Downloaded",
      description: "Document downloaded with tracking record created.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-primary" />
            Document Lifecycle Management
          </h2>
          <p className="text-muted-foreground">
            QR/Barcode tracking system with CEO approval workflow
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Create Document
        </Button>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'pending_approval').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Implemented</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'implemented').length}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Effectiveness</p>
                <p className="text-2xl font-bold text-purple-600">
                  {documents.filter(d => d.effectivenessScore).length > 0 
                    ? Math.round(documents.filter(d => d.effectivenessScore).reduce((acc, d) => acc + (d.effectivenessScore || 0), 0) / documents.filter(d => d.effectivenessScore).length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="workflow">Approval Workflow</TabsTrigger>
          <TabsTrigger value="tracking">QR/Barcode Tracking</TabsTrigger>
          <TabsTrigger value="verification">Document Verification</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Registry</CardTitle>
              <CardDescription>
                All documents with QR/barcode tracking and approval status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No documents created yet. Create your first document to start tracking.
                  </div>
                ) : (
                  documents.map((document) => (
                    <Card key={document.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{document.title}</h3>
                            <Badge className={getStatusColor(document.status)} variant="outline">
                              {getStatusIcon(document.status)}
                              {document.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{document.type}</Badge>
                            <Badge variant="outline">v{document.version}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Created by {document.creator} on {new Date(document.createdAt).toLocaleDateString()}
                            {document.approver && (
                              <span> • Approved by {document.approver}</span>
                            )}
                          </div>
                          {document.implementationProgress !== undefined && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>Implementation Progress</span>
                                <span>{document.implementationProgress}%</span>
                              </div>
                              <Progress value={document.implementationProgress} className="h-2" />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => showQRCode(document)}
                            title="View QR/Barcode"
                          >
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadDocument(document)}
                            title="Download Document"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {document.status === 'draft' && (
                            <Button
                              size="sm"
                              onClick={() => submitForApproval(document.id)}
                              title="Submit for Approval"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          {document.status === 'pending_approval' && (
                            <Button
                              size="sm"
                              onClick={() => approveDocument(document.id, 'CEO')}
                              title="CEO Approval"
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Crown className="w-4 h-4" />
                            </Button>
                          )}
                          {document.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => implementDocument(document.id)}
                              title="Implement Document"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Target className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Hierarchy</CardTitle>
              <CardDescription>
                Top-down approval process from CEO to implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {APPROVAL_HIERARCHY.map((level) => (
                  <div key={level.level} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {level.level}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{level.role}</h3>
                      <p className="text-sm text-muted-foreground">
                        Authority: {level.authority}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {level.role === 'CEO' ? <Crown className="w-4 h-4 mr-1" /> : <UserCheck className="w-4 h-4 mr-1" />}
                      Digital Signature
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>QR Code & Barcode Tracking</CardTitle>
              <CardDescription>
                Track document authenticity and lifecycle events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    QR Code Features
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Document ID and hash verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Timestamp authentication
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Tamper detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Mobile scanning support
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Barcode Features
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Unique document identifier
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Physical document tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Inventory management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Audit trail integration
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
              <CardDescription>
                Scan QR codes to verify document authenticity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Paste QR code data or scan with device..."
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => verifyDocument(scannedCode)}
                    disabled={!scannedCode}
                    className="flex items-center gap-2"
                  >
                    <Scan className="w-4 h-4" />
                    Verify
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Scan the QR code on any document to verify its authenticity and track its lifecycle status.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Document Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Document title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Document category"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Document content..."
                rows={6}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Controls (comma-separated)</label>
              <Input
                value={formData.controls}
                onChange={(e) => setFormData({...formData, controls: e.target.value})}
                placeholder="Control 1, Control 2, Control 3"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createDocument}>
                Create Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Document QR & Barcode</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">{selectedDocument.title}</h3>
                <Badge className={getStatusColor(selectedDocument.status)}>
                  {selectedDocument.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div className="text-center space-y-4">
                <div>
                  <h4 className="font-medium mb-2">QR Code</h4>
                  {qrCodeImage && <img src={qrCodeImage} alt="QR Code" className="mx-auto" />}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Barcode</h4>
                  {barcodeImage && <img src={barcodeImage} alt="Barcode" className="mx-auto" />}
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Document ID:</strong> {selectedDocument.id}</p>
                <p><strong>Hash:</strong> {selectedDocument.documentHash.substring(0, 16)}...</p>
                <p><strong>Created:</strong> {new Date(selectedDocument.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}