import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Upload, FileText, List, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type Section = 'landing' | 'dashboard' | 'ecc-v1' | 'template-manager' | 'create-policy' | 'v1-controls';

interface UploadedTemplate {
  name: string;
  fileName: string;
  date: string;
}

export default function MetaworksCompliance() {
  const [currentSection, setCurrentSection] = useState<Section>('landing');
  const [isArabic, setIsArabic] = useState(false);
  const [v1Progress, setV1Progress] = useState(25);
  const [uploadedTemplates, setUploadedTemplates] = useState<UploadedTemplate[]>([
    { name: "Access Control Policy", fileName: "access_control.docx", date: "2025-04-05" }
  ]);
  const [generating, setGenerating] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = 1; // Mock user ID

  const controls = [
    { id: "1.2.1", description: "Cybersecurity Management", status: "Not Implemented" },
    { id: "2.5.2", description: "Network Security Management", status: "Implemented" },
    { id: "2.7.2", description: "Data Protection", status: "Partially Implemented" },
    { id: "2.9.3", description: "Backup Management", status: "Implemented" },
    { id: "2.13.3.2", description: "Incident Classification", status: "Not Implemented" },
    { id: "5.1.3.5", description: "ICS: External Media Limitation", status: "Not Implemented" }
  ];

  const handleUploadTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('template-name') as string;
    const file = formData.get('template-file') as File;
    
    if (name && file) {
      const newTemplate = {
        name,
        fileName: file.name,
        date: new Date().toISOString().split('T')[0]
      };
      
      setUploadedTemplates([...uploadedTemplates, newTemplate]);
      (e.target as HTMLFormElement).reset();
      
      toast({
        title: isArabic ? "تم رفع القالب بنجاح!" : "Template Uploaded Successfully!",
        description: isArabic ? `تم رفع القالب "${name}" بنجاح!` : `Template "${name}" uploaded successfully!`,
      });
    }
  };

  const handleGeneratePolicy = async () => {
    setGenerating(true);
    try {
      const policy = {
        userId,
        domain: "Governance",
        subdomain: "Cybersecurity Policy", 
        generatedAt: new Date().toISOString(),
      };

      await apiRequest('POST', '/api/policies', policy);

      toast({
        title: isArabic ? "تم إنشاء السياسة!" : "Policy Generated!",
        description: isArabic ? "تم إنشاء السياسة وحفظها بنجاح" : "Policy generated and saved successfully",
      });

      await queryClient.invalidateQueries({ queryKey: [`/api/policies/${userId}`] });
    } catch (error) {
      toast({
        title: isArabic ? "خطأ" : "Error",
        description: isArabic ? "فشل في إنشاء السياسة" : "Failed to generate policy",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  const showSection = (section: Section) => {
    setCurrentSection(section);
  };

  return (
    <div className="metaworks-bg text-white min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <header className="flex justify-between items-center py-4 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10" style={{ stroke: '#00adb5' }} />
            <h1 className="text-3xl font-bold gradient-text">
              {isArabic ? 'ميتا ووركس' : 'Metaworks'}
            </h1>
          </div>
          <Button
            onClick={toggleLanguage}
            className="bg-[#00adb5] hover:bg-[#00adb5]/80 text-white px-4 py-2 rounded-lg font-semibold"
          >
            {isArabic ? 'EN' : 'العربية'}
          </Button>
        </header>

        {/* Landing Section */}
        {currentSection === 'landing' && (
          <Card className="glass text-white border-0 p-6">
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold mb-4">
                {isArabic ? 'مرحباً بك في ميتا ووركس' : 'Welcome to Metaworks'}
              </h2>
              <p className="text-lg mb-6 text-[#e0fefe]">
                {isArabic 
                  ? 'رحلة الامتثال لـ NCA ECC V1 و V2 تبدأ هنا'
                  : 'Your NCA ECC V1 & V2 Compliance Journey Starts Here'
                }
              </p>
              <Button
                onClick={() => showSection('dashboard')}
                className="glass-button text-white px-6 py-3 rounded-lg font-semibold"
              >
                {isArabic ? 'بدء الامتثال' : 'Begin Compliance'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Section */}
        {currentSection === 'dashboard' && (
          <div className="space-y-6">
            <Card className="glass text-white border-0 p-6">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {isArabic ? 'لوحة الامتثال' : 'Compliance Dashboard'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white/10 rounded-lg p-2 mb-4">
                  <div className="progress-bar" style={{ width: `${v1Progress}%` }}></div>
                </div>
                <p className="mb-6">
                  {isArabic ? `${v1Progress}% مكتمل — ابدأ بـ ECC V1` : `${v1Progress}% Complete — Start with ECC V1`}
                </p>

                <div className="grid gap-4">
                  <Card className="glass border-0 p-4">
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      📘 {isArabic ? 'NCA ECC V1 (2018)' : 'NCA ECC V1 (2018)'}
                    </h3>
                    <p className="mb-4">
                      {isArabic ? 'الحالة:' : 'Status:'} 
                      <span className="text-[#00adb5] ml-2">
                        {isArabic ? 'قيد التقدم' : 'In Progress'}
                      </span>
                    </p>
                    <Button
                      onClick={() => showSection('ecc-v1')}
                      className="glass-button text-white"
                    >
                      {isArabic ? 'متابعة' : 'Continue'}
                    </Button>
                  </Card>

                  <Card className="glass border-0 p-4">
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      📘 {isArabic ? 'NCA ECC V2 (2024)' : 'NCA ECC V2 (2024)'}
                    </h3>
                    <p className="mb-4">
                      {isArabic ? 'الحالة:' : 'Status:'} 
                      <span className="text-[#ffcc00] ml-2">
                        {isArabic ? 'مقفل (أكمل V1 أولاً)' : 'Locked (Complete V1 First)'}
                      </span>
                    </p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ECC V1 Section */}
        {currentSection === 'ecc-v1' && (
          <Card className="glass text-white border-0 p-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isArabic ? 'NCA ECC V1: حوكمة الأمن السيبراني' : 'NCA ECC V1: Cybersecurity Governance'}
              </CardTitle>
              <p className="text-gray-300">
                {isArabic ? 'أكمل جميع المجالات لفتح ECC V2' : 'Complete all domains to unlock ECC V2.'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => showSection('template-manager')}
                className="glass-button text-white w-full justify-start"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isArabic ? '📤 رفع قوالب السياسات' : '📤 Upload Policy Templates'}
              </Button>
              
              <Button
                onClick={() => showSection('create-policy')}
                className="glass-button text-white w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isArabic ? '📄 إنشاء سياسة' : '📄 Generate Policy'}
              </Button>
              
              <Button
                onClick={() => showSection('v1-controls')}
                className="glass-button text-white w-full justify-start"
              >
                <List className="w-4 h-4 mr-2" />
                {isArabic ? '📋 عرض جميع الضوابط' : '📋 View All Controls'}
              </Button>
              
              <Button
                onClick={() => showSection('dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white w-full justify-start"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isArabic ? 'رجوع' : 'Back'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Template Manager Section */}
        {currentSection === 'template-manager' && (
          <Card className="glass text-white border-0 p-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isArabic ? '📤 رفع قوالب السياسات' : '📤 Upload Policy Templates'}
              </CardTitle>
              <p className="text-gray-300">
                {isArabic 
                  ? 'ارفع قوالب سياسات NCA ECC V1/V2 المخصصة (.docx فقط)'
                  : 'Upload your custom NCA ECC V1/V2 policy templates (.docx only).'
                }
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUploadTemplate} className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="template-name" className="text-white">
                    {isArabic ? 'اسم السياسة' : 'Policy Name'}
                  </Label>
                  <Input
                    id="template-name"
                    name="template-name"
                    placeholder={isArabic ? 'مثال: سياسة التحكم في الوصول' : 'e.g., Access Control Policy'}
                    required
                    className="bg-white/10 border-[#00adb5]/50 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="template-file" className="text-white">
                    {isArabic ? 'رفع ملف .docx' : 'Upload .docx File'}
                  </Label>
                  <Input
                    id="template-file"
                    name="template-file"
                    type="file"
                    accept=".docx"
                    required
                    className="bg-white/10 border-[#00adb5]/50 text-white"
                  />
                </div>
                <Button type="submit" className="glass-button text-white">
                  {isArabic ? 'رفع القالب' : 'Upload Template'}
                </Button>
              </form>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {isArabic ? 'القوالب المرفوعة' : 'Uploaded Templates'}
                </h3>
                <div className="bg-white/5 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="p-3 text-[#00adb5]">{isArabic ? 'الاسم' : 'Name'}</th>
                        <th className="p-3 text-[#00adb5]">{isArabic ? 'الملف' : 'File'}</th>
                        <th className="p-3 text-[#00adb5]">{isArabic ? 'التاريخ' : 'Date'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedTemplates.map((template, index) => (
                        <tr key={index} className="border-b border-white/10">
                          <td className="p-3">{template.name}</td>
                          <td className="p-3">{template.fileName}</td>
                          <td className="p-3">{template.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Button
                onClick={() => showSection('ecc-v1')}
                className="bg-gray-600 hover:bg-gray-700 text-white mt-6"
              >
                {isArabic ? 'رجوع' : 'Back'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Policy Section */}
        {currentSection === 'create-policy' && (
          <Card className="glass text-white border-0 p-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isArabic ? 'إنشاء سياسة' : 'Create Policy'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">{isArabic ? 'اختر القالب' : 'Select Template'}</Label>
                <Select>
                  <SelectTrigger className="bg-white/10 border-[#00adb5]/50 text-white">
                    <SelectValue placeholder={isArabic ? 'اختر قالب' : 'Select a template'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access">Access Control Policy</SelectItem>
                    <SelectItem value="password">Password Policy</SelectItem>
                    <SelectItem value="backup">Backup Policy</SelectItem>
                    <SelectItem value="incident">Incident Response Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">{isArabic ? 'اسم الشركة' : 'Company Name'}</Label>
                <Input
                  placeholder={isArabic ? 'أدخل اسم الشركة' : 'Enter company name'}
                  className="bg-white/10 border-[#00adb5]/50 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white">{isArabic ? 'اسم الرئيس التنفيذي للمعلومات' : 'CIO Name'}</Label>
                <Input
                  placeholder={isArabic ? 'أدخل اسم الرئيس التنفيذي للمعلومات' : 'Enter CIO name'}
                  className="bg-white/10 border-[#00adb5]/50 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="text-white">{isArabic ? 'تاريخ السريان' : 'Effective Date'}</Label>
                <Input
                  type="date"
                  className="bg-white/10 border-[#00adb5]/50 text-white"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleGeneratePolicy}
                  disabled={generating}
                  className="glass-button text-white flex-1"
                >
                  {generating ? (
                    isArabic ? 'جاري الإنشاء...' : 'Generating...'
                  ) : (
                    isArabic ? 'إنشاء السياسة' : 'Generate Policy'
                  )}
                </Button>
                <Button
                  onClick={() => showSection('ecc-v1')}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* V1 Controls Section */}
        {currentSection === 'v1-controls' && (
          <Card className="glass text-white border-0 p-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                {isArabic ? 'ضوابط NCA ECC V1' : 'NCA ECC V1 Controls'}
              </CardTitle>
              <p className="text-gray-300">
                {isArabic 
                  ? 'متوافق مع تقييم السيراميك السعودي ومبادئ NCA التوجيهية'
                  : 'Aligned with Saudi Ceramics Assessment & NCA Guidelines'
                }
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-white/5 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-3 text-[#00adb5]">{isArabic ? 'الضابط' : 'Control'}</th>
                      <th className="p-3 text-[#00adb5]">{isArabic ? 'الوصف' : 'Description'}</th>
                      <th className="p-3 text-[#00adb5]">{isArabic ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {controls.map((control) => (
                      <tr key={control.id} className="border-b border-white/10">
                        <td className="p-3 font-mono">{control.id}</td>
                        <td className="p-3">{control.description}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            control.status === 'Implemented' 
                              ? 'bg-green-600/30 text-green-300'
                              : control.status === 'Partially Implemented'
                              ? 'bg-yellow-600/30 text-yellow-300'
                              : 'bg-red-600/30 text-red-300'
                          }`}>
                            {control.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button
                onClick={() => showSection('ecc-v1')}
                className="bg-gray-600 hover:bg-gray-700 text-white mt-6"
              >
                {isArabic ? 'رجوع' : 'Back'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-400 text-sm space-y-2">
          <p>
            {isArabic 
              ? 'ميتا ووركس – منصة الامتثال لـ NCA ECC V1 و V2 | 2025'
              : 'Metaworks – NCA ECC V1 & V2 Compliance Platform | 2025'
            }
          </p>
          <p>
            {isArabic
              ? 'متوافق مع دليل تنفيذ NCA ECC وتقييم السيراميك السعودي'
              : 'Aligned with NCA ECC Implementation Guide & Saudi Ceramics Assessment'
            }
          </p>
        </footer>
      </div>
    </div>
  );
}