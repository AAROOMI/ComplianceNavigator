import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileText, ClipboardCheck } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: ShieldCheck },
    { href: "/assessment", label: "Assessment", icon: ClipboardCheck },
    { href: "/policies", label: "Policies", icon: FileText },
  ];

  return (
    <div className="w-64 bg-sidebar p-4 border-r border-border">
      <div className="flex items-center gap-2 mb-8">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold">MetaWorks</h1>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={location === link.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  location === link.href && "bg-secondary/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileCheck,
  FileText,
  Shield,
  Bot,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      label: "Dashboard",
    },
    {
      href: "/assessment",
      icon: <FileCheck className="mr-2 h-4 w-4" />,
      label: "Assessment",
    },
    {
      href: "/policies",
      icon: <FileText className="mr-2 h-4 w-4" />,
      label: "Policies",
    },
    {
      href: "/nca-ecc",
      icon: <Shield className="mr-2 h-4 w-4" />,
      label: "NCA ECC",
    },
    {
      href: "/assistant",
      icon: <Bot className="mr-2 h-4 w-4" />,
      label: "Assistant",
    },
  ];

  return (
    <>
      <div className="md:hidden p-4 absolute top-0 left-0 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={toggleSidebar}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:relative md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b">
          <h2 className="text-xl font-bold">Compliance Hub</h2>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              <a
                className={cn(
                  "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                  location === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {item.icon}
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
