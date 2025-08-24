import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Image, CheckCircle2, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface FileUploaderProps {
  onUploadComplete?: (file: any) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  uploadType: 'policy' | 'logo';
  title?: string;
  description?: string;
}

export default function FileUploader({
  onUploadComplete,
  acceptedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
  maxSize = 10 * 1024 * 1024, // 10MB default
  uploadType,
  title,
  description
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file size
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: `Please upload a valid file type: ${acceptedTypes.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Get upload URL from server
      const uploadResponse = await apiRequest('POST', `/api/upload/${uploadType}`, {});
      const { uploadURL } = uploadResponse;

      // Upload file directly to object storage
      const uploadResult = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResult.ok) {
        throw new Error('Upload failed');
      }

      // Complete upload on server
      const completeResponse = await apiRequest('POST', '/api/upload/complete', {
        fileName: file.name,
        fileType: file.type,
        fileUrl: uploadURL.split('?')[0], // Remove query parameters
        category: uploadType
      });

      const uploadedFile = {
        ...completeResponse,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      onUploadComplete?.(uploadedFile);

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          {title || `Upload ${uploadType === 'policy' ? 'Policy Document' : 'Company Logo'}`}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {uploading ? 'Uploading...' : 'Drop your file here or click to browse'}
            </p>
            <p className="text-xs text-muted-foreground">
              Max file size: {maxSize / (1024 * 1024)}MB
            </p>
            <Input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              accept={acceptedTypes.join(',')}
              className="hidden"
              id={`file-upload-${uploadType}`}
            />
            <Button
              variant="outline"
              disabled={uploading}
              onClick={() => document.getElementById(`file-upload-${uploadType}`)?.click()}
            >
              {uploading ? 'Uploading...' : 'Select File'}
            </Button>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploaded Files:</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}