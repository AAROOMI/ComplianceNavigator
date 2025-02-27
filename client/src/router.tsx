
import React from 'react';
import { Switch, Route } from 'wouter';
import Dashboard from '@/pages/dashboard';
import Assessment from '@/pages/assessment';
import Policies from '@/pages/policies';
import NcaEcc from '@/pages/nca-ecc';
import Assistant from '@/pages/assistant';
import Landing from '@/pages/landing';
import NotFound from '@/pages/not-found';
import Sidebar from '@/components/layout/sidebar';

const Router: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/assessment" component={Assessment} />
          <Route path="/policies" component={Policies} />
          <Route path="/nca-ecc" component={NcaEcc} />
          <Route path="/assistant" component={Assistant} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
};

export default Router;
