import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { domains } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Enhanced questions with risk weights and domain categorization
const questions = [
  {
    id: "ac1",
    domain: "Access Control",
    text: "Do you have a formal access control policy with role-based permissions?",
    weight: 3,
    impact: "High",
  },
  {
    id: "ac2",
    domain: "Access Control",
    text: "Is multi-factor authentication implemented for privileged accounts?",
    weight: 3,
    impact: "High",
  },
  {
    id: "dp1",
    domain: "Data Protection",
    text: "Is sensitive data encrypted at rest using industry-standard algorithms?",
    weight: 3,
    impact: "High",
  },
  {
    id: "dp2",
    domain: "Data Protection",
    text: "Are regular data backup and recovery tests performed?",
    weight: 2,
    impact: "Medium",
  },
  {
    id: "ns1",
    domain: "Network Security",
    text: "Is network traffic monitored and logged continuously?",
    weight: 3,
    impact: "High",
  },
  {
    id: "ir1",
    domain: "Incident Response",
    text: "Do you have a documented incident response plan?",
    weight: 2,
    impact: "Medium",
  },
  {
    id: "bc1",
    domain: "Business Continuity",
    text: "Is there a tested business continuity plan in place?",
    weight: 2,
    impact: "Medium",
  }
];

const formSchema = z.object({
  answers: z.record(z.enum(["yes", "partial", "no"])),
});

export default function QuestionForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {},
    },
  });

  async function analyzeRisks(answers: Record<string, string>) {
    // Calculate risk scores for each domain
    const domainScores = new Map<string, { score: number, total: number }>();

    questions.forEach(q => {
      const answer = answers[q.id];
      const score = answer === "yes" ? q.weight : answer === "partial" ? q.weight / 2 : 0;

      if (!domainScores.has(q.domain)) {
        domainScores.set(q.domain, { score: 0, total: 0 });
      }
      const current = domainScores.get(q.domain)!;
      current.score += score;
      current.total += q.weight;
    });

    // Convert scores to percentages
    const results = Array.from(domainScores.entries()).map(([domain, { score, total }]) => ({
      domain,
      score: Math.round((score / total) * 100),
      riskLevel: score / total < 0.6 ? "High" : score / total < 0.8 ? "Medium" : "Low"
    }));

    return results;
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const results = await analyzeRisks(data.answers);

      // Save assessment results
      for (const result of results) {
        await apiRequest('POST', '/api/assessments', {
          userId: 1, // TODO: Replace with actual user ID
          domain: result.domain,
          score: result.score,
          completedAt: new Date().toISOString()
        });
      }

      toast({
        title: "Assessment Complete",
        description: "Your risk assessment has been analyzed and saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment results.",
        variant: "destructive"
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {domains.map(domain => (
          <Card key={domain} className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">{domain}</h3>
              <div className="space-y-4">
                {questions
                  .filter(q => q.domain === domain)
                  .map(question => (
                    <FormField
                      key={question.id}
                      control={form.control}
                      name={`answers.${question.id}`}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              <span>{question.text}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                question.impact === "High" 
                                  ? "bg-red-100 text-red-700" 
                                  : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {question.impact} Impact
                              </span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="partial" />
                                </FormControl>
                                <FormLabel className="font-normal">Partial</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="font-normal">No</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
        <Button type="submit" className="w-full">Submit Assessment</Button>
      </form>
    </Form>
  );
}