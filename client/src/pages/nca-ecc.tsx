import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, ChevronRight, FileText, Loader2, ListChecks } from "lucide-react";
import { useState } from "react";
import { ncaEccDomains, ncaEccStructure } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function NcaEcc() {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user ID for demonstration - replace with actual user ID from auth
  const userId = 1;

  async function generateDomainPolicies(domain: string, subdomain: string) {
    setGenerating(true);
    try {
      const policy = {
        userId,
        domain,
        subdomain,
        generatedAt: new Date().toISOString(),
      };

      await apiRequest('POST', '/api/policies', policy);

      toast({
        title: "Policies Generated",
        description: `Generated policies for ${subdomain} under ${domain}`,
      });

      // Invalidate policies cache to refresh the list
      await queryClient.invalidateQueries({ queryKey: [`/api/policies/${userId}`] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate policies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">NCA ECC Framework</h1>
        </div>
      </div>

      <div className="grid gap-6">
        {ncaEccDomains.map((domain) => (
          <Card key={domain}>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-6 h-6" />
                {domain}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(ncaEccStructure[domain]).map(([subdomain, controls]) => (
                  <AccordionItem key={subdomain} value={subdomain}>
                    <AccordionTrigger className="text-lg">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4" />
                        {subdomain}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <ListChecks className="w-4 h-4" />
                            Controls
                          </h4>
                          <ul className="pl-6 space-y-2 text-sm text-muted-foreground">
                            {(controls as string[]).map((control: string) => (
                              <li key={control} className="list-disc">
                                {control}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => generateDomainPolicies(domain, subdomain)}
                            disabled={generating}
                            className="w-full"
                          >
                            {generating ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating Policies...
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 mr-2" />
                                Generate Policies & Procedures
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}