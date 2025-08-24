import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import FileUploader from "@/components/common/file-uploader";
import { Upload, FileText, Image, Building2, Download, Share2, Eye } from "lucide-react";

export default function PolicyUpload() {
  const [uploadedPolicies, setUploadedPolicies] = useState<any[]>([]);
  const [companyLogo, setCompanyLogo] = useState<any>(null);
  const { toast } = useToast();

  const handlePolicyUpload = (file: any) => {
    setUploadedPolicies(prev => [...prev, file]);
  };

  const handleLogoUpload = (file: any) => {
    setCompanyLogo(file);
  };

  const exportPolicies = () => {
    if (uploadedPolicies.length === 0) {
      toast({
        title: "No policies to export",
        description: "Please upload some policies first.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      companyLogo,
      policies: uploadedPolicies,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `policy-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Your policy data has been exported successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Policy & Logo Upload</h1>
        </div>
        <Button onClick={exportPolicies} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export All Data
        </Button>
      </div>

      <Tabs defaultValue="policies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Policy Documents
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company Logo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-6">
          <FileUploader
            uploadType="policy"
            onUploadComplete={handlePolicyUpload}
            title="Upload Policy Documents"
            description="Upload your company policies one by one. Supported formats: PDF, Word documents"
            acceptedTypes={[
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'text/plain'
            ]}
          />

          {uploadedPolicies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Policy Documents ({uploadedPolicies.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {uploadedPolicies.map((policy, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-500" />
                        <div>
                          <h3 className="font-medium">{policy.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {(policy.size / 1024).toFixed(1)} KB • 
                            Uploaded {new Date(policy.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logo" className="space-y-6">
          <FileUploader
            uploadType="logo"
            onUploadComplete={handleLogoUpload}
            title="Upload Company Logo"
            description="Upload your company logo for use in generated documents and reports"
            acceptedTypes={['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']}
            maxSize={5 * 1024 * 1024} // 5MB for images
          />

          {companyLogo && (
            <Card>
              <CardHeader>
                <CardTitle>Current Company Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{companyLogo.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(companyLogo.size / 1024).toFixed(1)} KB • 
                      {companyLogo.type} • 
                      Uploaded {new Date(companyLogo.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Logo Usage Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p><strong>Recommended formats:</strong> PNG (with transparency), SVG, or high-quality JPEG</p>
                <p><strong>Recommended size:</strong> At least 300x300 pixels for best quality</p>
                <p><strong>Usage:</strong> Your logo will be automatically included in:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Generated policy documents</li>
                  <li>Risk assessment reports</li>
                  <li>Compliance certificates</li>
                  <li>Document headers and footers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}