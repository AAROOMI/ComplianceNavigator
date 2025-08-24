import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, Clock, Target, TrendingUp } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RiskAssessmentQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

interface AssessmentResponse {
  questionId: number;
  selectedAnswer: number;
  notes: string;
}

export default function RiskAssessment() {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, AssessmentResponse>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Sample risk assessment questions based on risk register
  const riskQuestions: RiskAssessmentQuestion[] = [
    {
      id: 1,
      category: "Data Protection",
      question: "What is the most critical risk when handling personal data without proper encryption?",
      options: [
        "Slower system performance",
        "Data breach exposing sensitive information",
        "Increased storage costs",
        "Reduced user experience"
      ],
      correctAnswer: 1,
      explanation: "Unencrypted personal data presents a critical risk of data breaches, which can result in regulatory fines, legal liability, and loss of customer trust.",
      riskLevel: "critical"
    },
    {
      id: 2,
      category: "Access Control",
      question: "Which scenario poses the highest security risk in access management?",
      options: [
        "Using two-factor authentication",
        "Regular password updates",
        "Shared administrative accounts",
        "Role-based access controls"
      ],
      correctAnswer: 2,
      explanation: "Shared administrative accounts create accountability issues and increase the risk of unauthorized access, making it difficult to track who performed specific actions.",
      riskLevel: "high"
    },
    {
      id: 3,
      category: "Network Security",
      question: "What is the primary risk of using unsecured wireless networks for business operations?",
      options: [
        "Better connectivity",
        "Man-in-the-middle attacks and data interception",
        "Faster internet speeds",
        "Improved mobile access"
      ],
      correctAnswer: 1,
      explanation: "Unsecured wireless networks allow attackers to intercept communications, potentially capturing sensitive business data and credentials.",
      riskLevel: "high"
    },
    {
      id: 4,
      category: "Business Continuity",
      question: "What represents the greatest business continuity risk?",
      options: [
        "Regular data backups",
        "Documented recovery procedures",
        "Single point of failure systems",
        "Redundant infrastructure"
      ],
      correctAnswer: 2,
      explanation: "Single point of failure systems can cause complete business disruption if they fail, as there are no backup systems to maintain operations.",
      riskLevel: "critical"
    },
    {
      id: 5,
      category: "Compliance",
      question: "Which situation creates the highest compliance risk?",
      options: [
        "Regular security audits",
        "Staff training programs",
        "Undocumented security procedures",
        "Risk management policies"
      ],
      correctAnswer: 2,
      explanation: "Undocumented security procedures make it impossible to demonstrate compliance with regulations and create inconsistencies in security implementation.",
      riskLevel: "medium"
    }
  ];

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(parseInt(value));
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast({
        title: "Answer Required",
        description: "Please select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    // Save response
    setResponses(prev => ({
      ...prev,
      [riskQuestions[currentQuestion].id]: {
        questionId: riskQuestions[currentQuestion].id,
        selectedAnswer,
        notes
      }
    }));

    if (currentQuestion + 1 < riskQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setNotes("");
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    riskQuestions.forEach(question => {
      const response = responses[question.id];
      if (response && response.selectedAnswer === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / riskQuestions.length) * 100;
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setResponses({});
    setSelectedAnswer(null);
    setNotes("");
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = riskQuestions.filter(q => 
      responses[q.id]?.selectedAnswer === q.correctAnswer
    ).length;

    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Risk Assessment Results
          </h1>
          <p className="text-muted-foreground">
            Your cybersecurity risk awareness evaluation
          </p>
        </div>

        <Card className="glass-card border-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-32 h-32 mx-auto rounded-full border-8 border-primary/20 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                  <span className="text-3xl font-bold text-white">{Math.round(score)}%</span>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 absolute -top-2 -right-2" />
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2">Assessment Complete!</h2>
                <p className="text-muted-foreground">
                  You answered {correctAnswers} out of {riskQuestions.length} questions correctly
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-xl font-semibold">{Math.round(score)}%</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="text-xl font-semibold">{riskQuestions.length}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-xl font-semibold">
                    {score >= 80 ? "Expert" : score >= 60 ? "Advanced" : score >= 40 ? "Intermediate" : "Beginner"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={resetAssessment} className="mr-4">
                  Retake Assessment
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Question Review</h3>
          {riskQuestions.map((question, index) => {
            const response = responses[question.id];
            const isCorrect = response?.selectedAnswer === question.correctAnswer;
            
            return (
              <Card key={question.id} className="glass-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}>
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{question.category}</Badge>
                        <Badge className={getRiskLevelColor(question.riskLevel)}>
                          {question.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-2">{question.question}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Your answer:</strong> {question.options[response?.selectedAnswer || 0]}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                      </p>
                      <p className="text-sm">{question.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const question = riskQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / riskQuestions.length) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Interactive Risk Assessment
        </h1>
        <p className="text-muted-foreground">
          Test your understanding of cybersecurity risks and best practices
        </p>
      </div>

      <Card className="glass-card border-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Question {currentQuestion + 1} of {riskQuestions.length}
              </CardTitle>
              <CardDescription>{question.category}</CardDescription>
            </div>
            <Badge className={getRiskLevelColor(question.riskLevel)}>
              {question.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            
            <RadioGroup 
              value={selectedAnswer?.toString() || ""} 
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any observations or thoughts about this scenario..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNextQuestion}>
              {currentQuestion + 1 === riskQuestions.length ? "Complete Assessment" : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}