import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ComplianceRiskOverview from "@/components/dashboard/compliance-risk-overview";
import NCADomainMatrix from "@/components/dashboard/nca-domain-matrix";
import ApplicationMetrics from "@/components/dashboard/application-metrics";
import VulnerabilitySummary from "@/components/dashboard/vulnerability-summary";
import OnboardingExperience from "@/components/ciso/onboarding-experience";
import ITManagerOnboarding from "@/components/ciso/it-manager-onboarding";
import CTOOnboarding from "@/components/ciso/cto-onboarding";
import SysAdminOnboarding from "@/components/ciso/sysadmin-onboarding";
import { Shield, Bot, FileBarChart, Settings, Rocket, Monitor, Users, Database, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const userId = 1; // TODO: Replace with actual user ID when user authentication is implemented
  
  // Role-specific onboarding states
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showITManagerOnboarding, setShowITManagerOnboarding] = useState(false);
  const [showCTOOnboarding, setShowCTOOnboarding] = useState(false);
  const [showSysAdminOnboarding, setShowSysAdminOnboarding] = useState(false);

  // Role onboarding functions
  const startOnboardingTour = () => setShowOnboarding(true);
  const startITManagerTour = () => setShowITManagerOnboarding(true);
  const startCTOTour = () => setShowCTOOnboarding(true);
  const startSysAdminTour = () => setShowSysAdminOnboarding(true);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('dashboard-ciso-onboarding-completed', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('dashboard-ciso-onboarding-completed', 'true');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compliance Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/assessment">
            <Button variant="outline" className="flex items-center gap-2">
              <FileBarChart className="w-4 h-4" />
              Risk Assessment
            </Button>
          </Link>
          <Link href="/assistant">
            <Button variant="outline" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Assistant
            </Button>
          </Link>
          <Link href="/nca-ecc">
            <Button className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              NCA ECC Framework
            </Button>
          </Link>
        </div>
      </div>

      {/* Role-Specific Onboarding Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Role-Based Onboarding
          </CardTitle>
          <CardDescription>
            Get started with guided tours tailored to your leadership role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={startOnboardingTour}
              className="flex items-center gap-2"
              data-testid="button-dashboard-ciso-tour"
            >
              <Shield className="w-4 h-4" />
              CISO Tour
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={startITManagerTour}
              className="flex items-center gap-2"
              data-testid="button-dashboard-it-manager-tour"
            >
              <Settings className="w-4 h-4" />
              IT Manager Tour
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={startCTOTour}
              className="flex items-center gap-2"
              data-testid="button-dashboard-cto-tour"
            >
              <Rocket className="w-4 h-4" />
              CTO Tour
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={startSysAdminTour}
              className="flex items-center gap-2"
              data-testid="button-dashboard-sysadmin-tour"
            >
              <Monitor className="w-4 h-4" />
              System Administrator Tour
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Compliance Risk Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Compliance Risk Overview
            </CardTitle>
            <CardDescription>Real-time compliance scoring based on assessments and vulnerabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <ComplianceRiskOverview userId={userId} />
          </CardContent>
        </Card>

        {/* NCA Domain Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              NCA ECC Domain Matrix
            </CardTitle>
            <CardDescription>Domain-specific compliance tracking across the NCA framework</CardDescription>
          </CardHeader>
          <CardContent>
            <NCADomainMatrix userId={userId} />
          </CardContent>
        </Card>

        {/* Application Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Platform Metrics
            </CardTitle>
            <CardDescription>Application feature utilization and risk library coverage</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationMetrics userId={userId} />
          </CardContent>
        </Card>
      </div>

      {/* Vulnerability Summary Section */}
      <VulnerabilitySummary userId={userId} />

      {/* Role-Specific Onboarding Components */}
      <OnboardingExperience
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />

      <ITManagerOnboarding
        isVisible={showITManagerOnboarding}
        onComplete={() => {
          setShowITManagerOnboarding(false);
          localStorage.setItem('dashboard-it-manager-onboarding-completed', 'true');
        }}
        onSkip={() => {
          setShowITManagerOnboarding(false);
          localStorage.setItem('dashboard-it-manager-onboarding-completed', 'true');
        }}
      />

      <CTOOnboarding
        isVisible={showCTOOnboarding}
        onComplete={() => {
          setShowCTOOnboarding(false);
          localStorage.setItem('dashboard-cto-onboarding-completed', 'true');
        }}
        onSkip={() => {
          setShowCTOOnboarding(false);
          localStorage.setItem('dashboard-cto-onboarding-completed', 'true');
        }}
      />

      <SysAdminOnboarding
        isVisible={showSysAdminOnboarding}
        onComplete={() => {
          setShowSysAdminOnboarding(false);
          localStorage.setItem('dashboard-sysadmin-onboarding-completed', 'true');
        }}
        onSkip={() => {
          setShowSysAdminOnboarding(false);
          localStorage.setItem('dashboard-sysadmin-onboarding-completed', 'true');
        }}
      />
    </div>
  );
}