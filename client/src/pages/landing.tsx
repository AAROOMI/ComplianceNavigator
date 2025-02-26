import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShieldCheck } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-cover bg-center relative">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/metaworks-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="relative z-10 h-screen flex flex-col items-center justify-center bg-black/50 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="flex items-center justify-center gap-4 mb-8">
            <ShieldCheck className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold">MetaWorks</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">One-Click Cybersecurity Compliance Solution</h2>
          <p className="text-xl mb-8">
            Innovative Cybersecurity Solutions for Comprehensive Compliance and Protection.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}