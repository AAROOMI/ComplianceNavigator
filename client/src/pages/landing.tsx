import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, BarChart3, FileText, CheckCircle2, Zap, Star, ArrowRight } from "lucide-react";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";

export default function Landing() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'landing'>('landing');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // If user is authenticated, show success message
  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome to MetaWorks, {currentUser.firstName}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              You're now logged in as {currentUser.role}
            </p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-[#00adb5] to-[#00c896] hover:from-[#009ba3] to-[#00b085]"
            data-testid="button-continue-to-app"
          >
            Continue to Dashboard
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Show authentication forms
  if (authMode === 'login' || authMode === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {authMode === 'login' ? (
            <LoginForm
              onLoginSuccess={(user) => setCurrentUser(user)}
              onSignupRequest={() => setAuthMode('signup')}
            />
          ) : (
            <SignupForm
              onSignupSuccess={(user) => setCurrentUser(user)}
              onLoginRequest={() => setAuthMode('login')}
            />
          )}
          
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => setAuthMode('landing')}
              className="text-muted-foreground hover:text-[#00adb5]"
              data-testid="button-back-to-landing"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00adb5] to-[#00c896] bg-clip-text text-transparent">
                MetaWorks
              </h1>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setAuthMode('login')}
                data-testid="button-header-login"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setAuthMode('signup')}
                className="bg-gradient-to-r from-[#00adb5] to-[#00c896] hover:from-[#009ba3] to-[#00b085]"
                data-testid="button-header-signup"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
                Cybersecurity
                <span className="block bg-gradient-to-r from-[#00adb5] to-[#00c896] bg-clip-text text-transparent">
                  Compliance Platform
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Streamline your compliance journey with AI-powered policy management, 
                interactive assessments, and comprehensive risk monitoring.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setAuthMode('signup')}
                className="bg-gradient-to-r from-[#00adb5] to-[#00c896] hover:from-[#009ba3] to-[#00b085] text-lg px-8 py-6"
                data-testid="button-hero-get-started"
              >
                <Zap className="mr-2 w-5 h-5" />
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setAuthMode('login')}
                className="text-lg px-8 py-6 border-2"
                data-testid="button-hero-sign-in"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Comprehensive Compliance Management
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to achieve and maintain cybersecurity compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Policies</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate comprehensive security policies instantly with our AI assistant
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Interactive assessments with real-time scoring and recommendations
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">User Management</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Role-based access control with comprehensive user administration
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Document Management</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete CRUD operations with QR codes and barcode tracking
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">NCA ECC Compliance</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Built specifically for National Cybersecurity Authority frameworks
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00adb5] to-[#00c896] rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Excel Integration</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Import and export compliance data seamlessly with Excel formats
                </p>
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
              Ready to Transform Your Compliance?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join organizations worldwide who trust MetaWorks for their cybersecurity compliance needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setAuthMode('signup')}
                className="bg-gradient-to-r from-[#00adb5] to-[#00c896] hover:from-[#009ba3] to-[#00b085] text-lg px-8 py-6"
                data-testid="button-cta-get-started"
              >
                <Zap className="mr-2 w-5 h-5" />
                Start Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setAuthMode('login')}
                className="text-lg px-8 py-6 border-2"
                data-testid="button-cta-sign-in"
              >
                Sign In Now
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
                MetaWorks
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive Cybersecurity Compliance Platform
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              © 2024 MetaWorks. Building secure digital futures.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}