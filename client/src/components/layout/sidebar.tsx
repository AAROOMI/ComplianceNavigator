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
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🔥 SARAH JOHNSON clicked - opening D-ID agent');
                
                // Give D-ID agent time to fully initialize
                setTimeout(() => {
                  try {
                    // Method 1: Try to find and activate the D-ID agent widget/button
                    const didWidget = document.querySelector('iframe[src*="d-id.com"]') ||
                                     document.querySelector('[data-testid="did-widget"]') ||
                                     document.querySelector('.did-widget') ||
                                     document.querySelector('#did-widget');
                    
                    if (didWidget) {
                      // Try to click the widget or send it a message
                      if ((didWidget as HTMLElement).click) {
                        (didWidget as HTMLElement).click();
                        console.log('✓ D-ID Widget clicked');
                      }
                      return;
                    }
                    
                    // Method 2: Try window-based D-ID agent methods
                    const windowDidMethods = [
                      'DIDAgent', 'didAgent', 'DID_AGENT', 'DIdAgent', 
                      'did', 'DID', 'DiDAgent', 'dIdAgent'
                    ];
                    
                    for (const method of windowDidMethods) {
                      if ((window as any)[method]) {
                        const agent = (window as any)[method];
                        if (typeof agent.show === 'function') {
                          agent.show();
                          console.log(`✓ D-ID Agent opened via window.${method}.show()`);
                          return;
                        }
                        if (typeof agent.open === 'function') {
                          agent.open();
                          console.log(`✓ D-ID Agent opened via window.${method}.open()`);
                          return;
                        }
                        if (typeof agent.start === 'function') {
                          agent.start();
                          console.log(`✓ D-ID Agent opened via window.${method}.start()`);
                          return;
                        }
                      }
                    }
                    
                    // Method 3: Create and dispatch multiple D-ID events
                    const events = [
                      'DIDAgent:show', 'DIDAgent:open', 'DIDAgent:start',
                      'did-agent-show', 'did-agent-open', 'did-agent-start',
                      'didagent:show', 'didagent:open', 'didagent:start'
                    ];
                    
                    events.forEach(eventName => {
                      window.dispatchEvent(new CustomEvent(eventName, { 
                        detail: { agentId: 'agt_56bnv71C', mode: 'fabio' } 
                      }));
                      document.dispatchEvent(new CustomEvent(eventName, { 
                        detail: { agentId: 'agt_56bnv71C', mode: 'fabio' } 
                      }));
                    });
                    
                    console.log('✅ D-ID Agent events dispatched - should open soon');
                    
                  } catch (error) {
                    console.error('❌ Error opening D-ID agent:', error);
                  }
                }, 300);
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