
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComplianceChat from "@/components/ai-assistant/compliance-chat";
import { Bot, BookOpen } from "lucide-react";

export default function Assistant() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compliance Assistant</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ComplianceChat />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Quick Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">Try asking questions about:</p>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>NCA ECC framework requirements</li>
                  <li>Compliance best practices</li>
                  <li>Security policy recommendations</li>
                  <li>Risk management strategies</li>
                  <li>Governance implementation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Assistant Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">The compliance assistant can:</p>
                <ul className="text-sm space-y-2 list-disc pl-5">
                  <li>Explain regulatory requirements</li>
                  <li>Suggest policy improvements</li>
                  <li>Provide compliance advice</li>
                  <li>Help with audit preparation</li>
                  <li>Generate policy templates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
