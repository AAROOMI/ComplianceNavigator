
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
import React from "react";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "./components/ui/sidebar-context";
import { Toaster } from "./components/ui/toaster";
import "./index.css";

// Import your components here
import Sidebar from "./components/ui/sidebar";
// import other components as needed

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex h-screen">
          <Switch>
            <Route path="/">
              <Sidebar />
              {/* Your main content goes here */}
              <div className="flex-1 p-4">
                <h1 className="text-2xl font-bold">Welcome to your application</h1>
              </div>
            </Route>
            {/* Add more routes as needed */}
          </Switch>
        </div>
      </SidebarProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
