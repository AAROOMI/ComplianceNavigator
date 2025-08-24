import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  Trophy, 
  Star, 
  Target, 
  Shield, 
  Lock, 
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Brain,
  Zap,
  Crown,
  Medal,
  Gem
} from "lucide-react";

interface CompetencyBadge {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: "bronze" | "silver" | "gold" | "platinum";
  requirements: string[];
  earned: boolean;
  earnedDate?: Date;
  progress: number;
  icon: string;
  points: number;
  holders: number;
}

interface UserCompetency {
  category: string;
  level: number;
  maxLevel: number;
  experience: number;
  nextLevelExp: number;
  badges: number;
  rank: string;
}

export default function CompetencyBadges() {
  const competencyBadges: CompetencyBadge[] = [
    {
      id: 1,
      name: "NCA ECC Fundamentals",
      description: "Demonstrate understanding of basic NCA ECC controls and implementation principles",
      category: "NCA ECC",
      difficulty: "bronze",
      requirements: [
        "Complete NCA ECC Controls training module",
        "Pass assessment with 80% or higher",
        "Submit implementation plan"
      ],
      earned: true,
      earnedDate: new Date("2024-01-15"),
      progress: 100,
      icon: "shield",
      points: 100,
      holders: 1250
    },
    {
      id: 2,
      name: "Phishing Detection Expert",
      description: "Master the art of identifying and responding to phishing attacks across all mediums",
      category: "Threat Detection",
      difficulty: "silver",
      requirements: [
        "Complete phishing training modules",
        "Identify 95% of phishing attempts in simulation",
        "Report 3 real phishing attempts",
        "Train 2 colleagues on phishing detection"
      ],
      earned: true,
      earnedDate: new Date("2024-02-01"),
      progress: 100,
      icon: "target",
      points: 250,
      holders: 890
    },
    {
      id: 3,
      name: "Social Engineering Guardian",
      description: "Advanced defense against social engineering attacks and manipulation techniques",
      category: "Social Engineering",
      difficulty: "gold",
      requirements: [
        "Complete advanced social engineering course",
        "Pass scenario-based assessment",
        "Conduct security awareness presentation",
        "Mentor junior team members"
      ],
      earned: false,
      progress: 75,
      icon: "brain",
      points: 500,
      holders: 340
    },
    {
      id: 4,
      name: "Data Guardian",
      description: "Expertise in data classification, handling, and protection procedures",
      category: "Data Protection",
      difficulty: "silver",
      requirements: [
        "Complete data protection certification",
        "Implement data classification system",
        "Conduct data handling audit",
        "Zero data security incidents for 6 months"
      ],
      earned: false,
      progress: 50,
      icon: "lock",
      points: 300,
      holders: 560
    },
    {
      id: 5,
      name: "Incident Response Commander",
      description: "Lead and coordinate effective cybersecurity incident response efforts",
      category: "Incident Response",
      difficulty: "gold",
      requirements: [
        "Complete incident response training",
        "Lead 3 successful incident responses",
        "Develop incident response procedures",
        "Train incident response team"
      ],
      earned: false,
      progress: 25,
      icon: "zap",
      points: 600,
      holders: 180
    },
    {
      id: 6,
      name: "Cybersecurity Mentor",
      description: "Demonstrate leadership in cybersecurity education and awareness",
      category: "Leadership",
      difficulty: "platinum",
      requirements: [
        "Earn 3 gold-level badges",
        "Train 10+ colleagues",
        "Develop training curriculum",
        "Speak at security conference",
        "Publish security article or research"
      ],
      earned: false,
      progress: 20,
      icon: "crown",
      points: 1000,
      holders: 45
    },
    {
      id: 7,
      name: "Quick Learner",
      description: "Complete multiple training modules in record time with high scores",
      category: "Achievement",
      difficulty: "bronze",
      requirements: [
        "Complete 3 training modules in one week",
        "Maintain 90%+ average score",
        "No failed attempts"
      ],
      earned: true,
      earnedDate: new Date("2024-01-20"),
      progress: 100,
      icon: "star",
      points: 150,
      holders: 720
    },
    {
      id: 8,
      name: "Security Champion",
      description: "Consistent excellence in cybersecurity practices and knowledge",
      category: "Excellence",
      difficulty: "gold",
      requirements: [
        "Maintain 30-day learning streak",
        "Score 95%+ on all assessments",
        "Complete advanced certification",
        "Zero security policy violations"
      ],
      earned: false,
      progress: 60,
      icon: "trophy",
      points: 750,
      holders: 125
    }
  ];

  const userCompetencies: UserCompetency[] = [
    {
      category: "NCA ECC",
      level: 3,
      maxLevel: 5,
      experience: 350,
      nextLevelExp: 500,
      badges: 1,
      rank: "Advanced Practitioner"
    },
    {
      category: "Threat Detection",
      level: 4,
      maxLevel: 5,
      experience: 420,
      nextLevelExp: 500,
      badges: 1,
      rank: "Expert"
    },
    {
      category: "Social Engineering",
      level: 2,
      maxLevel: 5,
      experience: 180,
      nextLevelExp: 300,
      badges: 0,
      rank: "Intermediate"
    },
    {
      category: "Data Protection",
      level: 2,
      maxLevel: 5,
      experience: 150,
      nextLevelExp: 300,
      badges: 0,
      rank: "Intermediate"
    },
    {
      category: "Incident Response",
      level: 1,
      maxLevel: 5,
      experience: 50,
      nextLevelExp: 200,
      badges: 0,
      rank: "Novice"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "bronze": return "bg-amber-600";
      case "silver": return "bg-gray-500";
      case "gold": return "bg-yellow-500";
      case "platinum": return "bg-purple-600";
      default: return "bg-gray-500";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "bronze": return Medal;
      case "silver": return Award;
      case "gold": return Trophy;
      case "platinum": return Crown;
      default: return Star;
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "shield": return Shield;
      case "target": return Target;
      case "brain": return Brain;
      case "lock": return Lock;
      case "zap": return Zap;
      case "crown": return Crown;
      case "star": return Star;
      case "trophy": return Trophy;
      default: return Award;
    }
  };

  const earnedBadges = competencyBadges.filter(badge => badge.earned);
  const totalPoints = earnedBadges.reduce((sum, badge) => sum + badge.points, 0);
  const totalBadges = competencyBadges.length;
  const earnedCount = earnedBadges.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Competency & Badges
        </h1>
        <p className="text-muted-foreground">
          Track your cybersecurity expertise and earn recognition for your achievements
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold">{earnedCount}/{totalBadges}</p>
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
                <p className="text-sm text-muted-foreground">Avg Level</p>
                <p className="text-2xl font-bold">
                  {(userCompetencies.reduce((sum, comp) => sum + comp.level, 0) / userCompetencies.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Global Rank</p>
                <p className="text-2xl font-bold">#127</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="badges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="badges">Achievement Badges</TabsTrigger>
          <TabsTrigger value="competency">Competency Levels</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-6">
          {/* Badge Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competencyBadges.map((badge) => {
              const DifficultyIcon = getDifficultyIcon(badge.difficulty);
              const BadgeIcon = getBadgeIcon(badge.icon);
              
              return (
                <Card 
                  key={badge.id} 
                  className={`glass-card border-0 hover:shadow-lg transition-all ${
                    badge.earned ? "ring-2 ring-yellow-500/20" : "opacity-75"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          badge.earned ? getDifficultyColor(badge.difficulty) : "bg-gray-400"
                        }`}>
                          <BadgeIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${badge.earned ? "border-yellow-500 text-yellow-600" : ""}`}
                          >
                            {badge.category}
                          </Badge>
                        </div>
                      </div>
                      {badge.earned && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {badge.name}
                      <DifficultyIcon className={`w-4 h-4 ${
                        badge.earned ? "text-yellow-500" : "text-gray-400"
                      }`} />
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {badge.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <Progress value={badge.progress} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Requirements:</p>
                      <ul className="text-xs space-y-1">
                        {badge.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className={`w-3 h-3 mt-0.5 ${
                              badge.progress >= ((index + 1) / badge.requirements.length) * 100 
                                ? "text-green-500" 
                                : "text-gray-400"
                            }`} />
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{badge.points} points</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{badge.holders} holders</span>
                      </div>
                    </div>

                    {badge.earned && badge.earnedDate && (
                      <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950/20 p-2 rounded">
                        Earned on {badge.earnedDate.toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="competency" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userCompetencies.map((competency) => (
              <Card key={competency.category} className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{competency.category}</span>
                    <Badge variant="outline">{competency.rank}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Level {competency.level} of {competency.maxLevel}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Experience</span>
                      <span>{competency.experience} / {competency.nextLevelExp} XP</span>
                    </div>
                    <Progress 
                      value={(competency.experience / competency.nextLevelExp) * 100} 
                      className="h-2" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Badges Earned</p>
                      <p className="text-lg font-semibold">{competency.badges}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Level</p>
                      <p className="text-lg font-semibold">
                        {competency.nextLevelExp - competency.experience} XP
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    View Learning Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Leaderboard */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Leaderboard
              </CardTitle>
              <CardDescription>
                Top performers in cybersecurity competency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Sarah Al-Mansouri", points: 2850, badges: 12, rank: 1 },
                  { name: "Ahmed Khalid", points: 2650, badges: 11, rank: 2 },
                  { name: "Omar Al-Zahra", points: 2400, badges: 9, rank: 3 },
                  { name: "You", points: totalPoints, badges: earnedCount, rank: 127 },
                  { name: "Fatima Hassan", points: 1950, badges: 8, rank: 128 }
                ].map((user, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                    user.name === "You" ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.rank <= 3 ? "bg-gradient-to-br from-yellow-400 to-orange-500" : "bg-muted"
                    }`}>
                      <span className={`text-sm font-semibold ${
                        user.rank <= 3 ? "text-white" : "text-foreground"
                      }`}>
                        #{user.rank}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${user.name === "You" ? "text-primary" : ""}`}>
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.points} points • {user.badges} badges
                      </p>
                    </div>
                    {user.rank <= 3 && (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}