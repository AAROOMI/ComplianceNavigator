import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar-context";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { queryClient } from "@/lib/queryClient";
import Layout from "@/components/layout";
import "@/lib/i18n";

// Import pages
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Assessment from "@/pages/assessment";
import Policies from "@/pages/policies";
import NcaEcc from "@/pages/nca-ecc";
import Assistant from "@/pages/assistant";
import MetaworksCompliance from "@/pages/metaworks-compliance";
import NFRMRiskManagement from "@/pages/nfrm-risk-management";
import CisoPolicies from "@/pages/ciso-policies";
import RiskRegisterPage from "@/pages/risk-register";
import UserManagement from "@/pages/user-management";
import RiskAssessment from "@/pages/risk-assessment";
import UserAwareness from "@/pages/user-awareness";
import SecurityQuizzes from "@/pages/security-quizzes";
import TrainingMaterials from "@/pages/training-materials";
import CompetencyBadges from "@/pages/competency-badges";
import ITManagerPortal from "@/pages/it-manager";
import CTODashboard from "@/pages/cto-dashboard";
import SysAdminTools from "@/pages/sysadmin-tools";
import CISOPortal from "@/pages/ciso-portal";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <SidebarProvider>
            <Switch>
          <Route path="/">
            <Landing />
          </Route>
          <Route path="/dashboard">
            <Layout>
              <Dashboard />
            </Layout>
          </Route>
          <Route path="/assessment">
            <Layout>
              <Assessment />
            </Layout>
          </Route>
          <Route path="/policies">
            <Layout>
              <Policies />
            </Layout>
          </Route>
          <Route path="/nca-ecc">
            <Layout>
              <NcaEcc />
            </Layout>
          </Route>
          <Route path="/assistant">
            <Layout>
              <Assistant />
            </Layout>
          </Route>
          <Route path="/metaworks">
            <MetaworksCompliance />
          </Route>
          <Route path="/nfrm">
            <Layout>
              <NFRMRiskManagement />
            </Layout>
          </Route>
          <Route path="/ciso-policies">
            <Layout>
              <CisoPolicies />
            </Layout>
          </Route>
          <Route path="/risk-register">
            <Layout>
              <RiskRegisterPage />
            </Layout>
          </Route>
          <Route path="/user-management">
            <Layout>
              <UserManagement />
            </Layout>
          </Route>
          <Route path="/risk-assessment">
            <Layout>
              <RiskAssessment />
            </Layout>
          </Route>
          <Route path="/user-awareness">
            <Layout>
              <UserAwareness />
            </Layout>
          </Route>
          <Route path="/security-quizzes">
            <Layout>
              <SecurityQuizzes />
            </Layout>
          </Route>
          <Route path="/training-materials">
            <Layout>
              <TrainingMaterials />
            </Layout>
          </Route>
          <Route path="/competency-badges">
            <Layout>
              <CompetencyBadges />
            </Layout>
          </Route>
          <Route path="/it-manager">
            <Layout>
              <ITManagerPortal />
            </Layout>
          </Route>
          <Route path="/cto-dashboard">
            <Layout>
              <CTODashboard />
            </Layout>
          </Route>
          <Route path="/sysadmin-tools">
            <Layout>
              <SysAdminTools />
            </Layout>
          </Route>
          <Route path="/ciso-portal">
            <Layout>
              <CISOPortal />
            </Layout>
          </Route>
          <Route>
            <NotFound />
          </Route>
            </Switch>
            <Toaster />
          </SidebarProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}