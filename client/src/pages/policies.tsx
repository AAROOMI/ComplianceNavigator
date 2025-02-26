import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { domains } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function Policies() {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  // Mock user ID for demonstration - replace with actual user ID from auth
  const userId = 1;

  const { data: policies = [] } = useQuery({
    queryKey: [`/api/policies/${userId}`],
  });

  async function generatePolicy(domain: string) {
    setGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGenerating(false);

    toast({
      title: "Policy Generated",
      description: `New ${domain} policy has been created.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Policy Generator</h1>
      </div>

      {/* Generated Policies List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {policies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No policies generated yet.</p>
            ) : (
              <div className="space-y-4">
                {policies.map((policy) => (
                  <div key={policy.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <h3 className="font-medium">{policy.domain}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{policy.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Generated on: {new Date(policy.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Policy Generation Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {domains.map((domain) => (
          <Card key={domain}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {domain}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px] mb-4">
                <p className="text-sm text-muted-foreground">
                  Generate a customized {domain.toLowerCase()} policy aligned with NCA ECC requirements and your organization's needs.
                </p>
              </ScrollArea>
              <Separator className="my-4" />
              <Button
                onClick={() => generatePolicy(domain)}
                disabled={generating}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Policy"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}