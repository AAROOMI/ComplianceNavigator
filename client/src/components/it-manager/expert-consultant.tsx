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
  Settings, 
  MessageSquare,
  Clock,
  CheckCircle,
  FileText,
  Lightbulb,
  AlertTriangle,
  Network,
  Server
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'question' | 'recommendation' | 'analysis' | 'warning';
}

interface ConsultationSession {
  id: string;
  title: string;
  messages: Message[];
  status: 'active' | 'completed';
  startTime: Date;
}

export default function ITManagerExpertConsultant() {
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
      title: `IT Consultation ${sessions.length + 1}`,
      messages: [{
        id: Date.now().toString(),
        type: 'assistant',
        content: `Hello! I'm your expert IT Manager consultant with 30 years of experience in information technology management. I'm here to provide strategic guidance on:

• **Infrastructure Planning & Design**
  - Network architecture and system design
  - Cloud migration and hybrid infrastructure
  - Scalability and performance optimization

• **IT Operations Management**
  - Service delivery and ITIL best practices
  - Incident and change management
  - Monitoring and maintenance strategies

• **Technology Strategy & Governance**
  - IT strategic planning and roadmaps
  - Technology evaluation and selection
  - Digital transformation initiatives

• **Budget & Resource Management**
  - IT budget planning and cost optimization
  - Staff planning and skills development
  - Vendor management and procurement

• **Security & Compliance**
  - IT security frameworks and policies
  - Risk assessment and mitigation
  - Regulatory compliance management

• **Project Management**
  - IT project planning and execution
  - Agile and traditional methodologies
  - Stakeholder management and communication

What IT challenge or strategic initiative can I help you with today?`,
        timestamp: new Date(),
        category: 'question'
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

      const assistantResponse = generateITManagerResponse(message.trim());
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
        description: "Failed to get response from IT Manager consultant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateITManagerResponse = (userMessage: string): { content: string; category: Message['category'] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('infrastructure') || lowerMessage.includes('network') || lowerMessage.includes('architecture')) {
      return {
        content: `Excellent question about IT infrastructure! Based on my 30 years of experience, here's my strategic approach:

**Infrastructure Assessment Framework:**

**1. Current State Analysis:**
• Network topology and capacity assessment
• Server and storage utilization analysis
• Application performance and dependencies mapping
• Security posture and vulnerability assessment

**2. Future State Design:**
• Business requirements alignment
• Scalability and growth projections
• Technology refresh and modernization planning
• Cloud adoption and hybrid strategies

**3. Implementation Roadmap:**
• Phase-based approach with minimal disruption
• Risk mitigation and contingency planning
• Budget allocation and resource planning
• Timeline with clear milestones and dependencies

**Key Considerations:**
• **Performance**: Ensure adequate capacity for current and future needs
• **Reliability**: Build redundancy and failover capabilities
• **Security**: Implement defense-in-depth strategies
• **Cost Optimization**: Balance performance with budget constraints
• **Compliance**: Meet regulatory and industry standards

**Technology Recommendations:**
• Software-defined infrastructure for flexibility
• Hybrid cloud for optimal workload placement
• Network segmentation for security
• Automated monitoring and management tools

What specific aspect of your infrastructure would you like to dive deeper into?`,
        category: 'recommendation'
      };
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('planning')) {
      return {
        content: `IT budget planning is crucial for organizational success. Here's my proven approach:

**Strategic IT Budget Framework:**

**1. Budget Categories (Industry Standard Allocation):**
• **Infrastructure**: 35-40% (Hardware, software, cloud services)
• **Operations**: 25-30% (Staff, maintenance, support)
• **Projects**: 15-20% (New initiatives, upgrades)
• **Security**: 10-15% (Tools, training, compliance)
• **Contingency**: 5-10% (Emergency funds, unexpected needs)

**2. Budget Planning Process:**
• **Business Alignment**: Connect IT investments to business outcomes
• **Asset Inventory**: Understand current technology landscape
• **Lifecycle Management**: Plan for refresh cycles and end-of-life
• **Risk Assessment**: Account for security and compliance needs

**3. Cost Optimization Strategies:**
• **Cloud Economics**: Right-size cloud resources and leverage reserved instances
• **Vendor Consolidation**: Negotiate enterprise agreements and volume discounts
• **Automation**: Reduce operational costs through process automation
• **Energy Efficiency**: Implement green IT practices to reduce power costs

**4. ROI Measurement:**
• **Productivity Gains**: Measure efficiency improvements
• **Cost Avoidance**: Calculate prevented outages and security incidents
• **Business Enablement**: Track revenue-generating capabilities
• **Risk Reduction**: Quantify compliance and security improvements

**Executive Communication Tips:**
• Present IT spending as business investment
• Use business language and outcomes
• Provide clear metrics and success criteria
• Include competitive analysis and benchmarking

What specific budget area would you like to explore further?`,
        category: 'recommendation'
      };
    }

    if (lowerMessage.includes('cloud') || lowerMessage.includes('migration') || lowerMessage.includes('digital transformation')) {
      return {
        content: `Cloud migration and digital transformation require careful strategic planning. Here's my approach:

**Cloud Migration Strategy:**

**1. Assessment Phase:**
• **Application Portfolio Analysis**: Categorize applications by complexity and business value
• **Cloud Readiness Assessment**: Evaluate technical compatibility and dependencies
• **Cost-Benefit Analysis**: Compare on-premises vs. cloud economics
• **Risk Assessment**: Identify security, compliance, and operational risks

**2. Migration Approach (6 R's):**
• **Rehost (Lift & Shift)**: Quick migration with minimal changes
• **Replatform**: Minor optimizations for cloud benefits
• **Refactor**: Redesign applications for cloud-native capabilities
• **Retire**: Decommission redundant or obsolete applications
• **Retain**: Keep on-premises for specific requirements
• **Repurchase**: Replace with SaaS solutions

**3. Implementation Framework:**
• **Pilot Phase**: Start with low-risk, high-value applications
• **Wave-based Migration**: Group applications logically
• **Parallel Operation**: Run dual environments during transition
• **Optimization**: Continuously improve performance and costs

**4. Success Factors:**
• **Executive Sponsorship**: Ensure leadership commitment
• **Skills Development**: Train teams on cloud technologies
• **Change Management**: Prepare organization for new processes
• **Governance**: Establish cloud policies and standards

**Digital Transformation Enablers:**
• Data analytics and business intelligence
• Automation and AI integration
• Enhanced collaboration tools
• Customer experience improvements
• Agile development practices

What aspect of your cloud or digital transformation journey would you like to focus on?`,
        category: 'analysis'
      };
    }

    if (lowerMessage.includes('team') || lowerMessage.includes('staff') || lowerMessage.includes('hiring') || lowerMessage.includes('skills')) {
      return {
        content: `IT team management and development is critical for organizational success. Here's my framework:

**IT Team Strategy Framework:**

**1. Organizational Structure:**
• **Skill-based Teams**: Organize around core competencies (infrastructure, development, security)
• **Cross-functional Teams**: Create teams with diverse skills for complex projects
• **Center of Excellence**: Establish expertise hubs for emerging technologies
• **Vendor Partnerships**: Supplement internal teams with strategic partnerships

**2. Skills Assessment and Planning:**
• **Current State Mapping**: Inventory existing skills and competencies
• **Future State Vision**: Identify skills needed for strategic initiatives
• **Gap Analysis**: Determine training and hiring priorities
• **Career Development**: Create progression paths for team members

**3. Talent Acquisition Strategy:**
• **Hybrid Approach**: Balance full-time employees with contractors
• **Remote Work**: Expand talent pool through flexible work arrangements
• **University Partnerships**: Develop internship and graduate programs
• **Internal Mobility**: Promote from within and cross-train existing staff

**4. Team Development:**
• **Continuous Learning**: Provide training budgets and certification programs
• **Mentorship Programs**: Pair senior staff with junior team members
• **Knowledge Sharing**: Implement communities of practice and documentation
• **Innovation Time**: Allow dedicated time for exploration and experimentation

**5. Performance Management:**
• **Clear Objectives**: Set SMART goals aligned with business outcomes
• **Regular Feedback**: Implement continuous performance discussions
• **Recognition Programs**: Celebrate achievements and contributions
• **Career Planning**: Provide growth opportunities and advancement paths

**Key Leadership Principles:**
• Lead by example and maintain technical credibility
• Foster a culture of collaboration and continuous improvement
• Communicate vision clearly and inspire team engagement
• Balance technical excellence with business value delivery

What specific team challenge are you facing - skills development, retention, hiring, or organizational structure?`,
        category: 'recommendation'
      };
    }

    // Default strategic response
    return {
      content: `Thank you for bringing this important IT matter to my attention. As your IT Manager consultant, I want to ensure I provide you with the most relevant and actionable guidance.

**Strategic IT Considerations:**
• Technology solutions should always align with business objectives and deliver measurable value
• Implementation requires careful planning considering technical feasibility, resource requirements, and risk management
• Success depends on proper change management, user adoption, and ongoing support

**My Recommended Approach:**
1. **Discovery & Assessment**: Understand current state, requirements, and constraints
2. **Strategic Planning**: Develop comprehensive roadmap with clear priorities
3. **Proof of Concept**: Validate approach with pilot implementation
4. **Scaled Implementation**: Execute with proper project management and risk mitigation
5. **Optimization**: Continuously improve based on metrics and feedback

**Key Questions to Consider:**
• What are the primary business drivers and success criteria?
• What are your current technical constraints and resource limitations?
• How does this align with your overall IT strategy and architecture?
• What are the security, compliance, and operational implications?
• What change management and training requirements should we consider?

Could you provide more specific details about your situation or challenge? This will help me offer more targeted recommendations based on my experience with similar IT initiatives.`,
      category: 'question'
    };
  };

  const getMessageIcon = (category?: Message['category']) => {
    switch (category) {
      case 'recommendation': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'analysis': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'question': return <MessageSquare className="w-4 h-4 text-green-500" />;
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
            <Settings className="w-6 h-6 text-primary" />
            Expert IT Manager Consultant
          </h2>
          <p className="text-muted-foreground">
            Get strategic IT guidance from a seasoned technology leader
          </p>
        </div>
        <Button onClick={startNewSession} data-testid="button-new-it-consultation">
          <MessageSquare className="w-4 h-4 mr-2" />
          New Consultation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sessions Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Consultation History</CardTitle>
            <CardDescription>Your IT consultation sessions</CardDescription>
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
                <AvatarImage src="/it-manager-avatar.png" />
                <AvatarFallback>
                  <Settings className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>IT Manager Expert</CardTitle>
                <CardDescription>30+ years of IT management and strategy experience</CardDescription>
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
                          <span className="text-sm text-muted-foreground">IT Manager is analyzing...</span>
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
                    placeholder="Ask your IT Manager consultant about infrastructure, strategy, teams..."
                    disabled={isLoading}
                    data-testid="input-it-consultant-message"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!message.trim() || isLoading}
                    data-testid="button-send-it-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start a new IT consultation session</p>
                <p className="text-sm">Get expert IT management guidance tailored to your needs</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}