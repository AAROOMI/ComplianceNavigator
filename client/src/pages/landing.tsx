import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url("/metawork-bg.png")' }}>
      <div className="h-screen flex flex-col items-center justify-center bg-black/50 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">One-Click Cybersecurity Compliance Solution</h1>
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
