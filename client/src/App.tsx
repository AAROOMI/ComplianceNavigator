
import { Router, Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { SidebarProvider } from "./components/ui/sidebar-context";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Router>
          <div className="flex h-screen">
            <Switch>
              <Route path="/">
                <div>Home Page</div>
              </Route>
            </Switch>
          </div>
        </Router>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
