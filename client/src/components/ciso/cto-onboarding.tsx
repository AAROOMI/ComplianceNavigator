import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Rocket, 
  FileText, 
  Sparkles, 
  Users, 
  CheckCircle,
  Play,
  Target,
  Zap,
  Code,
  TrendingUp,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  position: {
    target: string;
    placement: 'top' | 'bottom' | 'left' | 'right';
  };
  action?: {
    text: string;
    onClick: () => void;
  };
}

interface CTOOnboardingProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const ctoSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to CTO Technology Strategy",
    description: "Your comprehensive technology leadership and innovation policy platform. Let's explore strategic technology management!",
    icon: Rocket,
    position: {
      target: "center",
      placement: "top"
    }
  },
  {
    id: "innovation",
    title: "Technology Strategy & Innovation",
    description: "Develop technology budgets, innovation roadmaps, and strategic technology investments for competitive advantage.",
    icon: TrendingUp,
    position: {
      target: "[data-onboarding='overview-tab']",
      placement: "bottom"
    }
  },
  {
    id: "development",
    title: "Software Development & Engineering",
    description: "Create SDLC frameworks, product development plans, and engineering best practices for scalable development.",
    icon: Code,
    position: {
      target: "[data-onboarding='templates-tab']",
      placement: "bottom"
    }
  },
  {
    id: "architecture",
    title: "System Architecture & Design",
    description: "Build comprehensive system architecture documents, technology evaluation reports, and scalability frameworks.",
    icon: Layers,
    position: {
      target: "[data-onboarding='create-button']",
      placement: "left"
    }
  },
  {
    id: "governance",
    title: "Technology Governance",
    description: "Establish IT governance frameworks, compliance plans, and technology risk management strategies.",
    icon: Target,
    position: {
      target: "[data-onboarding='policies-tab']",
      placement: "bottom"
    }
  },
  {
    id: "performance",
    title: "Technology Performance Analytics",
    description: "Monitor technology investments, innovation metrics, and strategic technology outcomes with advanced analytics.",
    icon: Zap,
    position: {
      target: "[data-onboarding='analytics-tab']",
      placement: "bottom"
    }
  }
];

export default function CTOOnboarding({ 
  isVisible, 
  onComplete, 
  onSkip 
}: CTOOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStepData = ctoSteps[currentStep];
  const progress = ((currentStep + 1) / ctoSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < ctoSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex !== currentStep) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(stepIndex);
        setIsAnimating(false);
      }, 200);
    }
  };

  const getStepPosition = () => {
    if (currentStepData.position.target === "center") {
      return {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1001
      };
    }

    const positions = {
      top: { top: "20%", left: "50%", transform: "translateX(-50%)" },
      bottom: { bottom: "20%", left: "50%", transform: "translateX(-50%)" },
      left: { top: "50%", left: "20%", transform: "translateY(-50%)" },
      right: { top: "50%", right: "20%", transform: "translateY(-50%)" }
    };

    return {
      position: "fixed" as const,
      ...positions[currentStepData.position.placement],
      zIndex: 1001
    };
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-1000" data-testid="cto-onboarding-overlay">
      <div className="absolute inset-0" onClick={onSkip} />
      
      {/* Progress Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-1002">
        <Card className="w-80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">CTO Strategy Tour</span>
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} of {ctoSteps.length}
              </span>
            </div>
            <Progress value={progress} className="mb-2" />
            <div className="flex justify-center gap-1">
              {ctoSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentStep 
                      ? 'bg-purple-500' 
                      : index < currentStep 
                        ? 'bg-green-500' 
                        : 'bg-muted'
                  }`}
                  data-testid={`cto-step-${index}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Onboarding Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          style={getStepPosition()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-96 max-w-[90vw]"
        >
          <Card className="shadow-xl border-2 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <currentStepData.icon className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
                    <Badge variant="outline" className="text-xs mt-1 border-purple-500/20">
                      Step {currentStep + 1}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="cto-onboarding-skip"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-6">
                <p className="text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  size="sm"
                  data-testid="cto-onboarding-previous"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={onSkip}
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Skip Tour
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600"
                    data-testid="cto-onboarding-next"
                  >
                    {currentStep === ctoSteps.length - 1 ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Get Started
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Welcome Animation for First Step */}
      {currentStep === 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-1002"
        >
          <div className="flex items-center gap-2 text-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Rocket className="w-8 h-8" />
            </motion.div>
            <span className="text-xl font-bold">Welcome to CTO Strategy!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}