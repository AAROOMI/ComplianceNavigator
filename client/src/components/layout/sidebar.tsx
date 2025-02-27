
import React from 'react';
import { useLocation } from 'wouter';
import { 
  Sidebar as UISidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar-context';
import { ShieldCheck, FileText, ClipboardCheck, Bot, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/assessment", label: "Assessment", icon: ClipboardCheck },
    { href: "/policies", label: "Policies", icon: FileText },
    { href: "/nca-ecc", label: "NCA ECC", icon: ShieldCheck },
    { href: "/assistant", label: "Assistant", icon: Bot },
  ];

  return (
    <UISidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">MetaWorks</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <SidebarMenuItem key={link.href}>
                    <a href={link.href}>
                      <SidebarMenuButton active={location === link.href}>
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </SidebarMenuButton>
                    </a>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="text-xs text-muted-foreground">
          Compliance Hub v1.0
        </div>
      </SidebarFooter>
    </UISidebar>
  );
}
