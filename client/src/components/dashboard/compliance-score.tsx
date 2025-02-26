import { Progress } from "@/components/ui/progress";

export default function ComplianceScore() {
  const score = 75; // Mock score

  return (
    <div className="space-y-4">
      <div className="text-5xl font-bold text-primary">{score}%</div>
      <Progress value={score} className="h-2" />
      <p className="text-sm text-muted-foreground">
        Your organization is {score}% compliant with the NCA ECC framework.
      </p>
    </div>
  );
}
