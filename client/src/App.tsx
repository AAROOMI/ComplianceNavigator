
import { Router, Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { SidebarProvider } from "@/components/ui/sidebar-context";
import { Sidebar } from "@/components/ui/sidebar";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Router>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1">
              <Switch>
                <Route path="/">
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome to the Application</h1>
                    <p>Your application is now running successfully on port 3000.</p>
                  </div>
                </Route>
                <Route>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
                    <p>The page you are looking for does not exist.</p>
                  </div>
                </Route>
              </Switch>
            </div>
          </div>
        </Router>
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
