import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Shield, 
  Target, 
  TrendingUp, 
  Book, 
  Award, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Brain,
  Lock
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AwarenessModule {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  completed: boolean;
  completionRate: number;
  topics: string[];
}

interface UserProgress {
  userId: number;
  totalModulesCompleted: number;
  totalModules: number;
  averageScore: number;
  badges: string[];
  currentStreak: number;
  lastActivity: Date;
}

export default function UserAwareness() {
  // Sample awareness modules
  const awarenessModules: AwarenessModule[] = [
    {
      id: 1,
      title: "NCA ECC Controls Fundamentals",
      description: "Understanding the National Cybersecurity Authority Essential Cybersecurity Controls framework",
      category: "NCA ECC",
      difficulty: "beginner",
      duration: 45,
      completed: true,
      completionRate: 95,
      topics: ["Governance", "Risk Management", "Asset Management", "Access Control"]
    },
    {
      id: 2,
      title: "Phishing Attack Recognition",
      description: "Learn to identify and respond to phishing attempts across email, SMS, and social media",
      category: "Threat Awareness",
      difficulty: "beginner",
      duration: 30,
      completed: true,
      completionRate: 88,
      topics: ["Email Security", "Social Engineering", "Red Flags", "Reporting Procedures"]
    },
    {
      id: 3,
      title: "Social Engineering Defense",
      description: "Advanced techniques to recognize and counter social engineering attacks",
      category: "Threat Awareness",
      difficulty: "intermediate",
      duration: 60,
      completed: false,
      completionRate: 0,
      topics: ["Psychology of Attacks", "Pretexting", "Baiting", "Quid Pro Quo"]
    },
    {
      id: 4,
      title: "Data Classification and Handling",
      description: "Proper classification, handling, and protection of organizational data",
      category: "Data Protection",
      difficulty: "intermediate",
      duration: 40,
      completed: false,
      completionRate: 0,
      topics: ["Classification Levels", "Encryption", "Storage", "Transmission"]
    },
    {
      id: 5,
      title: "Incident Response Procedures",
      description: "Steps to take when a security incident occurs",
      category: "Incident Management",
      difficulty: "intermediate",
      duration: 35,
      completed: false,
      completionRate: 0,
      topics: ["Detection", "Containment", "Eradication", "Recovery", "Lessons Learned"]
    },
    {
      id: 6,
      title: "Advanced Persistent Threats (APT)",
      description: "Understanding sophisticated, long-term cyber attacks",
      category: "Advanced Threats",
      difficulty: "advanced",
      duration: 90,
      completed: false,
      completionRate: 0,
      topics: ["APT Lifecycle", "Indicators", "Defense Strategies", "Attribution"]
    }
  ];

  const userProgress: UserProgress = {
    userId: 1,
    totalModulesCompleted: 2,
    totalModules: 6,
    averageScore: 91.5,
    badges: ["First Steps", "Phishing Expert", "Quick Learner"],
    currentStreak: 5,
    lastActivity: new Date()
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "NCA ECC": return Shield;
      case "Threat Awareness": return AlertTriangle;
      case "Data Protection": return Lock;
      case "Incident Management": return Target;
      case "Advanced Threats": return Brain;
      default: return Book;
    }
  };

  const completionPercentage = (userProgress.totalModulesCompleted / userProgress.totalModules) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          User Awareness & Training
        </h1>
        <p className="text-muted-foreground">
          Build your cybersecurity knowledge with interactive training modules
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">{Math.round(completionPercentage)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{userProgress.averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{userProgress.currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Badges</p>
                <p className="text-2xl font-bold">{userProgress.badges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Overall Progress</h3>
              <span className="text-sm text-muted-foreground">
                {userProgress.totalModulesCompleted} of {userProgress.totalModules} modules completed
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules">Training Modules</TabsTrigger>
          <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
          <TabsTrigger value="progress">Detailed Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {awarenessModules.map((module) => {
              const IconComponent = getCategoryIcon(module.category);
              
              return (
                <Card key={module.id} className="glass-card border-0 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <Badge variant="outline" className="text-xs">
                          {module.category}
                        </Badge>
                      </div>
                      {module.completed && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{module.duration} mins</span>
                      </div>
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                    </div>

                    {module.completed && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completion Rate</span>
                          <span>{module.completionRate}%</span>
                        </div>
                        <Progress value={module.completionRate} className="h-1" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Topics covered:</p>
                      <div className="flex flex-wrap gap-1">
                        {module.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      variant={module.completed ? "outline" : "default"}
                    >
                      {module.completed ? "Review Module" : "Start Learning"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProgress.badges.map((badge, index) => (
              <Card key={index} className="glass-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{badge}</h3>
                  <p className="text-sm text-muted-foreground">
                    Achievement unlocked for completing training milestones
                  </p>
                </CardContent>
              </Card>
            ))}
            
            {/* Locked badges */}
            <Card className="glass-card border-0 opacity-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-400 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Social Engineering Expert</h3>
                <p className="text-sm text-muted-foreground">
                  Complete all social engineering modules
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle>Learning Analytics</CardTitle>
              <CardDescription>Track your learning journey and identify areas for improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Categories Progress</h4>
                  <div className="space-y-3">
                    {["NCA ECC", "Threat Awareness", "Data Protection", "Incident Management"].map((category) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span>
                            {category === "NCA ECC" ? "100%" : 
                             category === "Threat Awareness" ? "50%" : "0%"}
                          </span>
                        </div>
                        <Progress 
                          value={
                            category === "NCA ECC" ? 100 : 
                            category === "Threat Awareness" ? 50 : 0
                          } 
                          className="h-2" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Completed "Phishing Attack Recognition"</span>
                      <span className="text-muted-foreground">2 days ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Earned "Quick Learner" badge</span>
                      <span className="text-muted-foreground">5 days ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Completed "NCA ECC Controls Fundamentals"</span>
                      <span className="text-muted-foreground">1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}