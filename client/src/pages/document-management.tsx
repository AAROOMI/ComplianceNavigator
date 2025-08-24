import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentLifecycleManager from "@/components/document/document-lifecycle-manager";
import PolicyTemplateGenerator from "@/components/document/policy-template-generator";

export default function DocumentManagement() {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="lifecycle" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lifecycle">Document Lifecycle</TabsTrigger>
          <TabsTrigger value="templates">Policy Templates (80+)</TabsTrigger>
        </TabsList>

        <TabsContent value="lifecycle">
          <DocumentLifecycleManager />
        </TabsContent>

        <TabsContent value="templates">
          <PolicyTemplateGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}