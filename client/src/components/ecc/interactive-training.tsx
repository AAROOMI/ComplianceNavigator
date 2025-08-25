import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Play, 
  Pause,
  RotateCcw,
  Brain,
  Gamepad2,
  Users,
  Clock,
  Award,
  Zap
} from "lucide-react";

interface TrainingModule {
  id: number;
  name: string;
  type: 'phishing-simulator' | 'secure-browsing-game' | 'social-media-challenge' | 'quiz';
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  passingScore: number;
  content: any;
}

interface TrainingProgress {
  moduleId: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  score?: number;
  attempts: number;
  timeSpent: number;
  lastAccessedAt?: string;
}

const phishingScenarios = [
  {
    id: 1,
    subject: "Urgent: Account Security Update Required",
    sender: "security@your-bank.com",
    content: "Your account has been compromised. Click here to secure it immediately: http://secure-bank-update.net/login",
    isPhishing: true,
    explanation: "This is a phishing attempt. Notice the suspicious URL that doesn't match the bank's official domain.",
    redFlags: ["Urgent language", "Suspicious URL", "Generic greeting"]
  },
  {
    id: 2,
    subject: "Meeting Agenda - Q4 Review",
    sender: "john.smith@yourcompany.com",
    content: "Hi team, please find attached the agenda for our Q4 review meeting scheduled for tomorrow.",
    isPhishing: false,
    explanation: "This is a legitimate email from a colleague with relevant business content.",
    redFlags: []
  },
  {
    id: 3,
    subject: "Congratulations! You've Won $10,000!",
    sender: "winner@lottery-international.biz",
    content: "You have been selected as our lucky winner! Claim your prize now by providing your bank details.",
    isPhishing: true,
    explanation: "Classic lottery scam. Legitimate lotteries don't ask for bank details via email.",
    redFlags: ["Too good to be true", "Asks for sensitive info", "Suspicious domain"]
  }
];

const browsingChallenges = [
  {
    id: 1,
    scenario: "You receive a pop-up saying 'Your computer is infected! Call this number immediately!'",
    options: [
      { text: "Call the number immediately", safe: false },
      { text: "Close the pop-up and run legitimate antivirus", safe: true },
      { text: "Click 'OK' to learn more", safe: false }
    ],
    explanation: "Pop-up scams are common. Close them and use legitimate security software."
  },
  {
    id: 2,
    scenario: "A website asks you to download a plugin to view content",
    options: [
      { text: "Download the plugin", safe: false },
      { text: "Leave the website", safe: true },
      { text: "Allow the plugin just this once", safe: false }
    ],
    explanation: "Malicious websites often use fake plugin downloads to install malware."
  }
];

const socialMediaChallenges = [
  {
    id: 1,
    scenario: "A friend posts a quiz asking 'What was your first pet's name and the street you grew up on?'",
    options: [
      { text: "Answer the fun quiz", safe: false },
      { text: "Ignore the post", safe: true },
      { text: "Share it with friends", safe: false }
    ],
    explanation: "This collects common security question answers that could be used to hack accounts."
  },
  {
    id: 2,
    scenario: "You see a public WiFi network called 'Free_Internet_Here'",
    options: [
      { text: "Connect immediately", safe: false },
      { text: "Ask staff if it's legitimate first", safe: true },
      { text: "Connect but avoid sensitive activities", safe: false }
    ],
    explanation: "Always verify public WiFi networks with staff. Attackers create fake networks to steal data."
  }
];

