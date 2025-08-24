import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Shield,
  AlertTriangle,
  Target,
  BookOpen,
  Award,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrainingContent {
  id: number;
  type: "lesson" | "quiz" | "interactive";
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  interactive?: {
    scenario: string;
    steps: string[];
  };
}

interface TrainingModule {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: number;
  content: TrainingContent[];
}

export default function TrainingModule() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [moduleCompleted, setModuleCompleted] = useState(false);

  // Get module ID from URL params
  const moduleId = parseInt(location.split("/").pop() || "1");

  // Training modules with actual content
  const trainingModules: Record<number, TrainingModule> = {
    1: {
      id: 1,
      title: "NCA ECC Controls Fundamentals",
      description: "Understanding the National Cybersecurity Authority Essential Cybersecurity Controls framework",
      category: "NCA ECC",
      duration: 45,
      content: [
        {
          id: 1,
          type: "lesson",
          title: "Introduction to NCA ECC",
          content: `
            <h3>National Cybersecurity Authority Essential Cybersecurity Controls</h3>
            <p>The NCA ECC framework is designed to help organizations establish a robust cybersecurity foundation. It consists of five core domains:</p>
            <ul>
              <li><strong>Governance:</strong> Establishing cybersecurity leadership and accountability</li>
              <li><strong>Cybersecurity Defence:</strong> Implementing protective measures against threats</li>
              <li><strong>Cybersecurity Resilience:</strong> Ensuring business continuity and recovery</li>
              <li><strong>Third Party Cloud Computing:</strong> Managing cloud service provider risks</li>
              <li><strong>Industrial Control Systems:</strong> Securing operational technology</li>
            </ul>
            <p>Each domain contains specific controls that must be implemented and maintained to achieve compliance.</p>
          `
        },
        {
          id: 2,
          type: "quiz",
          title: "Domain Knowledge Check",
          content: "Test your understanding of the NCA ECC domains",
          quiz: {
            question: "Which NCA ECC domain focuses on establishing cybersecurity leadership and accountability?",
            options: ["Cybersecurity Defence", "Governance", "Cybersecurity Resilience", "Industrial Control Systems"],
            correctAnswer: 1,
            explanation: "The Governance domain establishes the foundation for cybersecurity management including policies, roles, and responsibilities."
          }
        },
        {
          id: 3,
          type: "interactive",
          title: "Implementation Scenario",
          content: "Practice implementing NCA ECC controls in a real-world scenario",
          interactive: {
            scenario: "You are the CISO of a financial services company. You need to implement NCA ECC controls. What steps would you take?",
            steps: [
              "Conduct a gap analysis against current security posture",
              "Develop an implementation roadmap with priorities",
              "Establish governance structure and assign responsibilities",
              "Implement technical and administrative controls",
              "Monitor and continuously improve the program"
            ]
          }
        }
      ]
    },
    2: {
      id: 2,
      title: "Phishing Attack Recognition",
      description: "Learn to identify and respond to phishing attempts across email, SMS, and social media",
      category: "Threat Awareness",
      duration: 30,
      content: [
        {
          id: 1,
          type: "lesson",
          title: "What is Phishing?",
          content: `
            <h3>Understanding Phishing Attacks</h3>
            <p>Phishing is a cybercrime where attackers impersonate legitimate organizations to steal sensitive information such as:</p>
            <ul>
              <li>Login credentials (usernames and passwords)</li>
              <li>Credit card numbers and financial information</li>
              <li>Personal identification information</li>
              <li>Corporate data and intellectual property</li>
            </ul>
            <h4>Common Phishing Channels:</h4>
            <ul>
              <li><strong>Email Phishing:</strong> Fraudulent emails appearing to be from trusted sources</li>
              <li><strong>SMS Phishing (Smishing):</strong> Text messages with malicious links</li>
              <li><strong>Voice Phishing (Vishing):</strong> Phone calls requesting sensitive information</li>
              <li><strong>Social Media Phishing:</strong> Fake posts and messages on social platforms</li>
            </ul>
          `
        },
        {
          id: 2,
          type: "quiz",
          title: "Phishing Recognition Test",
          content: "Can you identify phishing attempts?",
          quiz: {
            question: "Which of the following is a common sign of a phishing email?",
            options: [
              "Professional company logo and branding",
              "Urgent action required with tight deadline",
              "Personalized greeting with your full name",
              "Clear contact information and phone number"
            ],
            correctAnswer: 1,
            explanation: "Phishing emails often create urgency to pressure victims into quick action without careful consideration."
          }
        }
      ]
    },
    3: {
      id: 3,
      title: "Social Engineering Defense",
      description: "Advanced techniques to recognize and counter social engineering attacks",
      category: "Social Engineering",
      duration: 60,
      content: [
        {
          id: 1,
          type: "lesson",
          title: "Psychology of Social Engineering",
          content: `
            <h3>Understanding Social Engineering</h3>
            <p>Social engineering exploits human psychology rather than technical vulnerabilities. Attackers use psychological manipulation to trick people into divulging confidential information or performing actions that compromise security.</p>
            <h4>Common Psychological Triggers:</h4>
            <ul>
              <li><strong>Authority:</strong> Impersonating authority figures (CEO, IT support, law enforcement)</li>
              <li><strong>Urgency:</strong> Creating time pressure to bypass normal security protocols</li>
              <li><strong>Fear:</strong> Threatening negative consequences if action isn't taken</li>
              <li><strong>Curiosity:</strong> Using intriguing subject lines or scenarios</li>
              <li><strong>Helpfulness:</strong> Exploiting people's natural desire to help others</li>
            </ul>
          `
        },
        {
          id: 2,
          type: "interactive",
          title: "Social Engineering Simulation",
          content: "Practice identifying social engineering tactics",
          interactive: {
            scenario: "You receive a phone call from someone claiming to be from IT support saying there's a security breach and they need your password to protect your account. How do you respond?",
            steps: [
              "Do not provide any personal information over the phone",
              "Verify the caller's identity through official channels",
              "Hang up and call your IT department directly",
              "Report the incident to your security team",
              "Document the attempt for analysis"
            ]
          }
        }
      ]
    }
  };

  const currentModule = trainingModules[moduleId];
  const currentContent = currentModule?.content[currentStep];
  const progress = currentModule ? ((currentStep + 1) / currentModule.content.length) * 100 : 0;

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentStep]);

  const handleNext = () => {
    if (currentContent?.type === "quiz" && selectedAnswer === null) {
      toast({
        title: "Answer Required",
        description: "Please select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentContent?.type === "quiz" && selectedAnswer !== null) {
      setUserAnswers(prev => ({ ...prev, [currentStep]: selectedAnswer }));
    }

    if (currentStep + 1 < currentModule.content.length) {
      setCurrentStep(currentStep + 1);
    } else {
      completeModule();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeModule = () => {
    setModuleCompleted(true);
    
    // Calculate score for quizzes
    const quizSteps = currentModule.content.filter(c => c.type === "quiz");
    const correctAnswers = quizSteps.filter((_, index) => {
      const stepIndex = currentModule.content.findIndex(c => c.id === quizSteps[index].id);
      return userAnswers[stepIndex] === quizSteps[index].quiz?.correctAnswer;
    }).length;
    
    const score = quizSteps.length > 0 ? Math.round((correctAnswers / quizSteps.length) * 100) : 100;

    toast({
      title: "Module Completed!",
      description: `You completed ${currentModule.title} with a score of ${score}%`,
    });

    // Save completion to localStorage
    const completedModules = JSON.parse(localStorage.getItem("completed-modules") || "[]");
    if (!completedModules.includes(moduleId)) {
      completedModules.push(moduleId);
      localStorage.setItem("completed-modules", JSON.stringify(completedModules));
    }
  };

  const backToModules = () => {
    setLocation("/user-awareness");
  };

  if (!currentModule) {
    return (
      <div className="container mx-auto p-6">
        <Card className="glass-card border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Module Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested training module could not be found.</p>
            <Button onClick={backToModules}>Back to Training Modules</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (moduleCompleted) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="glass-card border-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/30 dark:to-blue-950/30">
          <CardContent className="p-12 text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <Award className="w-12 h-12 text-white" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
                <p className="text-muted-foreground text-lg">
                  You have successfully completed the training module
                </p>
                <h3 className="text-xl font-semibold mt-4">{currentModule.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold">Completed</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold">{currentModule.duration} min</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-lg font-semibold">{currentModule.category}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={backToModules} className="mr-4">
                  Back to Training Modules
                </Button>
                <Button variant="outline" onClick={() => setLocation("/competency-badges")}>
                  View My Badges
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={backToModules}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{currentModule.title}</h1>
          <p className="text-muted-foreground">{currentModule.description}</p>
        </div>
        <Badge variant="outline">{currentModule.category}</Badge>
      </div>

      {/* Progress */}
      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {currentModule.content.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentContent?.type === "lesson" && <BookOpen className="w-5 h-5" />}
            {currentContent?.type === "quiz" && <Target className="w-5 h-5" />}
            {currentContent?.type === "interactive" && <Play className="w-5 h-5" />}
            {currentContent?.title}
          </CardTitle>
          <CardDescription>
            Step {currentStep + 1}: {currentContent?.type.charAt(0).toUpperCase() + currentContent?.type.slice(1)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentContent?.type === "lesson" && (
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: currentContent.content }}
            />
          )}

          {currentContent?.type === "quiz" && currentContent.quiz && (
            <div className="space-y-4">
              <p className="text-lg font-medium">{currentContent.quiz.question}</p>
              
              <RadioGroup 
                value={selectedAnswer?.toString() || ""} 
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                className="space-y-3"
              >
                {currentContent.quiz.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {selectedAnswer !== null && userAnswers[currentStep] !== undefined && (
                <Card className={`border-2 ${
                  userAnswers[currentStep] === currentContent.quiz.correctAnswer
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-red-500 bg-red-50 dark:bg-red-950/20"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      {userAnswers[currentStep] === currentContent.quiz.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">
                          {userAnswers[currentStep] === currentContent.quiz.correctAnswer ? "Correct!" : "Incorrect"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentContent.quiz.explanation}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {currentContent?.type === "interactive" && currentContent.interactive && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Scenario:</h4>
                <p className="text-blue-800 dark:text-blue-200">{currentContent.interactive.scenario}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Recommended Steps:</h4>
                <div className="space-y-2">
                  {currentContent.interactive.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep + 1 === currentModule.content.length ? "Complete Module" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}