import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Puzzle, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy,
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  questions: QuizQuestion[];
  timeLimit: number; // minutes
  passingScore: number;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

interface PuzzleChallenge {
  id: number;
  title: string;
  description: string;
  type: "scenario" | "identification" | "drag-drop";
  difficulty: "easy" | "medium" | "hard";
  content: any;
}

export default function SecurityQuizzes() {
  const { toast } = useToast();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const quizzes: Quiz[] = [
    {
      id: 1,
      title: "NCA ECC Controls Mastery",
      description: "Test your knowledge of National Cybersecurity Authority Essential Cybersecurity Controls",
      category: "NCA ECC",
      difficulty: "medium",
      timeLimit: 20,
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: "Which NCA ECC domain focuses on establishing cybersecurity governance structure?",
          options: ["Cybersecurity Defence", "Governance", "Cybersecurity Resilience", "Third Party Cloud Computing"],
          correctAnswer: 1,
          explanation: "The Governance domain establishes the foundation for cybersecurity management including policies, roles, and responsibilities.",
          points: 10
        },
        {
          id: 2,
          question: "What is the primary purpose of access control measures in NCA ECC?",
          options: [
            "To improve system performance",
            "To ensure only authorized users can access resources",
            "To reduce storage costs",
            "To simplify user experience"
          ],
          correctAnswer: 1,
          explanation: "Access control ensures that only authorized individuals can access specific systems, data, or resources.",
          points: 10
        },
        {
          id: 3,
          question: "Which control category addresses protection against cyber threats?",
          options: ["Governance", "Cybersecurity Defence", "Business Continuity", "Risk Management"],
          correctAnswer: 1,
          explanation: "Cybersecurity Defence includes protective measures against various cyber threats and attacks.",
          points: 15
        }
      ]
    },
    {
      id: 2,
      title: "Phishing Detection Challenge",
      description: "Identify phishing attempts and social engineering tactics",
      category: "Threat Recognition",
      difficulty: "easy",
      timeLimit: 15,
      passingScore: 80,
      questions: [
        {
          id: 1,
          question: "Which of the following is a common sign of a phishing email?",
          options: [
            "Professional company logo",
            "Urgent action required with tight deadline",
            "Personalized greeting with your name",
            "Clear contact information"
          ],
          correctAnswer: 1,
          explanation: "Phishing emails often create urgency to pressure victims into quick action without careful consideration.",
          points: 10
        },
        {
          id: 2,
          question: "What should you do if you receive a suspicious email asking for sensitive information?",
          options: [
            "Reply with the requested information",
            "Forward it to colleagues for verification",
            "Delete it and report to IT security",
            "Click the link to verify if it's legitimate"
          ],
          correctAnswer: 2,
          explanation: "Always delete suspicious emails and report them to your IT security team for investigation.",
          points: 15
        }
      ]
    },
    {
      id: 3,
      title: "Advanced Threat Analysis",
      description: "Deep dive into sophisticated cyber attack methods and countermeasures",
      category: "Advanced Security",
      difficulty: "hard",
      timeLimit: 30,
      passingScore: 75,
      questions: [
        {
          id: 1,
          question: "What characterizes an Advanced Persistent Threat (APT)?",
          options: [
            "Quick, automated attacks with immediate impact",
            "Long-term, stealthy attacks targeting specific organizations",
            "Random attacks on multiple targets simultaneously",
            "Simple malware infections"
          ],
          correctAnswer: 1,
          explanation: "APTs are sophisticated, long-term attacks that remain undetected while gathering intelligence or maintaining access.",
          points: 20
        }
      ]
    }
  ];

  const puzzleChallenges: PuzzleChallenge[] = [
    {
      id: 1,
      title: "Security Incident Response Puzzle",
      description: "Arrange the correct sequence of incident response steps",
      type: "drag-drop",
      difficulty: "medium",
      content: {
        steps: ["Detection", "Containment", "Eradication", "Recovery", "Lessons Learned"],
        scrambled: ["Recovery", "Detection", "Lessons Learned", "Containment", "Eradication"]
      }
    },
    {
      id: 2,
      title: "Network Security Scenario",
      description: "Identify security vulnerabilities in a network diagram",
      type: "identification",
      difficulty: "hard",
      content: {
        scenario: "A company network with multiple security gaps",
        vulnerabilities: ["Unencrypted WiFi", "Open ports", "Missing firewall rules", "Weak authentication"]
      }
    }
  ];

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setShowResults(false);
    setTimeRemaining(quiz.timeLimit * 60); // Convert to seconds
  };

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

    const newAnswers = { ...answers, [currentQuestion]: selectedAnswer };
    setAnswers(newAnswers);

    if (currentQuestion + 1 < selectedQuiz!.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    
    let totalPoints = 0;
    let earnedPoints = 0;
    
    selectedQuiz.questions.forEach((question, index) => {
      totalPoints += question.points;
      if (answers[index] === question.correctAnswer) {
        earnedPoints += question.points;
      }
    });
    
    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "NCA ECC": return Shield;
      case "Threat Recognition": return Eye;
      case "Advanced Security": return Brain;
      default: return Target;
    }
  };

  if (selectedQuiz && !showResults) {
    const question = selectedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="glass-card border-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  {selectedQuiz.title}
                </CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} of {selectedQuiz.questions.length} • {question.points} points
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">20:00</span>
              </div>
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

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNextQuestion}>
                {currentQuestion + 1 === selectedQuiz.questions.length ? "Complete Quiz" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && selectedQuiz) {
    const score = calculateScore();
    const passed = score >= selectedQuiz.passingScore;

    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="glass-card border-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className={`w-32 h-32 mx-auto rounded-full border-8 flex items-center justify-center ${
                  passed ? "border-green-500 bg-gradient-to-br from-green-500 to-blue-600" : 
                           "border-red-500 bg-gradient-to-br from-red-500 to-orange-600"
                }`}>
                  <span className="text-3xl font-bold text-white">{score}%</span>
                </div>
                {passed ? (
                  <Trophy className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 absolute -top-2 -right-2" />
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  {passed ? "Congratulations!" : "Keep Learning!"}
                </h2>
                <p className="text-muted-foreground">
                  {passed ? `You passed the ${selectedQuiz.title} quiz!` : 
                           `You need ${selectedQuiz.passingScore}% to pass. Try again!`}
                </p>
              </div>

              <div className="space-y-2">
                <Button onClick={() => setSelectedQuiz(null)} className="mr-4">
                  Back to Quizzes
                </Button>
                <Button variant="outline" onClick={() => startQuiz(selectedQuiz)}>
                  Retake Quiz
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
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Security Quizzes & Puzzles
        </h1>
        <p className="text-muted-foreground">
          Test your cybersecurity knowledge with interactive quizzes and challenges
        </p>
      </div>

      <Tabs defaultValue="quizzes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quizzes">Knowledge Quizzes</TabsTrigger>
          <TabsTrigger value="puzzles">Interactive Puzzles</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => {
              const IconComponent = getCategoryIcon(quiz.category);
              
              return (
                <Card key={quiz.id} className="glass-card border-0 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <Badge variant="outline" className="text-xs">
                          {quiz.category}
                        </Badge>
                      </div>
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.timeLimit} mins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{quiz.questions.length} questions</span>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="font-medium">Passing Score: </span>
                      <span>{quiz.passingScore}%</span>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => startQuiz(quiz)}
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="puzzles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {puzzleChallenges.map((puzzle) => (
              <Card key={puzzle.id} className="glass-card border-0 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Puzzle className="w-5 h-5 text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {puzzle.type}
                      </Badge>
                    </div>
                    <Badge className={getDifficultyColor(puzzle.difficulty)}>
                      {puzzle.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{puzzle.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {puzzle.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}