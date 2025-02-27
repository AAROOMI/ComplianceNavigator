import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Assessment from "@/pages/assessment";
import Policies from "@/pages/policies";
import NcaEcc from "@/pages/nca-ecc";
import Assistant from "@/pages/assistant";
import Landing from "@/pages/landing";
import Sidebar from "@/components/layout/sidebar";
import { SidebarProvider } from "./components/ui/sidebar-context"; // Added import

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
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
      <Route path="/assistant">
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 p-8 overflow-auto">
            <Assistant />
          </main>
        </div>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <SidebarProvider> {/* Added SidebarProvider */}
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </SidebarProvider> {/* Added closing tag */}
  );
}

export default App;