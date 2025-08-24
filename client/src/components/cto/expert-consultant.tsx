import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  User, 
  Bot, 
  Rocket, 
  MessageSquare,
  Clock,
  CheckCircle,
  FileText,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Zap
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'strategy' | 'innovation' | 'analysis' | 'recommendation';
}

interface ConsultationSession {
  id: string;
  title: string;
  messages: Message[];
  status: 'active' | 'completed';
  startTime: Date;
}

export default function CTOExpertConsultant() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<ConsultationSession | null>(null);
  const [sessions, setSessions] = useState<ConsultationSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const startNewSession = () => {
    const newSession: ConsultationSession = {
      id: Date.now().toString(),
      title: `CTO Strategy Session ${sessions.length + 1}`,
      messages: [{
        id: Date.now().toString(),
        type: 'assistant',
        content: `Hello! I'm your Chief Technology Officer consultant with 25+ years of experience in technology leadership and strategic innovation. I'm here to provide strategic guidance on:

• **Technology Strategy & Vision**
  - Digital transformation roadmaps
  - Technology architecture and platform strategy
  - Innovation strategy and emerging technology adoption
  - Technology investment planning and ROI optimization

• **Innovation & R&D Management**
  - Technology research and development planning
  - Innovation lab establishment and management
  - Emerging technology evaluation and adoption
  - Patent strategy and intellectual property management

• **Technology Leadership & Governance**
  - Technology team structure and talent strategy
  - Technology governance and decision frameworks
  - CTO-CEO alignment and board communication
  - Technology risk management and compliance

• **Digital Transformation**
  - Enterprise technology modernization
  - Legacy system migration strategies
  - Cloud adoption and hybrid infrastructure
  - Data strategy and analytics platform development

• **Technology Operations Excellence**
  - Technology performance optimization
  - Scalability and reliability engineering
  - DevOps and continuous delivery implementation
  - Technology cost optimization strategies

• **Emerging Technologies & Innovation**
  - AI/ML strategy and implementation roadmaps
  - IoT and edge computing strategies
  - Blockchain and distributed systems
  - Quantum computing and future technologies

What strategic technology challenge or opportunity can I help you navigate today?`,
        timestamp: new Date(),
        category: 'strategy'
      }],
      status: 'active',
      startTime: new Date()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentSession || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage]
    } : null);

    setMessage("");
    setIsLoading(true);

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const assistantResponse = generateCTOResponse(message.trim());
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: assistantResponse.content,
        timestamp: new Date(),
        category: assistantResponse.category
      };

      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, assistantMessage]
      } : null);

      // Update sessions array
      setSessions(prev => prev.map(session => 
        session.id === currentSession.id 
          ? { ...session, messages: [...session.messages, userMessage, assistantMessage] }
          : session
      ));

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from CTO consultant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCTOResponse = (userMessage: string): { content: string; category: Message['category'] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('strategy') || lowerMessage.includes('vision') || lowerMessage.includes('roadmap')) {
      return {
        content: `Excellent strategic question! As your CTO consultant, here's my comprehensive approach to technology strategy development:

**Strategic Technology Framework:**

**1. Vision & Strategy Alignment:**
• **Business-Technology Alignment**: Ensure technology strategy directly supports business objectives and revenue goals
• **Innovation Roadmap**: Develop 3-5 year technology roadmap with clear milestones and success metrics
• **Digital Transformation**: Create comprehensive digital transformation strategy with measurable outcomes
• **Competitive Advantage**: Identify technology differentiators that create sustainable competitive advantages

**2. Technology Architecture Strategy:**
• **Platform Strategy**: Design scalable, modular technology platforms that support business growth
• **Cloud-Native Approach**: Implement cloud-first strategy with hybrid and multi-cloud considerations
• **API-First Architecture**: Build interconnected systems with robust API strategies for integration
• **Data Architecture**: Create unified data strategy enabling analytics and AI/ML capabilities

**3. Innovation & Emerging Technology:**
• **Innovation Lab**: Establish dedicated innovation teams and processes for emerging technology evaluation
• **Technology Radar**: Implement systematic emerging technology assessment and adoption frameworks
• **R&D Investment**: Allocate 10-15% of technology budget to research and experimental initiatives
• **Partnership Strategy**: Build strategic technology partnerships with vendors, startups, and research institutions

**4. Implementation & Execution:**
• **Agile Portfolio Management**: Implement portfolio-level agile methodologies for technology initiatives
• **Technology Governance**: Establish clear decision-making frameworks and accountability structures
• **Risk Management**: Proactive technology risk assessment and mitigation strategies
• **Performance Metrics**: Define and track technology KPIs aligned with business outcomes

**Key Success Factors:**
• Executive sponsorship and cross-functional alignment
• Clear communication of technology value to stakeholders
• Balanced approach between innovation and operational excellence
• Continuous learning and adaptation based on market changes

What specific aspect of your technology strategy would you like to explore further - vision development, implementation planning, or innovation management?`,
        category: 'strategy'
      };
    }

    if (lowerMessage.includes('innovation') || lowerMessage.includes('emerging') || lowerMessage.includes('ai') || lowerMessage.includes('ml')) {
      return {
        content: `Innovation strategy is crucial for technology leadership! Here's my framework for building innovation excellence:

**Innovation Excellence Framework:**

**1. Innovation Strategy & Governance:**
• **Innovation Portfolio**: Balance incremental, breakthrough, and transformational innovation investments (70-20-10 rule)
• **Innovation Metrics**: Track innovation ROI, time-to-market, patent applications, and revenue from new products
• **Innovation Culture**: Foster experimentation, acceptable failure, and continuous learning mindset
• **Innovation Governance**: Establish innovation steering committee with clear funding and decision criteria

**2. Emerging Technology Adoption:**
• **Technology Horizon Scanning**: Systematic monitoring of emerging technologies and market trends
• **Proof of Concept Framework**: Structured approach to evaluating and testing new technologies
• **Technology Incubation**: Dedicated teams and resources for nurturing promising technologies
• **Scale-up Strategy**: Clear pathways from PoC to production implementation

**3. AI/ML Strategic Implementation:**
• **AI Strategy Roadmap**: Comprehensive AI/ML adoption strategy aligned with business value
• **Data Foundation**: Robust data infrastructure and governance for AI/ML success
• **AI Ethics & Governance**: Responsible AI frameworks addressing bias, transparency, and accountability
• **AI Talent Strategy**: Build internal AI capabilities through hiring, training, and partnerships

**4. Innovation Ecosystem Development:**
• **Internal Innovation Labs**: Dedicated innovation spaces and resources for experimentation
• **External Partnerships**: Strategic alliances with startups, universities, and technology vendors
• **Open Innovation**: Collaborative innovation with customers, suppliers, and industry partners
• **Venture Capital**: Strategic investments in startups and emerging technology companies

**5. Innovation Process & Methodology:**
• **Design Thinking**: Human-centered approach to innovation and problem-solving
• **Lean Startup**: Rapid experimentation and validated learning methodologies
• **Innovation Sprints**: Time-boxed innovation challenges and hackathons
• **Technology Scouting**: Systematic identification and evaluation of external innovations

**Implementation Recommendations:**
• Start with clear business problems and customer needs
• Establish innovation sandboxes for safe experimentation
• Create cross-functional innovation teams with diverse skills
• Implement rapid prototyping and iterative development processes
• Measure and communicate innovation success stories

Which aspect of innovation strategy interests you most - AI/ML adoption, emerging technology evaluation, or innovation culture development?`,
        category: 'innovation'
      };
    }

    if (lowerMessage.includes('team') || lowerMessage.includes('talent') || lowerMessage.includes('organization') || lowerMessage.includes('leadership')) {
      return {
        content: `Technology leadership and team development are fundamental to CTO success! Here's my comprehensive approach:

**Technology Leadership Excellence:**

**1. Technology Team Structure & Strategy:**
• **Organizational Design**: Build scalable technology organizations aligned with business architecture
• **Role Definition**: Clear roles, responsibilities, and career progression paths for technology professionals
• **Cross-functional Teams**: Product, engineering, and data teams working collaboratively toward shared goals
• **Center of Excellence**: Establish technology expertise centers for critical capabilities and standards

**2. Talent Acquisition & Development:**
• **Talent Strategy**: Comprehensive talent acquisition strategy including diversity, equity, and inclusion goals
• **Technical Competency**: Define required technical skills and competency frameworks for different roles
• **Leadership Development**: Systematic development of technical leaders and engineering managers
• **Continuous Learning**: Investment in ongoing education, certifications, and skill development programs

**3. Technology Culture & Engagement:**
• **Engineering Culture**: Foster culture of excellence, innovation, collaboration, and continuous improvement
• **Psychological Safety**: Create environment where teams can experiment, fail safely, and learn rapidly
• **Knowledge Sharing**: Implement communities of practice, tech talks, and documentation standards
• **Recognition & Rewards**: Align compensation and recognition with technology contribution and business value

**4. Performance & Productivity:**
• **Engineering Productivity**: Measure and optimize developer productivity, deployment frequency, and lead times
• **Performance Management**: Clear goal setting, regular feedback, and performance evaluation processes
• **Team Health Metrics**: Track team satisfaction, retention, and engagement through regular surveys
• **Agile Practices**: Implement agile methodologies optimized for technology team effectiveness

**5. Communication & Stakeholder Management:**
• **Executive Communication**: Translate technology strategy and progress into business language for leadership
• **Stakeholder Alignment**: Regular communication with product, sales, marketing, and customer success teams
• **Technology Evangelism**: Internal advocacy for technology initiatives and strategic importance
• **External Representation**: Thought leadership through speaking, writing, and industry participation

**Leadership Best Practices:**
• Lead by example with technical excellence and continuous learning
• Maintain technical credibility while developing business acumen
• Balance innovation with operational excellence and reliability
• Foster diversity of thought and inclusive decision-making processes
• Create clear vision and inspire teams toward shared technology goals

What specific leadership challenge are you facing - team scaling, culture development, stakeholder management, or performance optimization?`,
        category: 'recommendation'
      };
    }

    // Default strategic response
    return {
      content: `Thank you for bringing this important technology leadership question to my attention. As your CTO consultant, I want to ensure I provide the most strategic and actionable guidance.

**Strategic Technology Leadership Approach:**
• Technology decisions should drive business value and competitive advantage
• Implementation requires balancing innovation with operational excellence and risk management
• Success depends on strong technology governance, stakeholder alignment, and team execution

**My Recommended Strategic Framework:**
1. **Strategic Assessment**: Understand current technology landscape, business objectives, and market dynamics
2. **Vision Development**: Create compelling technology vision aligned with business strategy and market opportunities
3. **Roadmap Planning**: Develop actionable roadmap with clear priorities, timelines, and resource requirements
4. **Execution Excellence**: Implement with strong program management, risk mitigation, and performance measurement
5. **Continuous Innovation**: Establish systematic innovation processes and emerging technology evaluation

**Key Strategic Considerations:**
• How does this align with your overall business strategy and market positioning?
• What are the technology risks and how can we mitigate them effectively?
• How will this impact your technology team capabilities and organizational structure?
• What are the scalability and long-term strategic implications?
• How will you measure success and demonstrate ROI to stakeholders?

Could you provide more specific details about your technology challenge or strategic objective? This will help me offer more targeted recommendations based on my experience with similar technology leadership situations.`,
      category: 'strategy'
    };
  };

  const getMessageIcon = (category?: Message['category']) => {
    switch (category) {
      case 'strategy': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'innovation': return <Zap className="w-4 h-4 text-purple-500" />;
      case 'analysis': return <FileText className="w-4 h-4 text-green-500" />;
      case 'recommendation': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" />
            Expert CTO Strategic Consultant
          </h2>
          <p className="text-muted-foreground">
            Get strategic technology leadership guidance from a seasoned CTO
          </p>
        </div>
        <Button onClick={startNewSession} data-testid="button-new-cto-consultation">
          <MessageSquare className="w-4 h-4 mr-2" />
          New Strategy Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sessions Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Strategy Sessions</CardTitle>
            <CardDescription>Your CTO consultation history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions yet</p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentSession?.id === session.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => setCurrentSession(session)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{session.title}</span>
                    <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {session.startTime.toLocaleDateString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session.messages.length} messages
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/cto-avatar.png" />
                <AvatarFallback>
                  <Rocket className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>CTO Strategic Expert</CardTitle>
                <CardDescription>25+ years of technology leadership and innovation experience</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentSession ? (
              <>
                {/* Messages */}
                <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 border rounded-lg">
                  {currentSession.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.type === 'assistant' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {msg.type === 'assistant' && msg.category && (
                          <div className="flex items-center gap-2 mb-2">
                            {getMessageIcon(msg.category)}
                            <Badge variant="outline" className="text-xs">
                              {msg.category}
                            </Badge>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      {msg.type === 'user' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse flex space-x-1">
                            <div className="rounded-full bg-primary h-2 w-2"></div>
                            <div className="rounded-full bg-primary h-2 w-2"></div>
                            <div className="rounded-full bg-primary h-2 w-2"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">CTO analyzing strategy...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your CTO consultant about strategy, innovation, teams..."
                    disabled={isLoading}
                    data-testid="input-cto-consultant-message"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!message.trim() || isLoading}
                    data-testid="button-send-cto-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start a new CTO strategy session</p>
                <p className="text-sm">Get expert technology leadership guidance tailored to your needs</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}