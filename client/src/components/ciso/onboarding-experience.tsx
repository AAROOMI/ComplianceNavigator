import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Shield, 
  FileText, 
  Sparkles, 
  Users, 
  CheckCircle,
  Play,
  Target,
  Zap
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

interface OnboardingExperienceProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to CISO Policies & Procedures",
    description: "Your comprehensive cybersecurity policy management platform. Let's take a quick tour to get you started!",
    icon: Shield,
    position: {
      target: "center",
      placement: "top"
    }
  },
  {
    id: "overview",
    title: "Policy Categories Overview",
    description: "Browse policies organized by professional categories. Each category shows policy counts and quick access to create new policies.",
    icon: FileText,
    position: {
      target: "[data-onboarding='overview-tab']",
      placement: "bottom"
    }
  },
  {
    id: "templates",
    title: "Ready-to-Use Templates",
    description: "Choose from 22 professional policy templates covering all aspects of cybersecurity governance and compliance.",
    icon: Target,
    position: {
      target: "[data-onboarding='templates-tab']",
      placement: "bottom"
    }
  },
  {
    id: "ai-generation",
    title: "AI-Powered Policy Generation",
    description: "Generate comprehensive policies using AI assistance. Simply describe your needs and get professional content instantly.",
    icon: Sparkles,
    position: {
      target: "[data-onboarding='create-button']",
      placement: "left"
    }
  },
  {
    id: "collaboration",
    title: "Team Collaboration",
    description: "Assign policy owners, set review dates, and track approval workflows with your security team.",
    icon: Users,
    position: {
      target: "[data-onboarding='policies-tab']",
      placement: "bottom"
    }
  },
  {
    id: "analytics",
    title: "Policy Analytics",
    description: "Monitor policy distribution, status tracking, and compliance metrics with comprehensive analytics dashboard.",
    icon: Zap,
    position: {
      target: "[data-onboarding='analytics-tab']",
      placement: "bottom"
    }
  }
];

export default function OnboardingExperience({ 
  isVisible, 
  onComplete, 
  onSkip 
}: OnboardingExperienceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
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

    // For other targets, we'll position relative to the viewport center for demo
    // In a real implementation, you'd calculate position based on the actual target element
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-1000" data-testid="onboarding-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onSkip} />
      
      {/* Progress Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-1002">
        <Card className="w-80">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Getting Started</span>
              <span className="text-xs text-muted-foreground">
                {currentStep + 1} of {onboardingSteps.length}
              </span>
            </div>
            <Progress value={progress} className="mb-2" />
            <div className="flex justify-center gap-1">
              {onboardingSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentStep 
                      ? 'bg-primary' 
                      : index < currentStep 
                        ? 'bg-green-500' 
                        : 'bg-muted'
                  }`}
                  data-testid={`onboarding-step-${index}`}
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
          <Card className="shadow-xl border-2 border-primary/20">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <currentStepData.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
                    <Badge variant="outline" className="text-xs mt-1">
                      Step {currentStep + 1}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkip}
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="onboarding-skip"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
                
                {currentStepData.action && (
                  <div className="mt-4">
                    <Button
                      onClick={currentStepData.action.onClick}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {currentStepData.action.text}
                    </Button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  size="sm"
                  data-testid="onboarding-previous"
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
                    className="bg-primary hover:bg-primary/90"
                    data-testid="onboarding-next"
                  >
                    {currentStep === onboardingSteps.length - 1 ? (
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

      {/* Highlight Overlay for Target Elements */}
      {currentStepData.position.target !== "center" && (
        <div 
          className="fixed inset-0 pointer-events-none z-999"
          style={{
            background: `radial-gradient(circle at center, transparent 100px, rgba(0,0,0,0.3) 200px)`
          }}
        />
      )}

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
              <Shield className="w-8 h-8" />
            </motion.div>
            <span className="text-xl font-bold">Welcome to CISO Policies!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}