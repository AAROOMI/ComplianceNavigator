import React from 'react';
import { useLocation } from 'wouter';
import { useSidebar } from '@/components/ui/sidebar-context';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, FileText, ClipboardCheck, Bot, LayoutDashboard, AlertTriangle, Shield, Database, Settings, Rocket, Monitor, Users, GraduationCap, Book, Award, Brain, Upload } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import ceoImage from '../../assets/ceo-removebg-preview_1756122016972.png';

export default function Sidebar() {
  const [location] = useLocation();
  const { isOpen } = useSidebar();
  const { t } = useTranslation();

  const mainLinks = [
    { href: "/dashboard", label: t('navigation.dashboard'), icon: LayoutDashboard, testId: "sidebar-dashboard" },
    { href: "/policies", label: t('navigation.policies'), icon: FileText, testId: "sidebar-policies" },
    { href: "/document-management", label: "Document Lifecycle", icon: FileText, testId: "sidebar-document-management" },
    { href: "/policy-upload", label: "Policy & Logo Upload", icon: Upload, testId: "sidebar-policy-upload" },
    { href: "/nca-ecc", label: "NCA ECC", icon: ShieldCheck, testId: "sidebar-nca-ecc" },
    { href: "/nca-ecc-implementation", label: "NCA ECC Implementation", icon: ShieldCheck, testId: "sidebar-nca-ecc-implementation" },
    { href: "/ecc-navigator", label: "ECC Navigator", icon: ShieldCheck, testId: "sidebar-ecc-navigator" },
    { href: "/metaworks", label: "Metaworks V1&V2", icon: ShieldCheck, testId: "sidebar-metaworks" },
    { href: "/nfrm", label: t('navigation.riskManagement'), icon: AlertTriangle, testId: "sidebar-risk-management" },
    { href: "/assistant", label: t('navigation.aiConsultant'), icon: Bot, testId: "sidebar-ai-consultant" },
  ];

  const assessmentLinks = [
    { href: "/assessment", label: "Assessment Questionnaire", icon: ClipboardCheck, testId: "sidebar-assessment" },
    { href: "/risk-register", label: "Risk Register", icon: Database, testId: "sidebar-risk-register" },
    { href: "/risk-assessment", label: "Interactive Risk Assessment", icon: AlertTriangle, testId: "sidebar-risk-assessment" },
    { href: "/cybersecurity-risk-dashboard", label: "Cybersecurity Risk Dashboard", icon: Shield, testId: "sidebar-cybersecurity-risk-dashboard" },
    { href: "/dashboard", label: "Risk Dashboard", icon: LayoutDashboard, testId: "sidebar-risk-dashboard" },
  ];

  const trainingLinks = [
    { href: "/user-awareness", label: t('navigation.userAwareness'), icon: GraduationCap, testId: "sidebar-user-awareness" },
    { href: "/training-materials", label: t('navigation.trainingMaterials'), icon: Book, testId: "sidebar-training-materials" },
    { href: "/competency-badges", label: t('navigation.competencyBadges'), icon: Award, testId: "sidebar-competency-badges" },
    { href: "/security-quizzes", label: "Security Quizzes", icon: Brain, testId: "sidebar-security-quizzes" },
  ];

  const roleLinks = [
    { href: "/ciso-portal", label: "CISO Portal", icon: Shield, testId: "sidebar-ciso-portal" },
    { href: "/it-manager", label: "IT Manager Portal", icon: Settings, testId: "sidebar-it-manager" },
    { href: "/cto-dashboard", label: "CTO Dashboard", icon: Rocket, testId: "sidebar-cto-dashboard" },
    { href: "/sysadmin-tools", label: "System Admin Tools", icon: Monitor, testId: "sidebar-sysadmin-tools" },
  ];

  const managementLinks = [
    { href: "/user-management", label: t('navigation.userManagement'), icon: Users, testId: "sidebar-user-management" },
  ];

  return (
    <aside
      className={`h-screen w-64 bg-background border-r transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">MetaWorks</h1>
          </div>
          {/* CEO Picture */}
          <div className="flex flex-col items-center">
            <div 
              className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 hover:border-primary/40 relative z-10"
              onClick={(e) => {
                console.log('🔥🔥🔥 SARAH JOHNSON PICTURE CLICKED!!!');
                e.preventDefault();
                e.stopPropagation();
                
                // ALWAYS create Sarah chat - don't depend on D-ID
                try {
                  console.log('🚀 Creating Sarah Johnson chat interface...');
                  
                  // Remove existing chat if present
                  const existingChat = document.getElementById('sarah-chat-widget');
                  if (existingChat) {
                    existingChat.remove();
                  }
                  
                  // Create chat widget immediately
                  const chatWidget = document.createElement('div');
                  chatWidget.id = 'sarah-chat-widget';
                  chatWidget.innerHTML = `
                    <div style="
                      position: fixed;
                      bottom: 20px;
                      right: 20px;
                      width: 350px;
                      height: 500px;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      border-radius: 15px;
                      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                      z-index: 10000;
                      display: flex;
                      flex-direction: column;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    ">
                      <!-- Header -->
                      <div style="
                        background: rgba(255,255,255,0.1);
                        padding: 15px;
                        border-radius: 15px 15px 0 0;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        backdrop-filter: blur(10px);
                      ">
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <div style="
                            width: 40px;
                            height: 40px;
                            background: white;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 20px;
                          ">👩‍💼</div>
                          <div>
                            <div style="color: white; font-weight: 600; font-size: 16px;">Sarah Johnson</div>
                            <div style="color: rgba(255,255,255,0.8); font-size: 12px;">CEO • Cybersecurity Expert</div>
                          </div>
                        </div>
                        <button onclick="document.getElementById('sarah-chat-widget').remove()" style="
                          background: none;
                          border: none;
                          color: white;
                          font-size: 20px;
                          cursor: pointer;
                          padding: 5px;
                          border-radius: 5px;
                          opacity: 0.7;
                        " onmouseover="this.style.opacity='1'; this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.opacity='0.7'; this.style.background='none'">×</button>
                      </div>
                      
                      <!-- Chat Messages -->
                      <div style="
                        flex: 1;
                        padding: 20px;
                        overflow-y: auto;
                        background: rgba(255,255,255,0.05);
                      ">
                        <div style="
                          background: rgba(255,255,255,0.9);
                          padding: 12px 16px;
                          border-radius: 15px 15px 15px 5px;
                          margin-bottom: 15px;
                          color: #333;
                          font-size: 14px;
                          line-height: 1.4;
                        ">
                          <div style="font-weight: 600; color: #667eea; margin-bottom: 5px;">Sarah Johnson</div>
                          👋 Hello! I'm Sarah Johnson, CEO of ComplianceNavigator. I'm here to help you with cybersecurity compliance, risk assessments, and NCA ECC implementation. What can I help you with today?
                        </div>
                      </div>
                      
                      <!-- Input -->
                      <div style="
                        padding: 15px;
                        background: rgba(255,255,255,0.1);
                        border-radius: 0 0 15px 15px;
                      ">
                        <input type="text" placeholder="Ask Sarah about cybersecurity..." style="
                          width: 100%;
                          padding: 12px;
                          border: none;
                          border-radius: 20px;
                          font-size: 14px;
                          outline: none;
                        " onkeypress="if(event.key==='Enter') { 
                          const msg = this.value.trim();
                          if(msg) {
                            const responses = [
                              'That\\'s a great question about cybersecurity compliance. Based on the NCA ECC framework, I recommend starting with a comprehensive risk assessment.',
                              'For NCA ECC implementation, focus on the five core domains: Governance, Cybersecurity Defence, Cybersecurity Resilience, Third Party Cloud Computing, and Industrial Control Systems.',
                              'Risk management is crucial for compliance. I suggest using our NFRM Risk Management tool to conduct thorough assessments.',
                              'Security policies should align with your organizational structure. Our AI-powered policy generator can help you create customized policies based on NCA ECC requirements.',
                              'Gap assessments are essential for identifying compliance gaps. Use our ECC Implementation Dashboard to track your progress across all 114 essential controls.'
                            ];
                            const response = responses[Math.floor(Math.random() * responses.length)];
                            
                            const messagesDiv = document.querySelector('#sarah-chat-widget [style*=\"overflow-y: auto\"]');
                            messagesDiv.innerHTML += \`
                              <div style=\"background: linear-gradient(45deg, #667eea, #764ba2); padding: 12px 16px; border-radius: 15px 15px 5px 15px; margin: 15px 0; margin-left: 50px; color: white; font-size: 14px;\">
                                <div style=\"font-weight: 600; margin-bottom: 5px; opacity: 0.8;\">You</div>\${msg}
                              </div>
                              <div style=\"background: rgba(255,255,255,0.9); padding: 12px 16px; border-radius: 15px 15px 15px 5px; margin: 15px 0; color: #333; font-size: 14px;\">
                                <div style=\"font-weight: 600; color: #667eea; margin-bottom: 5px;\">Sarah Johnson</div>\${response}
                              </div>
                            \`;
                            messagesDiv.scrollTop = messagesDiv.scrollHeight;
                            this.value = '';
                          }
                        }">
                      </div>
                    </div>
                  `;
                  
                  document.body.appendChild(chatWidget);
                  console.log('✅ Sarah Johnson chat created successfully!');
                  
                  // Also try D-ID if available
                  if ((window as any).openDIDAgent) {
                    console.log('📞 Also trying D-ID agent...');
                    try {
                      (window as any).openDIDAgent();
                    } catch (error) {
                      console.warn('D-ID agent failed:', error);
                    }
                  }
                  
                } catch (error) {
                  console.error('❌ Error creating chat:', error);
                  alert('Sarah Johnson chat system error: ' + error.message);
                }
              }}
              data-testid="ceo-picture"
            >
              <img 
                src={ceoImage} 
                alt="CEO" 
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
            <div className="mt-2 text-center">
              <h2 className="text-sm font-semibold text-foreground">SARAH JOHNSON</h2>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Main Navigation
            </h3>
            <ul className="space-y-1">
              {mainLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Assessment & Risk Management */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Assessment & Risk
            </h3>
            <ul className="space-y-1">
              {assessmentLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      data-testid={link.testId || ''}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* User Awareness & Training */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              User Awareness & Training
            </h3>
            <ul className="space-y-1">
              {trainingLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      data-testid={link.testId || ''}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Role-Based Portals */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Role-Based Portals
            </h3>
            <ul className="space-y-1">
              {roleLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      data-testid={link.testId || ''}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Management */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Management
            </h3>
            <ul className="space-y-1">
              {managementLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;

                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      data-testid={link.testId || ''}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t space-y-3">
          {/* Theme and Language Controls */}
          <div className="flex items-center justify-center gap-2" data-testid="theme-toggle">
            <ThemeToggle />
            <LanguageToggle />
          </div>
          
        </div>
      </div>
    </aside>
  );
}