const quizQuestions = [
  {
    id: 1,
    question: "What makes a password strong?",
    options: [
      "It contains your name",
      "It's at least 12 characters with mixed case, numbers, and symbols",
      "It's easy to remember",
      "It's your birthday"
    ],
    correct: 1,
    explanation: "Strong passwords are long and complex, combining different character types."
  },
  {
    id: 2,
    question: "What should you do if you receive a suspicious email?",
    options: [
      "Forward it to friends to warn them",
      "Delete it immediately without reporting",
      "Report it to IT security and delete it",
      "Reply asking if it's legitimate"
    ],
    correct: 2,
    explanation: "Always report suspicious emails to security teams and delete them safely."
  },
  {
    id: 3,
    question: "Which of these is a sign of a phishing website?",
    options: [
      "HTTPS certificate",
      "Professional design",
      "URL that doesn't match the company name",
      "Fast loading speed"
    ],
    correct: 2,
    explanation: "Phishing sites often use URLs that mimic legitimate sites but with slight differences."
  }
];

interface PhishingSimulatorProps {
  onComplete: (score: number) => void;
}

function PhishingSimulator({ onComplete }: PhishingSimulatorProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: boolean }>({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleAnswer(false); // Time's up, marked as clicked (wrong)
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleAnswer = (clicked: boolean) => {
    const scenario = phishingScenarios[currentScenario];
    const isCorrect = clicked !== scenario.isPhishing; // Correct if didn't click phishing or clicked legitimate
    
    setAnswers({ ...answers, [currentScenario]: isCorrect });
    setShowResult(true);
    setIsActive(false);
    
    if (!isCorrect) {
      toast({
        title: "Phishing Detected!",
        description: scenario.explanation,
        variant: "destructive"
      });
    }
  };

  const nextScenario = () => {
    if (currentScenario < phishingScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setShowResult(false);
      setTimeLeft(30);
      setIsActive(true);
    } else {
      const score = Math.round((Object.values(answers).filter(Boolean).length / phishingScenarios.length) * 100);
      onComplete(score);
    }
  };

  const startSimulation = () => {
    setIsActive(true);
    setTimeLeft(30);
  };

  const scenario = phishingScenarios[currentScenario];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Phishing Email Simulator</h3>
        <Badge variant="outline">
          Scenario {currentScenario + 1} of {phishingScenarios.length}
        </Badge>
      </div>

      <div className="text-center">
        <div className="text-3xl font-bold mb-2">
          {timeLeft}s
        </div>
        <Progress value={(30 - timeLeft) / 30 * 100} className="w-full" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">From: {scenario.sender}</div>
            <div className="text-sm text-muted-foreground">Subject: {scenario.subject}</div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{scenario.content}</p>
          
          {!isActive && !showResult && (
            <Button onClick={startSimulation} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Challenge
            </Button>
          )}

          {isActive && !showResult && (
            <div className="flex gap-2">
              <Button onClick={() => handleAnswer(true)} variant="destructive" className="flex-1">
                This looks suspicious - Report as phishing
              </Button>
              <Button onClick={() => handleAnswer(false)} className="flex-1">
                This looks legitimate - Take action
              </Button>
            </div>
          )}

          {showResult && (
            <div className="space-y-4">
              <Alert className={answers[currentScenario] ? "border-green-500" : "border-red-500"}>
                <div className="flex items-center gap-2">
                  {answers[currentScenario] ? 
                    <CheckCircle className="h-4 w-4 text-green-500" /> : 
                    <XCircle className="h-4 w-4 text-red-500" />
                  }
                  <AlertDescription>
                    {answers[currentScenario] ? "Correct!" : "Incorrect!"} {scenario.explanation}
                  </AlertDescription>
                </div>
              </Alert>

              {scenario.redFlags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Red Flags:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {scenario.redFlags.map((flag, index) => (
                      <li key={index} className="text-muted-foreground">{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={nextScenario} className="w-full">
                {currentScenario < phishingScenarios.length - 1 ? "Next Scenario" : "Complete Training"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface SecureBrowsingGameProps {
  onComplete: (score: number) => void;
}

function SecureBrowsingGame({ onComplete }: SecureBrowsingGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (optionIndex: number) => {
    const challenge = browsingChallenges[currentChallenge];
    const isCorrect = challenge.options[optionIndex].safe;
    
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextChallenge = () => {
    if (currentChallenge < browsingChallenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      const finalScore = Math.round((score / browsingChallenges.length) * 100);
      onComplete(finalScore);
    }
  };

  const challenge = browsingChallenges[currentChallenge];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Secure Browsing Game</h3>
        <Badge variant="outline">
          Challenge {currentChallenge + 1} of {browsingChallenges.length}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">{challenge.scenario}</h4>
          
          {!showResult ? (
            <div className="space-y-2">
              {challenge.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start"
                  onClick={() => handleAnswer(index)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {challenge.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${
                      index === selectedAnswer
                        ? option.safe
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : option.safe
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {option.safe ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>{option.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Alert>
                <AlertDescription>{challenge.explanation}</AlertDescription>
              </Alert>

              <Button onClick={nextChallenge} className="w-full">
                {currentChallenge < browsingChallenges.length - 1 ? "Next Challenge" : "Complete Game"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface TrainingModuleProps {
  module: TrainingModule;
  progress?: TrainingProgress;
  onStart: (moduleId: number) => void;
  onComplete: (moduleId: number, score: number, timeSpent: number) => void;
}

export function InteractiveTrainingModule({ module, progress, onStart, onComplete }: TrainingModuleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleStart = () => {
    setStartTime(new Date());
    onStart(module.id);
  };

  const handleComplete = (score: number) => {
    if (startTime) {
      const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60);
      onComplete(module.id, score, timeSpent);
      setIsOpen(false);
      
      toast({
        title: score >= module.passingScore ? "Training Complete!" : "Training Needs Improvement",
        description: `You scored ${score}%. ${score >= module.passingScore ? "Well done!" : "Try again to improve your score."}`,
        variant: score >= module.passingScore ? "default" : "destructive"
      });
    }
  };

  const getModuleIcon = () => {
    switch (module.type) {
      case 'phishing-simulator': return <Shield className="h-5 w-5" />;
      case 'secure-browsing-game': return <Gamepad2 className="h-5 w-5" />;
      case 'social-media-challenge': return <Users className="h-5 w-5" />;
      case 'quiz': return <Brain className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getStatusColor = () => {
    if (!progress) return "bg-gray-100 text-gray-800";
    switch (progress.status) {
      case 'completed': return "bg-green-100 text-green-800";
      case 'in-progress': return "bg-yellow-100 text-yellow-800";
      case 'failed': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {getModuleIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{module.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{module.difficulty}</Badge>
                  {progress && (
                    <Badge className={getStatusColor()}>
                      {progress.status.replace("-", " ")}
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {module.estimatedTime}m
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Pass: {module.passingScore}%
                </span>
                {progress && progress.score && (
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Score: {progress.score}%
                  </span>
                )}
              </div>
              
              {progress && progress.status === 'completed' && progress.score && progress.score >= module.passingScore ? (
                <Button size="sm" onClick={() => setIsOpen(true)} className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Review Training
                </Button>
              ) : (
                <Button size="sm" onClick={() => setIsOpen(true)} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  {progress?.status === 'in-progress' ? 'Continue' : 'Start'} Training
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getModuleIcon()}
              {module.name}
            </DialogTitle>
            <DialogDescription>
              {module.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {!startTime ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  {getModuleIcon()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium">Estimated Time</div>
                      <div className="text-muted-foreground">{module.estimatedTime} minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Passing Score</div>
                      <div className="text-muted-foreground">{module.passingScore}%</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Difficulty</div>
                      <div className="text-muted-foreground capitalize">{module.difficulty}</div>
                    </div>
                  </div>
                </div>
                <Button onClick={handleStart} className="px-8">
                  <Play className="h-4 w-4 mr-2" />
                  Start Training
                </Button>
              </div>
            ) : (
              <div>
                {module.type === 'phishing-simulator' && (
                  <PhishingSimulator onComplete={handleComplete} />
                )}
                {module.type === 'secure-browsing-game' && (
                  <SecureBrowsingGame onComplete={handleComplete} />
                )}
                {/* Add other module types as needed */}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}