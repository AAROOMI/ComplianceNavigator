import QuestionForm from "@/components/assessment/question-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Assessment() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Risk Assessment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Questionnaire</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionForm />
        </CardContent>
      </Card>
    </div>
  );
}
