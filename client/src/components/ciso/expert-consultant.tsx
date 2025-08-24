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
  Shield, 
  MessageSquare,
  Clock,
  CheckCircle,
  FileText,
  Lightbulb,
  AlertTriangle
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

export default function CISOExpertConsultant() {
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
      title: `Consultation ${sessions.length + 1}`,
      messages: [{
        id: Date.now().toString(),
        type: 'assistant',
        content: `Hello! I'm your expert CISO consultant with 30 years of experience in executive cybersecurity management. I'm here to provide comprehensive guidance on:

• Security strategy and governance
• Risk management and compliance
• Incident response planning
• Security architecture design
• Budget planning and ROI analysis
• Team leadership and organizational development
• Third-party risk management
• Executive reporting and communication

What cybersecurity challenge can I help you with today?`,
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

      const assistantResponse = generateCISOResponse(message.trim());
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
        description: "Failed to get response from CISO consultant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCISOResponse = (userMessage: string): { content: string; category: Message['category'] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('roi')) {
      return {
        content: `Excellent question about cybersecurity budgeting. Based on my 30 years of experience, here's my strategic approach:

**Budget Allocation Framework:**
• 40-45% for preventive controls (firewalls, endpoint protection, monitoring)
• 25-30% for detection and response capabilities (SIEM, SOC, incident response)
• 15-20% for compliance and governance programs
• 10-15% for training and awareness initiatives

**ROI Calculation Methodology:**
1. **Risk Reduction Value**: Calculate potential losses prevented
2. **Compliance Cost Avoidance**: Fines and penalties avoided
3. **Operational Efficiency**: Time saved through automation
4. **Business Enablement**: Revenue opportunities created

**Executive Communication Tips:**
• Frame security investments as business enablers
• Use business language, not technical jargon
• Provide clear metrics and success indicators
• Demonstrate alignment with business objectives

Would you like me to dive deeper into any specific aspect of security budgeting or help you prepare a business case for a particular security investment?`,
        category: 'recommendation'
      };
    }

    if (lowerMessage.includes('incident') || lowerMessage.includes('response') || lowerMessage.includes('breach')) {
      return {
        content: `Incident response is critical for organizational resilience. Here's my proven framework:

**The CISO's Incident Response Strategy:**

**1. Preparation Phase:**
• Establish clear escalation procedures
• Define communication protocols (internal & external)
• Pre-position legal and PR resources
• Create executive briefing templates

**2. Detection & Analysis:**
• Implement 24/7 monitoring capabilities
• Establish severity classification system
• Define evidence preservation procedures
• Create technical and business impact assessments

**3. Containment & Eradication:**
• Immediate containment procedures
• Forensic preservation protocols
• Business continuity activation
• Stakeholder communication management

**4. Recovery & Lessons Learned:**
• Systematic recovery procedures
• Post-incident review process
• Control improvements identification
• Executive summary and recommendations

**Executive Considerations:**
• Board notification requirements (usually within 2-4 hours for major incidents)
• Legal and regulatory obligations
• Customer and media communication strategies
• Insurance claim procedures

What specific aspect of incident response would you like to explore further?`,
        category: 'analysis'
      };
    }

    if (lowerMessage.includes('compliance') || lowerMessage.includes('audit') || lowerMessage.includes('regulation')) {
      return {
        content: `Compliance management is a cornerstone of effective cybersecurity governance. Here's my strategic approach:

**Executive Compliance Framework:**

**1. Regulatory Landscape Management:**
• Maintain a compliance requirements matrix
• Establish regulatory change monitoring
• Create cross-functional compliance committees
• Implement regular compliance assessments

**2. Control Implementation Strategy:**
• Risk-based control prioritization
• Automated compliance monitoring where possible
• Clear ownership and accountability models
• Regular control effectiveness testing

**3. Audit Readiness:**
• Continuous audit preparation processes
• Centralized evidence management
• Clear audit trail documentation
• Executive summary dashboards

**4. Board and Executive Reporting:**
• Monthly compliance scorecards
• Quarterly risk and compliance reviews
• Annual compliance program assessments
• Exception reporting and remediation tracking

**Key Success Factors:**
• Integrate compliance into business processes
• Use technology to automate compliance monitoring
• Maintain clear communication with business units
• Establish strong relationships with internal audit and legal

Which compliance area would you like to focus on - NCA ECC, ISO 27001, NIST CSF, or industry-specific regulations?`,
        category: 'recommendation'
      };
    }

    if (lowerMessage.includes('team') || lowerMessage.includes('staff') || lowerMessage.includes('hiring') || lowerMessage.includes('leadership')) {
      return {
        content: `Building and leading effective cybersecurity teams is one of the most challenging aspects of the CISO role. Here's my approach:

**Strategic Team Building Framework:**

**1. Organizational Structure:**
• Separate operational and strategic functions
• Create clear career progression paths
• Establish centers of excellence for key areas
• Balance internal hiring with strategic outsourcing

**2. Talent Acquisition Strategy:**
• Focus on potential and cultural fit, not just technical skills
• Develop partnerships with universities and training programs
• Create attractive value propositions beyond just salary
• Implement comprehensive onboarding programs

**3. Retention and Development:**
• Provide continuous learning opportunities
• Offer challenging and meaningful work assignments
• Recognize and reward contributions publicly
• Create mentorship and cross-training programs

**4. Performance Management:**
• Set clear, measurable objectives
• Provide regular feedback and coaching
• Connect individual goals to organizational objectives
• Celebrate successes and learn from failures

**Executive Leadership Principles:**
• Lead by example and maintain high ethical standards
• Communicate vision clearly and consistently
• Empower teams to make decisions within their authority
• Foster a culture of continuous improvement and innovation

What specific team challenge are you facing - recruitment, retention, skill development, or organizational structure?`,
        category: 'recommendation'
      };
    }

    // Default strategic response
    return {
      content: `Thank you for bringing this important cybersecurity matter to my attention. As your CISO consultant, I want to ensure I provide you with the most relevant and actionable guidance.

**Strategic Considerations:**
• This requires a holistic approach considering business impact, technical feasibility, and resource allocation
• We should align any solution with your organization's risk appetite and compliance requirements
• Implementation should follow a phased approach with clear success metrics

**Next Steps I Recommend:**
1. **Assessment**: Conduct a thorough analysis of current state
2. **Strategy Development**: Create a comprehensive plan with stakeholder input
3. **Implementation Planning**: Develop detailed project plans with timelines
4. **Monitoring & Measurement**: Establish KPIs and regular review processes

**Questions for Deeper Analysis:**
• What is the business context and urgency for this initiative?
• What are your primary constraints (budget, timeline, resources)?
• How does this align with your overall security strategy?
• What stakeholders need to be involved in the decision-making process?

Could you provide more specific details about your situation so I can offer more targeted recommendations based on my experience with similar challenges?`,
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
            <Shield className="w-6 h-6 text-primary" />
            Expert CISO Consultant
          </h2>
          <p className="text-muted-foreground">
            Get strategic cybersecurity guidance from a seasoned executive
          </p>
        </div>
        <Button onClick={startNewSession} data-testid="button-new-consultation">
          <MessageSquare className="w-4 h-4 mr-2" />
          New Consultation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sessions Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Consultation History</CardTitle>
            <CardDescription>Your previous sessions</CardDescription>
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
                <AvatarImage src="/ciso-avatar.png" />
                <AvatarFallback>
                  <Shield className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Chief Information Security Officer</CardTitle>
                <CardDescription>30+ years of executive cybersecurity experience</CardDescription>
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
                          <span className="text-sm text-muted-foreground">CISO is analyzing...</span>
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
                    placeholder="Ask your CISO consultant anything about cybersecurity strategy..."
                    disabled={isLoading}
                    data-testid="input-consultant-message"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!message.trim() || isLoading}
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start a new consultation session</p>
                <p className="text-sm">Get expert cybersecurity guidance tailored to your needs</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}