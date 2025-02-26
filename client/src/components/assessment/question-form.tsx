import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { domains } from "@shared/schema";

const questions = [
  {
    id: "q1",
    domain: "Access Control",
    text: "Do you have a formal access control policy?",
  },
  {
    id: "q2",
    domain: "Data Protection",
    text: "Is sensitive data encrypted at rest?",
  },
  // Add more questions as needed
];

const formSchema = z.object({
  answers: z.record(z.enum(["yes", "no", "partial"])),
});

export default function QuestionForm() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {},
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "Assessment submitted",
      description: "Your responses have been recorded.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {questions.map((question) => (
          <FormField
            key={question.id}
            control={form.control}
            name={`answers.${question.id}`}
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>
                  <span className="text-sm font-medium text-primary">
                    {question.domain}
                  </span>
                  <p>{question.text}</p>
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
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="partial" />
                      </FormControl>
                      <FormLabel className="font-normal">Partial</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">Submit Assessment</Button>
      </form>
    </Form>
  );
}
