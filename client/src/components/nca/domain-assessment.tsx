import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Clock,
  Users,
  Target,
  ListChecks,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { ncaEccStructure } from "@shared/schema";

interface AssessmentQuestion {
  id: string;
  question: string;
  type: "yes_no" | "scale" | "text";
  options?: string[];
  weight: number;
}

interface DomainAssessmentProps {
  domainName: string;
  onComplete?: (results: any) => void;
  readonly?: boolean;
}

const generateDomainQuestions = (domainName: string): AssessmentQuestion[] => {
  const domainData = ncaEccStructure[domainName as keyof typeof ncaEccStructure] as any;
  
  const baseQuestions: AssessmentQuestion[] = [
    {
      id: "governance",
      question: "Does your organization have established governance structures for this domain?",
      type: "yes_no",
      weight: 3
    },
    {
      id: "policies", 
      question: "Are relevant policies and procedures documented and approved for this domain?",
      type: "yes_no",
      weight: 3
    },
    {
      id: "implementation",
      question: "What is the current implementation level of controls in this domain?",
      type: "scale",
      options: ["Not Started", "Planning", "Partially Implemented", "Fully Implemented", "Optimized"],
      weight: 4
    },
    {
      id: "monitoring",
      question: "How would you rate the current monitoring and compliance tracking for this domain?",
      type: "scale", 
      options: ["No Monitoring", "Basic", "Good", "Comprehensive", "Advanced"],
      weight: 3
    },
    {
      id: "resources",
      question: "Are adequate resources (personnel, budget, tools) allocated for this domain?",
      type: "yes_no",
      weight: 2
    }
  ];

  // Add domain-specific questions
  const specificQuestions = domainData.requirements.slice(0, 3).map((req: string, index: number) => ({
    id: `specific_${index}`,
    question: `Is the following requirement addressed: ${req}?`,
    type: "yes_no" as const,
    weight: 3
  }));

  return [...baseQuestions, ...specificQuestions];
};

export default function DomainAssessment({ 
  domainName, 
  onComplete,
  readonly = false 
}: DomainAssessmentProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState<'overview' | 'assessment' | 'results'>('overview');
  const [notes, setNotes] = useState('');

  const domainData = ncaEccStructure[domainName as keyof typeof ncaEccStructure] as any;
  const questions = generateDomainQuestions(domainName);
  
  const answeredQuestions = Object.keys(responses).length;
  const totalQuestions = questions.length;
  const completionPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      maxScore += question.weight * (question.type === "scale" && question.options ? question.options.length - 1 : 1);
      
      const response = responses[question.id];
      if (response !== undefined) {
        if (question.type === "yes_no") {
          totalScore += response === "yes" ? question.weight : 0;
        } else if (question.type === "scale" && question.options) {
          const optionIndex = question.options.findIndex(opt => opt === response);
          totalScore += optionIndex * question.weight;
        }
      }
    });

    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-100" };
    if (score >= 60) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (score >= 40) return { level: "Needs Improvement", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    return { level: "Critical", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleComplete = () => {
    const score = calculateScore();
    const results = {
      domainName,
      score,
      responses,
      notes,
      completedAt: new Date().toISOString()
    };
    
    onComplete?.(results);
    setCurrentSection('results');
  };

  const renderQuestion = (question: AssessmentQuestion, index: number) => (
    <Card key={question.id} className="mb-4">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <h4 className="font-medium pr-4">
              {index + 1}. {question.question}
            </h4>
            <Badge variant="outline" className="text-xs">
              Weight: {question.weight}
            </Badge>
          </div>

          {question.type === "yes_no" && (
            <RadioGroup
              value={responses[question.id] || ""}
              onValueChange={(value) => handleResponseChange(question.id, value)}
              disabled={readonly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                <Label htmlFor={`${question.id}-yes`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`${question.id}-no`} />
                <Label htmlFor={`${question.id}-no`}>No</Label>
              </div>
            </RadioGroup>
          )}

          {question.type === "scale" && question.options && (
            <RadioGroup
              value={responses[question.id] || ""}
              onValueChange={(value) => handleResponseChange(question.id, value)}
              disabled={readonly}
            >
              {question.options.map((option, optIndex) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                  <Label htmlFor={`${question.id}-${optIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (currentSection === 'results') {
    const score = calculateScore();
    const scoreInfo = getScoreLevel(score);

    return (
      <div className="space-y-6" data-testid="assessment-results">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Assessment Results: {domainName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${scoreInfo.bgColor}`}>
                  <span className={`text-2xl font-bold ${scoreInfo.color}`}>{score}%</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{scoreInfo.level}</h3>
                  <p className="text-muted-foreground">Compliance Level</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {Object.values(responses).filter(r => r === "yes" || (typeof r === 'string' && ["Fully Implemented", "Optimized", "Advanced", "Comprehensive"].includes(r))).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Strong Areas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {Object.values(responses).filter(r => typeof r === 'string' && ["Planning", "Partially Implemented", "Good", "Basic"].includes(r)).length}
                  </p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {Object.values(responses).filter(r => r === "no" || (typeof r === 'string' && ["Not Started", "No Monitoring"].includes(r))).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Needs Attention</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {score < 60 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200">Immediate Action Required</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      This domain requires immediate attention to meet NCA ECC compliance requirements.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Next Steps:</h4>
                <ul className="space-y-2 text-sm">
                  {domainData.policies.map((policy: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span>Develop and implement: {policy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button onClick={() => setCurrentSection('overview')} variant="outline">
            Back to Overview
          </Button>
          <Button onClick={() => setCurrentSection('assessment')} variant="outline">
            Review Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="domain-assessment">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {domainName}
              </CardTitle>
              <CardDescription>
                NCA ECC Domain Assessment
              </CardDescription>
            </div>
            {currentSection === 'assessment' && (
              <Badge variant="outline">
                {answeredQuestions} of {totalQuestions} completed
              </Badge>
            )}
          </div>
          {currentSection === 'assessment' && (
            <Progress value={completionPercentage} className="mt-4" />
          )}
        </CardHeader>
      </Card>

      <Tabs value={currentSection} onValueChange={(value) => setCurrentSection(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <ListChecks className="w-4 h-4" />
            Assessment
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            className="flex items-center gap-2"
            disabled={completionPercentage < 100}
          >
            <Target className="w-4 h-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {domainData.requirements.map((req: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {domainData.workflow.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-300">{index + 1}</span>
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Policies & Procedures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {domainData.policies.map((policy: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{policy}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setCurrentSection('assessment')}>
              Start Assessment
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Questions</CardTitle>
              <CardDescription>
                Answer all questions to receive your compliance score for this domain
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {questions.map((question, index) => renderQuestion(question, index))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional context, challenges, or observations about this domain..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
                disabled={readonly}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentSection('overview')}>
              Back to Overview
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={completionPercentage < 100}
            >
              Complete Assessment
              <CheckCircle2 className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}