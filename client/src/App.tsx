import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar-context";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";

// Import pages
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Assessment from "@/pages/assessment";
import Policies from "@/pages/policies";
import NcaEcc from "@/pages/nca-ecc";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Switch>
          <Route path="/">
            <Landing />
          </Route>
          <Route path="/dashboard">
            <div className="flex h-screen bg-background">
              <Sidebar />
              <main className="flex-1 p-8 overflow-auto">
                <Dashboard />
              </main>
            </div>
          </Route>
          <Route path="/assessment">
            <div className="flex h-screen bg-background">
              <Sidebar />
              <main className="flex-1 p-8 overflow-auto">
                <Assessment />
              </main>
            </div>
          </Route>
          <Route path="/policies">
            <div className="flex h-screen bg-background">
              <Sidebar />
              <main className="flex-1 p-8 overflow-auto">
                <Policies />
              </main>
            </div>
          </Route>
          <Route path="/nca-ecc">
            <div className="flex h-screen bg-background">
              <Sidebar />
              <main className="flex-1 p-8 overflow-auto">
                <NcaEcc />
              </main>
            </div>
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