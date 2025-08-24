import React from 'react';
import { useLocation } from 'wouter';
import { useSidebar } from '@/components/ui/sidebar-context';
import { ShieldCheck, FileText, ClipboardCheck, Bot, LayoutDashboard, AlertTriangle, Shield, Database, Settings, Rocket, Monitor, Users, GraduationCap, Book, Award, Brain } from 'lucide-react';

export default function Sidebar() {
  const [location] = useLocation();
  const { isOpen } = useSidebar();

  const mainLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/policies", label: "Policies", icon: FileText },
    { href: "/nca-ecc", label: "NCA ECC", icon: ShieldCheck },
    { href: "/metaworks", label: "Metaworks V1&V2", icon: ShieldCheck },
    { href: "/nfrm", label: "NFRM Risk Management", icon: AlertTriangle },
    { href: "/ciso-policies", label: "CISO Policies", icon: Shield },
    { href: "/assistant", label: "Assistant", icon: Bot },
  ];

  const assessmentLinks = [
    { href: "/assessment", label: "Assessment Questionnaire", icon: ClipboardCheck },
    { href: "/risk-register", label: "Risk Register", icon: Database },
    { href: "/risk-assessment", label: "Interactive Risk Assessment", icon: AlertTriangle },
  ];

  const trainingLinks = [
    { href: "/user-awareness", label: "User Awareness", icon: GraduationCap },
    { href: "/training-materials", label: "Training Materials", icon: Book },
    { href: "/competency-badges", label: "Competency & Badges", icon: Award },
    { href: "/security-quizzes", label: "Security Quizzes", icon: Brain },
  ];

  const roleLinks = [
    { href: "/it-manager", label: "IT Manager Portal", icon: Settings },
    { href: "/cto-dashboard", label: "CTO Dashboard", icon: Rocket },
    { href: "/sysadmin-tools", label: "System Admin Tools", icon: Monitor },
  ];

  const managementLinks = [
    { href: "/user-management", label: "User Management", icon: Users },
  ];

  return (
    <aside
      className={`h-screen w-64 bg-background border-r transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">MetaWorks</h1>
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

        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            Compliance Hub v1.0
          </div>
        </div>
      </div>
    </aside>
  );
}