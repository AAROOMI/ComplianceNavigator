import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Building,
  UserCheck,
  Briefcase,
  Award,
  Target,
  Eye,
  Download
} from "lucide-react";

interface AuthorizingOfficial {
  name: string;
  title: string;
  email: string;
  phone: string;
  buyInStatus: 'pending' | 'partial' | 'complete';
  approvalDate?: string;
  commitment: string[];
}

interface CybersecurityFunction {
  cisoName: string;
  cisoTitle: string;
  cisoEmail: string;
  reportingStructure: 'ceo' | 'cto' | 'coo' | 'board';
  independentFromIT: boolean;
  teamSize: number;
  budget: string;
  responsibilities: string[];
}

interface SteeringCommittee {
  chairperson: string;
  members: {
    name: string;
    department: string;
    role: string;
    commitment: string;
  }[];
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  charter: string;
}

interface GovernanceSetupProps {
  projectId: number;
  onComplete: (data: any) => void;
}

export function GovernanceSetup({ projectId, onComplete }: GovernanceSetupProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [authorizingOfficial, setAuthorizingOfficial] = useState<AuthorizingOfficial>({
    name: "",
    title: "",
    email: "",
    phone: "",
    buyInStatus: "pending",
    commitment: []
  });
  
  const [cybersecurityFunction, setCybersecurityFunction] = useState<CybersecurityFunction>({
    cisoName: "",
    cisoTitle: "Chief Information Security Officer",
    cisoEmail: "",
    reportingStructure: "ceo",
    independentFromIT: false,
    teamSize: 1,
    budget: "",
    responsibilities: []
  });

  const [steeringCommittee, setSteeringCommittee] = useState<SteeringCommittee>({
    chairperson: "",
    members: [],
    meetingFrequency: "monthly",
    charter: ""
  });

  const { toast } = useToast();

  const commitmentOptions = [
    "Formal approval of ECC implementation project",
    "Assignment of dedicated cybersecurity resources",
    "Budget allocation for security controls",
    "Regular review and oversight commitment",
    "Support for security awareness training",
    "Endorsement of cybersecurity policies"
  ];

  const responsibilityOptions = [
    "Develop and maintain cybersecurity strategy",
    "Oversee implementation of ECC controls",
    "Manage security incident response",
    "Conduct risk assessments and management",
    "Coordinate security awareness training",
    "Liaise with external auditors and regulators",
    "Monitor and report on security posture",
    "Review and approve security policies"
  ];

  const handleAOCommitmentChange = (commitment: string, checked: boolean) => {
    const updated = checked 
      ? [...authorizingOfficial.commitment, commitment]
      : authorizingOfficial.commitment.filter(c => c !== commitment);
    
    setAuthorizingOfficial({
      ...authorizingOfficial,
      commitment: updated,
      buyInStatus: updated.length >= 4 ? 'complete' : updated.length >= 2 ? 'partial' : 'pending'
    });
  };

  const handleResponsibilityChange = (responsibility: string, checked: boolean) => {
    const updated = checked 
      ? [...cybersecurityFunction.responsibilities, responsibility]
      : cybersecurityFunction.responsibilities.filter(r => r !== responsibility);
    
    setCybersecurityFunction({
      ...cybersecurityFunction,
      responsibilities: updated
    });
  };

  const addCommitteeMember = () => {
    setSteeringCommittee({
      ...steeringCommittee,
      members: [...steeringCommittee.members, {
        name: "",
        department: "",
        role: "",
        commitment: ""
      }]
    });
  };

  const updateCommitteeMember = (index: number, field: string, value: string) => {
    const updated = steeringCommittee.members.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    setSteeringCommittee({
      ...steeringCommittee,
      members: updated
    });
  };

  const removeCommitteeMember = (index: number) => {
    const updated = steeringCommittee.members.filter((_, i) => i !== index);
    setSteeringCommittee({
      ...steeringCommittee,
      members: updated
    });
  };

  const getStepProgress = () => {
    switch (activeStep) {
      case 1: return authorizingOfficial.name && authorizingOfficial.commitment.length >= 2 ? 100 : 50;
      case 2: return cybersecurityFunction.cisoName && cybersecurityFunction.responsibilities.length >= 3 ? 100 : 50;
      case 3: return steeringCommittee.chairperson && steeringCommittee.members.length >= 3 ? 100 : 50;
      default: return 0;
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 1: return authorizingOfficial.name && authorizingOfficial.commitment.length >= 2;
      case 2: return cybersecurityFunction.cisoName && cybersecurityFunction.responsibilities.length >= 3;
      case 3: return steeringCommittee.chairperson && steeringCommittee.members.length >= 3;
      default: return false;
    }
  };

  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    } else {
      // Complete governance setup
      const governanceData = {
        authorizingOfficial,
        cybersecurityFunction,
        steeringCommittee,
        completedAt: new Date().toISOString()
      };
      onComplete(governanceData);
      toast({
        title: "Governance Foundation Complete!",
        description: "Foundation established. Ready to proceed with gap assessment.",
      });
    }
  };

  const getBuyInStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return "bg-green-100 text-green-800";
      case 'partial': return "bg-yellow-100 text-yellow-800";
      case 'pending': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Foundation & Governance Setup</h2>
          <p className="text-muted-foreground">Establish the organizational foundation for ECC implementation</p>
        </div>
        <Badge className="text-sm">
          Step {activeStep} of 3
        </Badge>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Setup Progress</span>
          <span>{Math.round(getStepProgress())}%</span>
        </div>
        <Progress value={getStepProgress()} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { id: 1, title: "Authorizing Official", icon: UserCheck },
          { id: 2, title: "Cybersecurity Function", icon: Shield },
          { id: 3, title: "Steering Committee", icon: Users }
        ].map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                step.id === activeStep 
                  ? "border-primary bg-primary/5" 
                  : step.id < activeStep 
                  ? "border-green-200 bg-green-50" 
                  : "border-gray-200"
              }`}
              onClick={() => setActiveStep(step.id)}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${
                step.id === activeStep ? "text-primary" : step.id < activeStep ? "text-green-600" : "text-gray-400"
              }`} />
              <p className="text-sm font-medium">{step.title}</p>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {activeStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Authorizing Official (AO) Engagement</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Secure formal commitment from your organization's senior leadership (CEO, President, or equivalent) 
                  for the ECC implementation project as required by Royal Decree 57231.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="aoName">Name</Label>
                  <Input
                    id="aoName"
                    value={authorizingOfficial.name}
                    onChange={(e) => setAuthorizingOfficial({...authorizingOfficial, name: e.target.value})}
                    placeholder="e.g., Ahmed Al-Rashid"
                    data-testid="input-ao-name"
                  />
                </div>
                <div>
                  <Label htmlFor="aoTitle">Title</Label>
                  <Input
                    id="aoTitle"
                    value={authorizingOfficial.title}
                    onChange={(e) => setAuthorizingOfficial({...authorizingOfficial, title: e.target.value})}
                    placeholder="e.g., Chief Executive Officer"
                    data-testid="input-ao-title"
                  />
                </div>
                <div>
                  <Label htmlFor="aoEmail">Email</Label>
                  <Input
                    id="aoEmail"
                    type="email"
                    value={authorizingOfficial.email}
                    onChange={(e) => setAuthorizingOfficial({...authorizingOfficial, email: e.target.value})}
                    placeholder="ahmed@organization.com"
                    data-testid="input-ao-email"
                  />
                </div>
                <div>
                  <Label htmlFor="aoPhone">Phone</Label>
                  <Input
                    id="aoPhone"
                    value={authorizingOfficial.phone}
                    onChange={(e) => setAuthorizingOfficial({...authorizingOfficial, phone: e.target.value})}
                    placeholder="+966 XX XXX XXXX"
                    data-testid="input-ao-phone"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Formal Commitments Required</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the commitments secured from the Authorizing Official:
                </p>
                <div className="space-y-3">
                  {commitmentOptions.map((commitment) => (
                    <div key={commitment} className="flex items-start space-x-3">
                      <Checkbox
                        id={commitment}
                        checked={authorizingOfficial.commitment.includes(commitment)}
                        onCheckedChange={(checked) => handleAOCommitmentChange(commitment, checked as boolean)}
                        data-testid={`checkbox-commitment-${commitment.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label htmlFor={commitment} className="text-sm leading-relaxed">
                        {commitment}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  authorizingOfficial.buyInStatus === 'complete' ? 'bg-green-500' :
                  authorizingOfficial.buyInStatus === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  Buy-in Status: <Badge className={getBuyInStatusColor(authorizingOfficial.buyInStatus)}>
                    {authorizingOfficial.buyInStatus}
                  </Badge>
                </span>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Cybersecurity Function Establishment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Establish a dedicated cybersecurity function as mandated by Control 1-2-1. 
                  This function must be independent from the IT department to ensure proper oversight.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cisoName">CISO Name</Label>
                  <Input
                    id="cisoName"
                    value={cybersecurityFunction.cisoName}
                    onChange={(e) => setCybersecurityFunction({...cybersecurityFunction, cisoName: e.target.value})}
                    placeholder="e.g., Sarah Al-Mahmoud"
                    data-testid="input-ciso-name"
                  />
                </div>
                <div>
                  <Label htmlFor="cisoTitle">Title</Label>
                  <Input
                    id="cisoTitle"
                    value={cybersecurityFunction.cisoTitle}
                    onChange={(e) => setCybersecurityFunction({...cybersecurityFunction, cisoTitle: e.target.value})}
                    data-testid="input-ciso-title"
                  />
                </div>
                <div>
                  <Label htmlFor="cisoEmail">Email</Label>
                  <Input
                    id="cisoEmail"
                    type="email"
                    value={cybersecurityFunction.cisoEmail}
                    onChange={(e) => setCybersecurityFunction({...cybersecurityFunction, cisoEmail: e.target.value})}
                    placeholder="ciso@organization.com"
                    data-testid="input-ciso-email"
                  />
                </div>
                <div>
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={cybersecurityFunction.teamSize}
                    onChange={(e) => setCybersecurityFunction({...cybersecurityFunction, teamSize: parseInt(e.target.value) || 1})}
                    min="1"
                    data-testid="input-team-size"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="independentFromIT"
                  checked={cybersecurityFunction.independentFromIT}
                  onCheckedChange={(checked) => setCybersecurityFunction({...cybersecurityFunction, independentFromIT: checked as boolean})}
                  data-testid="checkbox-independent-from-it"
                />
                <label htmlFor="independentFromIT" className="text-sm font-medium">
                  Cybersecurity function is independent from IT department ✓
                </label>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Key Responsibilities</Label>
                <div className="space-y-3">
                  {responsibilityOptions.map((responsibility) => (
                    <div key={responsibility} className="flex items-start space-x-3">
                      <Checkbox
                        id={responsibility}
                        checked={cybersecurityFunction.responsibilities.includes(responsibility)}
                        onCheckedChange={(checked) => handleResponsibilityChange(responsibility, checked as boolean)}
                        data-testid={`checkbox-responsibility-${responsibility.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <label htmlFor={responsibility} className="text-sm leading-relaxed">
                        {responsibility}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Cybersecurity Steering Committee</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Form a steering committee as per Control 1-2-3 with senior leaders from key departments 
                  to provide oversight and support for the cybersecurity program.
                </p>
              </div>

              <div>
                <Label htmlFor="chairperson">Committee Chairperson</Label>
                <Input
                  id="chairperson"
                  value={steeringCommittee.chairperson}
                  onChange={(e) => setSteeringCommittee({...steeringCommittee, chairperson: e.target.value})}
                  placeholder="e.g., Chief Technology Officer"
                  data-testid="input-chairperson"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-medium">Committee Members</Label>
                  <Button size="sm" onClick={addCommitteeMember}>
                    <Users className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>

                <div className="space-y-4">
                  {steeringCommittee.members.map((member, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Member Name"
                          value={member.name}
                          onChange={(e) => updateCommitteeMember(index, 'name', e.target.value)}
                          data-testid={`input-member-name-${index}`}
                        />
                        <Input
                          placeholder="Department"
                          value={member.department}
                          onChange={(e) => updateCommitteeMember(index, 'department', e.target.value)}
                          data-testid={`input-member-department-${index}`}
                        />
                        <Input
                          placeholder="Role/Title"
                          value={member.role}
                          onChange={(e) => updateCommitteeMember(index, 'role', e.target.value)}
                          data-testid={`input-member-role-${index}`}
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Time Commitment"
                            value={member.commitment}
                            onChange={(e) => updateCommitteeMember(index, 'commitment', e.target.value)}
                            data-testid={`input-member-commitment-${index}`}
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeCommitteeMember(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {steeringCommittee.members.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No committee members added yet. Add at least 3 members to proceed.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="charter">Committee Charter</Label>
                <Textarea
                  id="charter"
                  value={steeringCommittee.charter}
                  onChange={(e) => setSteeringCommittee({...steeringCommittee, charter: e.target.value})}
                  placeholder="Define the committee's purpose, authority, and meeting guidelines..."
                  rows={4}
                  data-testid="textarea-charter"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
          disabled={activeStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          data-testid="button-next-step"
        >
          {activeStep === 3 ? "Complete Foundation" : "Next Step"}
        </Button>
      </div>
    </div>
  );
}