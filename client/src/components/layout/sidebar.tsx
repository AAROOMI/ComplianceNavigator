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
