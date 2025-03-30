import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ncaEccDomains, ncaEccStructure } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Enhanced questions with risk weights and domain categorization
const questions = [
  {
    id: "g1",
    domain: "Governance",
    text: "Do you have a documented cybersecurity strategy aligned with business objectives?",
    weight: 3,
    impact: "High",
  },
  {
    id: "g2",
    domain: "Governance",
    text: "Is there a formal risk assessment methodology in place?",
    weight: 3,
    impact: "High",
  },
  {
    id: "cd1",
    domain: "Cybersecurity Defence",
    text: "Is multi-factor authentication implemented for privileged accounts?",
    weight: 3,
    impact: "High",
  },
  {
    id: "cd2",
    domain: "Cybersecurity Defence",
    text: "Are encryption standards defined and implemented?",
    weight: 3,
    impact: "High",
  },
  {
    id: "cr1",
    domain: "Cybersecurity Resilience",
    text: "Is there a tested business continuity plan?",
    weight: 3,
    impact: "High",
  },
  {
    id: "cr2",
    domain: "Cybersecurity Resilience",
    text: "Do you have an incident response plan?",
    weight: 2,
    impact: "Medium",
  },
  {
    id: "cc1",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud service providers assessed for security compliance?",
    weight: 3,
    impact: "High",
  },
  {
    id: "ics1",
    domain: "Industrial Control System (ICS)",
    text: "Is there network segmentation between IT and OT networks?",
    weight: 3,
    impact: "High",
  }
];

const formSchema = z.object({
  answers: z.record(z.enum(["yes", "partial", "no"])),
});

interface QuestionFormProps {
  onComplete?: (assessmentId: number) => void;
}

export default function QuestionForm({ onComplete }: QuestionFormProps) {
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
      let lastAssessmentId: number = 0;

      // Save assessment results
      for (const result of results) {
        const assessment = await apiRequest<{ id: number }>('POST', '/api/assessments', {
          userId: 1, // TODO: Replace with actual user ID
          domain: result.domain,
          score: result.score,
          completedAt: new Date().toISOString()
        });
        if (assessment && 'id' in assessment) {
          lastAssessmentId = assessment.id;
        }
      }

      toast({
        title: "Assessment Complete",
        description: "Your risk assessment has been analyzed and saved.",
      });

      // Call the onComplete callback if provided
      if (onComplete && lastAssessmentId) {
        onComplete(lastAssessmentId);
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
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
        {ncaEccDomains.map(domain => (
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