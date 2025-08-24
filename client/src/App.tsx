import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar-context";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import Layout from "@/components/layout";

// Import pages
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Assessment from "@/pages/assessment";
import Policies from "@/pages/policies";
import NcaEcc from "@/pages/nca-ecc";
import Assistant from "@/pages/assistant";
import MetaworksCompliance from "@/pages/metaworks-compliance";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
          <Route>
            <NotFound />
          </Route>
        </Switch>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}