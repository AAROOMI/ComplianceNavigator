import React from 'react';
import { useLocation } from 'wouter';
import { useSidebar } from '@/components/ui/sidebar-context';
import { ShieldCheck, FileText, ClipboardCheck, Bot, LayoutDashboard, AlertTriangle } from 'lucide-react';

export default function Sidebar() {
  const [location] = useLocation();
  const { isOpen } = useSidebar();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/assessment", label: "Assessment", icon: ClipboardCheck },
    { href: "/policies", label: "Policies", icon: FileText },
    { href: "/nca-ecc", label: "NCA ECC", icon: ShieldCheck },
    { href: "/metaworks", label: "Metaworks V1&V2", icon: ShieldCheck },
    { href: "/nfrm", label: "NFRM Risk Management", icon: AlertTriangle },
    { href: "/assistant", label: "Assistant", icon: Bot },
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
          <ul className="space-y-2">
            {links.map((link) => {
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