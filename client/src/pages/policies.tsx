import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { domains } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Policies() {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

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
