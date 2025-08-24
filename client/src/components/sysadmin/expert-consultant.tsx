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
  Monitor, 
  MessageSquare,
  Clock,
  CheckCircle,
  FileText,
  Lightbulb,
  AlertTriangle,
  Server,
  Settings
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'troubleshooting' | 'maintenance' | 'security' | 'guidance';
}

interface ConsultationSession {
  id: string;
  title: string;
  messages: Message[];
  status: 'active' | 'completed';
  startTime: Date;
}

export default function SysAdminExpertConsultant() {
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
      title: `SysAdmin Support ${sessions.length + 1}`,
      messages: [{
        id: Date.now().toString(),
        type: 'assistant',
        content: `Hello! I'm your expert System Administrator consultant with 20+ years of hands-on experience in system administration and IT operations. I'm here to provide technical guidance on:

• **System Administration & Operations**
  - Server configuration and management (Windows/Linux)
  - System monitoring and performance optimization
  - User account and access management
  - System maintenance and patching procedures

• **Infrastructure Management**
  - Network administration and troubleshooting
  - Database administration and backup procedures
  - Virtualization and container management
  - Cloud infrastructure and hybrid environments

• **Security & Compliance**
  - System security hardening and configuration
  - Security monitoring and incident response
  - Compliance procedures and audit preparation
  - Access control and privilege management

• **Troubleshooting & Problem Resolution**
  - System performance issues and bottlenecks
  - Network connectivity and routing problems
  - Application and service failures
  - Hardware and software compatibility issues

• **Automation & Process Improvement**
  - Scripting and automation solutions
  - Configuration management and deployment
  - Monitoring and alerting setup
  - Documentation and procedure standardization

• **Disaster Recovery & Business Continuity**
  - Backup and recovery procedures
  - Disaster recovery planning and testing
  - High availability and failover configurations
  - Emergency response procedures

What system administration challenge or technical issue can I help you resolve today?`,
        timestamp: new Date(),
        category: 'guidance'
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

      const assistantResponse = generateSysAdminResponse(message.trim());
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
        description: "Failed to get response from SysAdmin consultant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSysAdminResponse = (userMessage: string): { content: string; category: Message['category'] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('slow') || lowerMessage.includes('optimization')) {
      return {
        content: `Performance issues require systematic diagnosis. Here's my troubleshooting approach:

**System Performance Analysis Framework:**

**1. Initial Assessment:**
• **Resource Utilization**: Check CPU, memory, disk I/O, and network utilization using tools like top, htop, iotop, and netstat
• **System Load**: Monitor system load averages and identify processes consuming the most resources
• **Disk Space**: Verify sufficient disk space and check for full partitions or mount points
• **System Logs**: Review system logs (/var/log/messages, Event Viewer) for errors or warnings

**2. Performance Monitoring:**
• **Real-time Monitoring**: Use tools like vmstat, iostat, sar, or Performance Monitor for real-time analysis
• **Historical Data**: Analyze trends using monitoring tools like Nagios, Zabbix, or built-in performance counters
• **Baseline Comparison**: Compare current performance against historical baselines
• **Peak Usage Analysis**: Identify peak usage periods and resource contention patterns

**3. Common Performance Bottlenecks:**
• **CPU Bottlenecks**: High CPU usage from processes, inadequate processing power, or CPU-intensive applications
• **Memory Issues**: Insufficient RAM, memory leaks, excessive swapping, or memory fragmentation
• **Disk I/O Problems**: Slow storage, disk fragmentation, inadequate disk bandwidth, or failed drives
• **Network Bottlenecks**: Network congestion, bandwidth limitations, or network interface issues

**4. Optimization Strategies:**
• **Process Optimization**: Identify and optimize resource-intensive processes
• **Service Configuration**: Tune service parameters and configurations for optimal performance
• **Hardware Upgrades**: Recommend hardware improvements based on bottleneck analysis
• **System Tuning**: Adjust kernel parameters, file system settings, and system configurations

**5. Preventive Measures:**
• **Regular Monitoring**: Implement continuous monitoring with alerting for performance thresholds
• **Capacity Planning**: Proactive capacity planning based on growth trends and usage patterns
• **Maintenance Schedules**: Regular system maintenance, updates, and optimization tasks
• **Documentation**: Maintain performance baselines and optimization procedures

**Immediate Actions:**
1. Run performance monitoring tools to identify current bottlenecks
2. Check system logs for any error messages or warnings
3. Identify top resource-consuming processes and analyze their necessity
4. Review recent changes that might have impacted performance
5. Implement immediate optimizations while planning long-term solutions

What specific performance symptoms are you experiencing, and what type of system environment are we working with?`,
        category: 'troubleshooting'
      };
    }

    if (lowerMessage.includes('backup') || lowerMessage.includes('recovery') || lowerMessage.includes('disaster')) {
      return {
        content: `Backup and disaster recovery are critical! Here's my comprehensive approach:

**Backup and Recovery Best Practices:**

**1. Backup Strategy Framework:**
• **3-2-1 Rule**: 3 copies of data, 2 different media types, 1 offsite backup
• **Recovery Objectives**: Define RTO (Recovery Time Objective) and RPO (Recovery Point Objective)
• **Backup Types**: Full, incremental, and differential backups with appropriate scheduling
• **Data Classification**: Prioritize critical data and systems for backup frequency and retention

**2. Backup Implementation:**
• **Automated Scheduling**: Implement automated backup schedules with monitoring and alerting
• **Verification Testing**: Regular backup integrity testing and restore verification procedures
• **Documentation**: Maintain detailed backup procedures, schedules, and recovery instructions
• **Monitoring**: Continuous monitoring of backup job success/failure with immediate alerting

**3. Recovery Planning:**
• **Disaster Recovery Plan**: Comprehensive DR plan with step-by-step recovery procedures
• **Recovery Testing**: Regular DR testing and plan validation with documented results
• **Recovery Procedures**: Detailed procedures for different disaster scenarios and system failures
• **Communication Plan**: Emergency communication procedures and contact information

**4. Technical Implementation:**

**For Windows Environments:**
• Windows Server Backup or third-party solutions like Veeam, Acronis
• System State backups including Active Directory and system configuration
• Application-specific backups (SQL Server, Exchange, etc.)
• File-level and bare-metal recovery options

**For Linux Environments:**
• Tools like rsync, tar, dd for file-level backups
• LVM snapshots for consistent point-in-time backups
• Database-specific backup tools (mysqldump, pg_dump)
• Full system imaging with tools like Clonezilla or dd

**5. Cloud and Hybrid Backup:**
• Cloud backup solutions for offsite storage and geographic redundancy
• Hybrid backup strategies combining local and cloud storage
• Cloud-native backup services (AWS Backup, Azure Backup, Google Cloud)
• Encryption and security considerations for cloud-stored backups

**6. Backup Security:**
• Encryption of backup data both in transit and at rest
• Access controls and authentication for backup systems
• Immutable backups to protect against ransomware
• Secure offsite storage with proper access controls

**Recovery Procedures:**
1. **Immediate Assessment**: Evaluate the scope and impact of the failure
2. **Recovery Decision**: Determine appropriate recovery method based on failure type
3. **Recovery Execution**: Follow documented procedures with proper validation
4. **System Validation**: Comprehensive testing after recovery completion
5. **Post-Recovery Analysis**: Document lessons learned and update procedures

What specific backup or recovery scenario are you dealing with, and what systems need protection?`,
        category: 'maintenance'
      };
    }

    if (lowerMessage.includes('security') || lowerMessage.includes('patch') || lowerMessage.includes('vulnerability')) {
      return {
        content: `System security is paramount! Here's my comprehensive security management approach:

**System Security Framework:**

**1. Security Hardening:**
• **Operating System Hardening**: Follow security benchmarks (CIS, STIG) for OS configuration
• **Service Minimization**: Disable unnecessary services and remove unused software
• **Account Security**: Strong password policies, account lockout policies, and regular password changes
• **File System Security**: Proper file permissions, access controls, and encryption for sensitive data

**2. Patch Management:**
• **Patch Assessment**: Regular vulnerability scanning and patch assessment procedures
• **Testing Environment**: Test patches in non-production environment before deployment
• **Patch Scheduling**: Scheduled maintenance windows for critical and non-critical patches
• **Emergency Patching**: Procedures for emergency security patches and zero-day vulnerabilities

**3. Access Control and Authentication:**
• **Principle of Least Privilege**: Users and services have minimum required access
• **Multi-Factor Authentication**: Implement MFA for administrative and privileged accounts
• **Account Management**: Regular review of user accounts, permissions, and access rights
• **Privileged Access Management**: Secure management of administrator and service accounts

**4. Security Monitoring:**
• **Log Management**: Centralized logging and log analysis for security events
• **Intrusion Detection**: IDS/IPS systems for network and host-based monitoring
• **Security Information and Event Management (SIEM)**: Centralized security monitoring
• **Vulnerability Scanning**: Regular vulnerability assessments and penetration testing

**5. Network Security:**
• **Firewall Configuration**: Properly configured firewalls with minimal open ports
• **Network Segmentation**: Isolate critical systems and limit network access
• **Secure Protocols**: Use encrypted protocols (SSH, HTTPS, SFTP) instead of plain text
• **Network Monitoring**: Monitor network traffic for suspicious activities

**6. Incident Response:**
• **Incident Response Plan**: Documented procedures for security incident handling
• **Forensic Capabilities**: Tools and procedures for security incident investigation
• **Communication Procedures**: Internal and external communication during security incidents
• **Recovery Procedures**: System restoration and hardening after security incidents

**Patch Management Process:**
1. **Inventory Management**: Maintain current inventory of all systems and applications
2. **Vulnerability Assessment**: Regular scanning for security vulnerabilities
3. **Patch Testing**: Test patches in isolated environment before production deployment
4. **Deployment Planning**: Schedule and coordinate patch deployment with stakeholders
5. **Verification**: Confirm successful patch installation and system functionality
6. **Documentation**: Document all patch activities and maintain patch status records

**Security Best Practices:**
• Regular security audits and compliance assessments
• Employee security awareness training and education
• Backup and disaster recovery procedures for security incidents
• Regular review and update of security policies and procedures
• Vendor security assessment for third-party systems and services

What specific security concern or vulnerability are you addressing, and what type of environment needs securing?`,
        category: 'security'
      };
    }

    // Default technical response
    return {
      content: `Thank you for bringing this system administration question to my attention. I want to provide you with the most effective technical solution.

**System Administration Best Practices:**
• Technical solutions should be thoroughly tested before production implementation
• Implementation requires proper planning, documentation, and rollback procedures
• Success depends on systematic troubleshooting, monitoring, and preventive maintenance

**My Recommended Technical Approach:**
1. **Problem Assessment**: Detailed analysis of current system state and issue symptoms
2. **Solution Planning**: Develop comprehensive solution with testing and validation steps
3. **Implementation**: Execute changes with proper change management and monitoring
4. **Validation**: Thoroughly test and verify solution effectiveness
5. **Documentation**: Document procedures and maintain system configuration records

**Key Technical Considerations:**
• What are the specific symptoms or error messages you're experiencing?
• What changes were made recently that might have caused the issue?
• What is the criticality and impact of the affected systems?
• What are the available maintenance windows and rollback options?
• What monitoring and logging information is available for diagnosis?

Could you provide more specific details about your system administration challenge? This will help me offer more targeted technical guidance based on my experience with similar system issues.

For immediate assistance, please share:
- Operating system and version information
- Specific error messages or symptoms
- Recent system changes or updates
- Impact on users and business operations`,
      category: 'guidance'
    };
  };

  const getMessageIcon = (category?: Message['category']) => {
    switch (category) {
      case 'troubleshooting': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'maintenance': return <Settings className="w-4 h-4 text-blue-500" />;
      case 'security': return <Server className="w-4 h-4 text-orange-500" />;
      case 'guidance': return <Lightbulb className="w-4 h-4 text-green-500" />;
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
            <Monitor className="w-6 h-6 text-primary" />
            Expert System Administrator Consultant
          </h2>
          <p className="text-muted-foreground">
            Get technical system administration guidance from an experienced professional
          </p>
        </div>
        <Button onClick={startNewSession} data-testid="button-new-sysadmin-consultation">
          <MessageSquare className="w-4 h-4 mr-2" />
          New Support Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sessions Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Support Sessions</CardTitle>
            <CardDescription>Your system administration consultation history</CardDescription>
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
                <AvatarImage src="/sysadmin-avatar.png" />
                <AvatarFallback>
                  <Monitor className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>System Administration Expert</CardTitle>
                <CardDescription>20+ years of hands-on system administration experience</CardDescription>
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
                          <span className="text-sm text-muted-foreground">SysAdmin analyzing issue...</span>
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
                    placeholder="Ask about system issues, maintenance, security, troubleshooting..."
                    disabled={isLoading}
                    data-testid="input-sysadmin-consultant-message"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!message.trim() || isLoading}
                    data-testid="button-send-sysadmin-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start a new system administration support session</p>
                <p className="text-sm">Get expert technical guidance for your system challenges</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}