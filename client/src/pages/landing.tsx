import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, QrCode, FileSignature, FileText, Zap, BarChart3, Scan, Download, Eye, Users, Clock, Archive } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00adb5] to-[#00c896] bg-clip-text text-transparent">
                ComplianceNavigator
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
                Comprehensive
                <span className="block bg-gradient-to-r from-[#00adb5] to-[#00c896] bg-clip-text text-transparent">
                  Cybersecurity Compliance
                </span>
                <span className="block text-4xl md:text-5xl">Document Management</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Complete document lifecycle management with QR codes, digital signatures, and comprehensive 
                tracking for multi-framework compliance including NCA ECC, SAMA CSF, ISO 27001, NIST CSF and more.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00adb5] to-[#00c896] hover:from-[#009ba3] to-[#00b085] text-lg px-8 py-6"
                data-testid="button-hero-get-started"
              >
                <Zap className="mr-2 w-5 h-5" />
                Explore Features
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2"
                data-testid="button-hero-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Complete Document Lifecycle Management
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From creation to implementation with automated identification, tracking, and audit evidence collection
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">QR Code & Barcode Generation</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Automatic generation of unique QR codes and barcodes for every document with framework mapping and implementation tracking
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <FileSignature className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Digital Signatures</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Management approval and authorization with secure digital signature capabilities maintaining QR codes throughout
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Framework Compliance</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Support for NCA ECC v1/v2, SAMA CSF, SAMA PDPL, ISO 27001, NIST CSF, ISO 22301, ISO 31000, ISO 38000, ISO 38500
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Downloadable Copies</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Multiple format downloads (PDF, Word) with QR codes and barcodes retained for continued tracking
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track document status and implementation progress across all frameworks with evidence collection
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Audit Evidence & Reporting</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive audit trails and framework-specific dashboards with cross-framework correlation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Document Lifecycle Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Complete Document Lifecycle
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From creation through implementation with automated identification and monitoring systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Creation & Version Control</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Framework-specific templates with automatic QR code and barcode generation
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Review & Approval</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Digital signature workflows tailored to each compliance framework
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-full flex items-center justify-center mx-auto">
                <Scan className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Implementation Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                QR/Barcode tracking mapped to specific framework requirements
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-full flex items-center justify-center mx-auto">
                <Archive className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Archive & Retention</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Regulatory compliant retention management with audit evidence preservation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Frameworks Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Comprehensive Framework Support
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Built to support multiple compliance frameworks simultaneously with cross-framework correlation
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">Saudi Regulations</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>• NCA ECC v1 & v2</p>
                  <p>• SAMA CSF</p>
                  <p>• SAMA PDPL</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">International Standards</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>• ISO 27001</p>
                  <p>• ISO 22301</p>
                  <p>• ISO 31000</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">Global Frameworks</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>• NIST CSF</p>
                  <p>• ISO 38000</p>
                  <p>• ISO 38500</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              Transform Your Compliance Management
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              ComplianceNavigator provides comprehensive document lifecycle management 
              with QR codes, digital signatures, and multi-framework compliance tracking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00adb5] to-[#00c896] hover:from-[#009ba3] to-[#00b085] text-lg px-8 py-6"
                data-testid="button-cta-contact"
              >
                <Shield className="mr-2 w-5 h-5" />
                Contact Us
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2"
                data-testid="button-cta-demo"
              >
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#00adb5] to-[#00c896] bg-clip-text text-transparent">
                ComplianceNavigator
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive Cybersecurity Compliance Document Management Platform
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              © 2024 ComplianceNavigator. Complete document lifecycle management with QR codes, digital signatures, and multi-framework compliance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}