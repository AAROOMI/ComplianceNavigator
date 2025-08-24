import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ncaEccDomains, ncaEccStructure } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ChevronLeft, ChevronRight, Shield, CheckCircle } from "lucide-react";

// Comprehensive 100 risk assessment questions based on NCA ECC domains and risk register
const questions = [
  // Governance Domain (20 questions)
  {
    id: "g1",
    domain: "Governance",
    text: "Do you have a documented cybersecurity strategy aligned with business objectives?",
    weight: 3,
    impact: "High",
    controls: ["Strategic planning framework", "Board oversight", "Policy documentation"],
  },
  {
    id: "g2",
    domain: "Governance",
    text: "Is there a formal risk assessment methodology in place?",
    weight: 3,
    impact: "High",
    controls: ["Risk assessment framework", "Regular evaluations", "Risk register maintenance"],
  },
  {
    id: "g3",
    domain: "Governance",
    text: "Are cybersecurity roles and responsibilities clearly defined?",
    weight: 2,
    impact: "Medium",
    controls: ["RACI matrix", "Job descriptions", "Accountability frameworks"],
  },
  {
    id: "g4",
    domain: "Governance",
    text: "Is there executive leadership support for cybersecurity initiatives?",
    weight: 3,
    impact: "High",
    controls: ["Executive sponsorship", "Budget allocation", "Strategic initiatives"],
  },
  {
    id: "g5",
    domain: "Governance",
    text: "Are cybersecurity policies regularly reviewed and updated?",
    weight: 2,
    impact: "Medium",
    controls: ["Policy review schedule", "Version control", "Approval workflows"],
  },
  {
    id: "g6",
    domain: "Governance",
    text: "Is there a cybersecurity awareness program for all employees?",
    weight: 2,
    impact: "Medium",
    controls: ["Training programs", "Awareness campaigns", "Phishing simulations"],
  },
  {
    id: "g7",
    domain: "Governance",
    text: "Are cybersecurity metrics and KPIs regularly measured and reported?",
    weight: 2,
    impact: "Medium",
    controls: ["Metrics dashboard", "Regular reporting", "Performance monitoring"],
  },
  {
    id: "g8",
    domain: "Governance",
    text: "Is there a formal incident management framework?",
    weight: 3,
    impact: "High",
    controls: ["Incident response plan", "Escalation procedures", "Communication protocols"],
  },
  {
    id: "g9",
    domain: "Governance",
    text: "Are third-party vendor cybersecurity requirements documented?",
    weight: 2,
    impact: "Medium",
    controls: ["Vendor assessments", "Contract requirements", "Due diligence"],
  },
  {
    id: "g10",
    domain: "Governance",
    text: "Is there a business continuity plan that includes cybersecurity considerations?",
    weight: 3,
    impact: "High",
    controls: ["BCP framework", "Recovery procedures", "Continuity testing"],
  },
  {
    id: "g11",
    domain: "Governance",
    text: "Are cybersecurity compliance requirements regularly assessed?",
    weight: 2,
    impact: "Medium",
    controls: ["Compliance monitoring", "Gap analysis", "Regulatory updates"],
  },
  {
    id: "g12",
    domain: "Governance",
    text: "Is there a formal change management process for security changes?",
    weight: 2,
    impact: "Medium",
    controls: ["Change control board", "Impact assessment", "Approval workflows"],
  },
  {
    id: "g13",
    domain: "Governance",
    text: "Are cybersecurity budget and resources adequately allocated?",
    weight: 2,
    impact: "Medium",
    controls: ["Budget planning", "Resource allocation", "Cost-benefit analysis"],
  },
  {
    id: "g14",
    domain: "Governance",
    text: "Is there a cybersecurity committee or governance body?",
    weight: 2,
    impact: "Medium",
    controls: ["Governance committee", "Regular meetings", "Decision authority"],
  },
  {
    id: "g15",
    domain: "Governance",
    text: "Are cybersecurity risks integrated into enterprise risk management?",
    weight: 3,
    impact: "High",
    controls: ["ERM integration", "Risk appetite", "Risk tolerance"],
  },
  {
    id: "g16",
    domain: "Governance",
    text: "Is there a formal security architecture framework?",
    weight: 2,
    impact: "Medium",
    controls: ["Architecture standards", "Security patterns", "Design principles"],
  },
  {
    id: "g17",
    domain: "Governance",
    text: "Are cybersecurity performance reviews conducted for staff?",
    weight: 1,
    impact: "Low",
    controls: ["Performance metrics", "Individual goals", "Career development"],
  },
  {
    id: "g18",
    domain: "Governance",
    text: "Is there a formal cybersecurity communication strategy?",
    weight: 1,
    impact: "Low",
    controls: ["Communication plan", "Stakeholder engagement", "Awareness materials"],
  },
  {
    id: "g19",
    domain: "Governance",
    text: "Are cybersecurity investments prioritized based on risk?",
    weight: 2,
    impact: "Medium",
    controls: ["Risk-based prioritization", "Investment criteria", "ROI analysis"],
  },
  {
    id: "g20",
    domain: "Governance",
    text: "Is there continuous monitoring of cybersecurity governance effectiveness?",
    weight: 2,
    impact: "Medium",
    controls: ["Governance metrics", "Maturity assessments", "Improvement plans"],
  },

  // Cybersecurity Defence Domain (20 questions)
  {
    id: "cd1",
    domain: "Cybersecurity Defence",
    text: "Is multi-factor authentication implemented for privileged accounts?",
    weight: 3,
    impact: "High",
    controls: ["MFA systems", "Token management", "Biometric authentication"],
  },
  {
    id: "cd2",
    domain: "Cybersecurity Defence",
    text: "Are encryption standards defined and implemented?",
    weight: 3,
    impact: "High",
    controls: ["Encryption protocols", "Key management", "Data protection"],
  },
  {
    id: "cd3",
    domain: "Cybersecurity Defence",
    text: "Is there network segmentation to protect critical assets?",
    weight: 3,
    impact: "High",
    controls: ["Network zones", "Firewall rules", "Access controls"],
  },
  {
    id: "cd4",
    domain: "Cybersecurity Defence",
    text: "Are all systems regularly patched and updated?",
    weight: 3,
    impact: "High",
    controls: ["Patch management", "Vulnerability scanning", "Update schedules"],
  },
  {
    id: "cd5",
    domain: "Cybersecurity Defence",
    text: "Is endpoint detection and response (EDR) implemented?",
    weight: 2,
    impact: "Medium",
    controls: ["EDR solutions", "Threat hunting", "Behavioral analysis"],
  },
  {
    id: "cd6",
    domain: "Cybersecurity Defence",
    text: "Are anti-malware solutions deployed across all endpoints?",
    weight: 2,
    impact: "Medium",
    controls: ["Antivirus software", "Real-time scanning", "Signature updates"],
  },
  {
    id: "cd7",
    domain: "Cybersecurity Defence",
    text: "Is there email security filtering to prevent phishing attacks?",
    weight: 2,
    impact: "Medium",
    controls: ["Email gateways", "Spam filters", "Link protection"],
  },
  {
    id: "cd8",
    domain: "Cybersecurity Defence",
    text: "Are web application firewalls (WAF) implemented?",
    weight: 2,
    impact: "Medium",
    controls: ["WAF deployment", "Rule configuration", "Traffic monitoring"],
  },
  {
    id: "cd9",
    domain: "Cybersecurity Defence",
    text: "Is there intrusion detection/prevention system (IDS/IPS) monitoring?",
    weight: 2,
    impact: "Medium",
    controls: ["IDS/IPS deployment", "Alert management", "Signature updates"],
  },
  {
    id: "cd10",
    domain: "Cybersecurity Defence",
    text: "Are secure configuration baselines established for all systems?",
    weight: 2,
    impact: "Medium",
    controls: ["Configuration standards", "Hardening guides", "Compliance checking"],
  },
  {
    id: "cd11",
    domain: "Cybersecurity Defence",
    text: "Is privileged access management (PAM) implemented?",
    weight: 3,
    impact: "High",
    controls: ["PAM solutions", "Session recording", "Just-in-time access"],
  },
  {
    id: "cd12",
    domain: "Cybersecurity Defence",
    text: "Are data loss prevention (DLP) controls in place?",
    weight: 2,
    impact: "Medium",
    controls: ["DLP solutions", "Content inspection", "Policy enforcement"],
  },
  {
    id: "cd13",
    domain: "Cybersecurity Defence",
    text: "Is there secure remote access for employees?",
    weight: 2,
    impact: "Medium",
    controls: ["VPN solutions", "Zero trust architecture", "Remote access policies"],
  },
  {
    id: "cd14",
    domain: "Cybersecurity Defence",
    text: "Are mobile device management (MDM) controls implemented?",
    weight: 2,
    impact: "Medium",
    controls: ["MDM solutions", "Device policies", "App management"],
  },
  {
    id: "cd15",
    domain: "Cybersecurity Defence",
    text: "Is there application security testing for custom applications?",
    weight: 2,
    impact: "Medium",
    controls: ["SAST/DAST tools", "Code reviews", "Security testing"],
  },
  {
    id: "cd16",
    domain: "Cybersecurity Defence",
    text: "Are identity and access management (IAM) controls enforced?",
    weight: 3,
    impact: "High",
    controls: ["IAM systems", "Role-based access", "Access reviews"],
  },
  {
    id: "cd17",
    domain: "Cybersecurity Defence",
    text: "Is there network traffic monitoring and analysis?",
    weight: 2,
    impact: "Medium",
    controls: ["Network monitoring tools", "Traffic analysis", "Anomaly detection"],
  },
  {
    id: "cd18",
    domain: "Cybersecurity Defence",
    text: "Are security information and event management (SIEM) tools deployed?",
    weight: 2,
    impact: "Medium",
    controls: ["SIEM platforms", "Log correlation", "Security analytics"],
  },
  {
    id: "cd19",
    domain: "Cybersecurity Defence",
    text: "Is there vulnerability management program in place?",
    weight: 3,
    impact: "High",
    controls: ["Vulnerability scanners", "Risk assessment", "Remediation tracking"],
  },
  {
    id: "cd20",
    domain: "Cybersecurity Defence",
    text: "Are security controls regularly tested and validated?",
    weight: 2,
    impact: "Medium",
    controls: ["Penetration testing", "Red team exercises", "Control validation"],
  },

  // Cybersecurity Resilience Domain (20 questions)
  {
    id: "cr1",
    domain: "Cybersecurity Resilience",
    text: "Is there a tested business continuity plan?",
    weight: 3,
    impact: "High",
    controls: ["BCP documentation", "Recovery procedures", "Continuity testing"],
  },
  {
    id: "cr2",
    domain: "Cybersecurity Resilience",
    text: "Do you have an incident response plan?",
    weight: 3,
    impact: "High",
    controls: ["IR procedures", "Response team", "Communication plans"],
  },
  {
    id: "cr3",
    domain: "Cybersecurity Resilience",
    text: "Are regular data backups performed and tested?",
    weight: 3,
    impact: "High",
    controls: ["Backup systems", "Recovery testing", "Offsite storage"],
  },
  {
    id: "cr4",
    domain: "Cybersecurity Resilience",
    text: "Is there a disaster recovery plan for IT systems?",
    weight: 3,
    impact: "High",
    controls: ["DR procedures", "Recovery sites", "RTO/RPO targets"],
  },
  {
    id: "cr5",
    domain: "Cybersecurity Resilience",
    text: "Are incident response procedures regularly practiced?",
    weight: 2,
    impact: "Medium",
    controls: ["Tabletop exercises", "Simulation drills", "Response training"],
  },
  {
    id: "cr6",
    domain: "Cybersecurity Resilience",
    text: "Is there redundancy built into critical systems?",
    weight: 2,
    impact: "Medium",
    controls: ["Redundant systems", "Failover mechanisms", "Load balancing"],
  },
  {
    id: "cr7",
    domain: "Cybersecurity Resilience",
    text: "Are crisis communication procedures established?",
    weight: 2,
    impact: "Medium",
    controls: ["Communication templates", "Media relations", "Stakeholder updates"],
  },
  {
    id: "cr8",
    domain: "Cybersecurity Resilience",
    text: "Is there supply chain resilience planning?",
    weight: 2,
    impact: "Medium",
    controls: ["Vendor assessments", "Alternative suppliers", "Contingency plans"],
  },
  {
    id: "cr9",
    domain: "Cybersecurity Resilience",
    text: "Are lessons learned captured from security incidents?",
    weight: 1,
    impact: "Low",
    controls: ["Post-incident reviews", "Improvement plans", "Knowledge sharing"],
  },
  {
    id: "cr10",
    domain: "Cybersecurity Resilience",
    text: "Is there financial resilience planning for cyber incidents?",
    weight: 2,
    impact: "Medium",
    controls: ["Cyber insurance", "Financial reserves", "Cost estimation"],
  },
  {
    id: "cr11",
    domain: "Cybersecurity Resilience",
    text: "Are alternative work arrangements planned for disruptions?",
    weight: 1,
    impact: "Low",
    controls: ["Remote work capabilities", "Alternative sites", "Communication tools"],
  },
  {
    id: "cr12",
    domain: "Cybersecurity Resilience",
    text: "Is there operational resilience testing across business functions?",
    weight: 2,
    impact: "Medium",
    controls: ["Cross-functional testing", "Stress testing", "Scenario planning"],
  },
  {
    id: "cr13",
    domain: "Cybersecurity Resilience",
    text: "Are recovery time objectives (RTO) defined for critical processes?",
    weight: 2,
    impact: "Medium",
    controls: ["RTO definitions", "Performance metrics", "Monitoring systems"],
  },
  {
    id: "cr14",
    domain: "Cybersecurity Resilience",
    text: "Are recovery point objectives (RPO) established for data?",
    weight: 2,
    impact: "Medium",
    controls: ["RPO definitions", "Backup frequency", "Data synchronization"],
  },
  {
    id: "cr15",
    domain: "Cybersecurity Resilience",
    text: "Is there threat intelligence integration for proactive resilience?",
    weight: 2,
    impact: "Medium",
    controls: ["Threat feeds", "Intelligence analysis", "Proactive measures"],
  },
  {
    id: "cr16",
    domain: "Cybersecurity Resilience",
    text: "Are interdependency maps maintained for critical systems?",
    weight: 1,
    impact: "Low",
    controls: ["Dependency mapping", "Impact analysis", "System documentation"],
  },
  {
    id: "cr17",
    domain: "Cybersecurity Resilience",
    text: "Is there stakeholder coordination for incident response?",
    weight: 2,
    impact: "Medium",
    controls: ["Coordination protocols", "Contact lists", "Communication channels"],
  },
  {
    id: "cr18",
    domain: "Cybersecurity Resilience",
    text: "Are resilience metrics monitored and reported?",
    weight: 1,
    impact: "Low",
    controls: ["Resilience dashboards", "Performance indicators", "Regular reporting"],
  },
  {
    id: "cr19",
    domain: "Cybersecurity Resilience",
    text: "Is there adaptive capacity planning for emerging threats?",
    weight: 2,
    impact: "Medium",
    controls: ["Threat assessment", "Adaptive strategies", "Flexibility planning"],
  },
  {
    id: "cr20",
    domain: "Cybersecurity Resilience",
    text: "Are resilience improvements continuously implemented?",
    weight: 1,
    impact: "Low",
    controls: ["Continuous improvement", "Lessons learned", "Plan updates"],
  },

  // Third Party Cloud Computing Cybersecurity Domain (20 questions)
  {
    id: "cc1",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud service providers assessed for security compliance?",
    weight: 3,
    impact: "High",
    controls: ["Vendor assessments", "Compliance certifications", "Due diligence"],
  },
  {
    id: "cc2",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Is there a cloud security governance framework?",
    weight: 2,
    impact: "Medium",
    controls: ["Cloud policies", "Governance structure", "Oversight mechanisms"],
  },
  {
    id: "cc3",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud data classification and handling procedures defined?",
    weight: 2,
    impact: "Medium",
    controls: ["Data classification", "Handling procedures", "Access controls"],
  },
  {
    id: "cc4",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Is cloud access management properly configured?",
    weight: 3,
    impact: "High",
    controls: ["IAM configuration", "Access policies", "Permission reviews"],
  },
  {
    id: "cc5",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud security monitoring tools deployed?",
    weight: 2,
    impact: "Medium",
    controls: ["Cloud monitoring", "Security analytics", "Alerting systems"],
  },
  {
    id: "cc6",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Is cloud configuration management implemented?",
    weight: 2,
    impact: "Medium",
    controls: ["Configuration baselines", "Change management", "Compliance checking"],
  },
  {
    id: "cc7",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud backup and recovery procedures established?",
    weight: 3,
    impact: "High",
    controls: ["Cloud backups", "Recovery procedures", "Testing protocols"],
  },
  {
    id: "cc8",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Is cloud encryption implemented for data at rest and in transit?",
    weight: 3,
    impact: "High",
    controls: ["Encryption standards", "Key management", "Secure transmission"],
  },
  {
    id: "cc9",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud security contracts and SLAs properly defined?",
    weight: 2,
    impact: "Medium",
    controls: ["Security clauses", "SLA definitions", "Performance metrics"],
  },
  {
    id: "cc10",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Is there cloud incident response coordination with providers?",
    weight: 2,
    impact: "Medium",
    controls: ["Incident protocols", "Provider coordination", "Communication channels"],
  },
  {
    id: "cc11",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud workloads properly secured and hardened?",
    weight: 2,
    impact: "Medium",
    controls: ["Workload security", "Hardening standards", "Security baselines"],
  },
  {
    id: "cc12",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Is cloud network security properly configured?",
    weight: 2,
    impact: "Medium",
    controls: ["Network segmentation", "Security groups", "Traffic filtering"],
  },
  {
    id: "cc13",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud compliance requirements regularly verified?",
    weight: 2,
    impact: "Medium",
    controls: ["Compliance monitoring", "Regular audits", "Certification reviews"],
  },
  {
    id: "cc14",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Is cloud data sovereignty and residency managed?",
    weight: 2,
    impact: "Medium",
    controls: ["Data location controls", "Residency requirements", "Sovereignty policies"],
  },
  {
    id: "cc15",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud API security controls implemented?",
    weight: 2,
    impact: "Medium",
    controls: ["API security", "Authentication controls", "Rate limiting"],
  },
  {
    id: "cc16",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Is cloud cost optimization balanced with security requirements?",
    weight: 1,
    impact: "Low",
    controls: ["Cost controls", "Security investment", "Optimization strategies"],
  },
  {
    id: "cc17",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud security tools and services properly integrated?",
    weight: 2,
    impact: "Medium",
    controls: ["Tool integration", "Service orchestration", "Workflow automation"],
  },
  {
    id: "cc18",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Is cloud exit strategy and data portability planned?",
    weight: 1,
    impact: "Low",
    controls: ["Exit planning", "Data portability", "Transition procedures"],
  },
  {
    id: "cc19",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Are cloud security metrics monitored and reported?",
    weight: 1,
    impact: "Low",
    controls: ["Security metrics", "Performance dashboards", "Regular reporting"],
  },
  {
    id: "cc20",
    domain: "Third Party Cloud Computing Cybersecurity",
    text: "Is cloud security training provided to relevant staff?",
    weight: 1,
    impact: "Low",
    controls: ["Cloud training", "Certification programs", "Skills development"],
  },

  // Industrial Control System (ICS) Domain (20 questions)
  {
    id: "ics1",
    domain: "Industrial Control System (ICS)",
    text: "Is there network segmentation between IT and OT networks?",
    weight: 3,
    impact: "High",
    controls: ["Network isolation", "Air gaps", "Secure gateways"],
  },
  {
    id: "ics2",
    domain: "Industrial Control System (ICS)",
    text: "Are ICS systems regularly updated and patched?",
    weight: 3,
    impact: "High",
    controls: ["Patch management", "Testing procedures", "Maintenance windows"],
  },
  {
    id: "ics3",
    domain: "Industrial Control System (ICS)",
    text: "Is access to ICS systems properly controlled and monitored?",
    weight: 3,
    impact: "High",
    controls: ["Access controls", "Authentication systems", "Activity monitoring"],
  },
  {
    id: "ics4",
    domain: "Industrial Control System (ICS)",
    text: "Are ICS security policies and procedures documented?",
    weight: 2,
    impact: "Medium",
    controls: ["Policy documentation", "Procedures manual", "Compliance requirements"],
  },
  {
    id: "ics5",
    domain: "Industrial Control System (ICS)",
    text: "Is there ICS-specific incident response capability?",
    weight: 3,
    impact: "High",
    controls: ["ICS incident response", "Specialized procedures", "Recovery protocols"],
  },
  {
    id: "ics6",
    domain: "Industrial Control System (ICS)",
    text: "Are ICS backup and recovery procedures established?",
    weight: 3,
    impact: "High",
    controls: ["System backups", "Configuration backups", "Recovery testing"],
  },
  {
    id: "ics7",
    domain: "Industrial Control System (ICS)",
    text: "Is ICS security monitoring and logging implemented?",
    weight: 2,
    impact: "Medium",
    controls: ["Security monitoring", "Log collection", "Anomaly detection"],
  },
  {
    id: "ics8",
    domain: "Industrial Control System (ICS)",
    text: "Are ICS systems protected against malware?",
    weight: 2,
    impact: "Medium",
    controls: ["Anti-malware solutions", "Endpoint protection", "Behavior monitoring"],
  },
  {
    id: "ics9",
    domain: "Industrial Control System (ICS)",
    text: "Is there secure remote access for ICS maintenance?",
    weight: 2,
    impact: "Medium",
    controls: ["Secure remote access", "VPN solutions", "Session monitoring"],
  },
  {
    id: "ics10",
    domain: "Industrial Control System (ICS)",
    text: "Are ICS vendor relationships managed for security?",
    weight: 2,
    impact: "Medium",
    controls: ["Vendor assessments", "Security requirements", "Contract management"],
  },
  {
    id: "ics11",
    domain: "Industrial Control System (ICS)",
    text: "Is ICS personnel security training provided?",
    weight: 2,
    impact: "Medium",
    controls: ["ICS training programs", "Security awareness", "Skills development"],
  },
  {
    id: "ics12",
    domain: "Industrial Control System (ICS)",
    text: "Are ICS configuration management procedures implemented?",
    weight: 2,
    impact: "Medium",
    controls: ["Configuration management", "Change control", "Version tracking"],
  },
  {
    id: "ics13",
    domain: "Industrial Control System (ICS)",
    text: "Is physical security implemented for ICS infrastructure?",
    weight: 2,
    impact: "Medium",
    controls: ["Physical access controls", "Environmental monitoring", "Security cameras"],
  },
  {
    id: "ics14",
    domain: "Industrial Control System (ICS)",
    text: "Are ICS communications encrypted where appropriate?",
    weight: 2,
    impact: "Medium",
    controls: ["Communication encryption", "Secure protocols", "Key management"],
  },
  {
    id: "ics15",
    domain: "Industrial Control System (ICS)",
    text: "Is ICS vulnerability management implemented?",
    weight: 3,
    impact: "High",
    controls: ["Vulnerability scanning", "Risk assessment", "Remediation planning"],
  },
  {
    id: "ics16",
    domain: "Industrial Control System (ICS)",
    text: "Are ICS safety systems protected from cyber threats?",
    weight: 3,
    impact: "High",
    controls: ["Safety system protection", "Integrity monitoring", "Fail-safe mechanisms"],
  },
  {
    id: "ics17",
    domain: "Industrial Control System (ICS)",
    text: "Is there coordination between IT and OT security teams?",
    weight: 2,
    impact: "Medium",
    controls: ["Cross-team coordination", "Shared procedures", "Joint training"],
  },
  {
    id: "ics18",
    domain: "Industrial Control System (ICS)",
    text: "Are ICS security assessments regularly conducted?",
    weight: 2,
    impact: "Medium",
    controls: ["Security assessments", "Penetration testing", "Risk evaluations"],
  },
  {
    id: "ics19",
    domain: "Industrial Control System (ICS)",
    text: "Is ICS business continuity planning implemented?",
    weight: 2,
    impact: "Medium",
    controls: ["Continuity planning", "Recovery procedures", "Alternative operations"],
  },
  {
    id: "ics20",
    domain: "Industrial Control System (ICS)",
    text: "Are ICS security metrics monitored and reported?",
    weight: 1,
    impact: "Low",
    controls: ["Security metrics", "Performance monitoring", "Regular reporting"],
  },
];

const formSchema = z.object({
  answers: z.record(z.enum(["yes", "partial", "no"])),
});

interface QuestionFormProps {
  onComplete?: (assessmentId: number) => void;
}

export default function QuestionForm({ onComplete }: QuestionFormProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: {},
    },
  });

  const getCurrentPageQuestions = () => {
    const startIndex = currentPage * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return questions.slice(startIndex, endIndex);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const canProceed = () => {
    const currentQuestions = getCurrentPageQuestions();
    return currentQuestions.every(q => form.getValues(`answers.${q.id}`));
  };

  async function analyzeRisks(answers: Record<string, string>) {
    // Calculate risk scores for each domain
    const domainScores = new Map<string, { score: number, total: number }>();

    questions.forEach(q => {
      const answer = answers[q.id];
      const score = answer === "yes" ? q.weight : answer === "partial" ? q.weight / 2 : 0;

      if (!domainScores.has(q.domain)) {
        domainScores.set(q.domain, { score: 0, total: 0 });
      }
      const current = domainScores.get(q.domain)!;
      current.score += score;
      current.total += q.weight;
    });

    // Convert scores to percentages
    const results = Array.from(domainScores.entries()).map(([domain, { score, total }]) => ({
      domain,
      score: Math.round((score / total) * 100),
      riskLevel: score / total < 0.6 ? "High" : score / total < 0.8 ? "Medium" : "Low"
    }));

    return results;
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const results = await analyzeRisks(data.answers);
      let lastAssessmentId: number = 0;

      // Save assessment results
      for (const result of results) {
        const assessment = await apiRequest<{ id: number }>('POST', '/api/assessments', {
          userId: 1, // TODO: Replace with actual user ID
          domain: result.domain,
          score: result.score,
          completedAt: new Date().toISOString()
        });
        if (assessment && 'id' in assessment) {
          lastAssessmentId = assessment.id;
        }
      }

      toast({
        title: "Assessment Complete",
        description: "Your risk assessment has been analyzed and saved.",
      });

      // Call the onComplete callback if provided
      if (onComplete && lastAssessmentId) {
        onComplete(lastAssessmentId);
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment results.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            NCA ECC Risk Assessment
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Page {currentPage + 1} of {totalPages}</span>
              <span>{Math.round(((currentPage + 1) / totalPages) * 100)}% Complete</span>
            </div>
            <Progress value={((currentPage + 1) / totalPages) * 100} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Questions Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {getCurrentPageQuestions().map((question, index) => (
                  <div key={question.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        {currentPage * questionsPerPage + index + 1}
                      </Badge>
                      <div className="flex-1 space-y-2">
                        <FormField
                          control={form.control}
                          name={`answers.${question.id}`}
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{question.text}</span>
                                    <Badge variant={
                                      question.impact === "High" ? "destructive" : 
                                      question.impact === "Medium" ? "default" : "secondary"
                                    }>
                                      {question.impact} Impact
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    <strong>Recommended Controls:</strong> {question.controls?.join(", ")}
                                  </div>
                                </div>
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex gap-6"
                                >
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        Yes - Fully Implemented
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="partial" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        Partial - In Progress
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        No - Not Implemented
                                      </div>
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Questions {currentPage * questionsPerPage + 1} - {Math.min((currentPage + 1) * questionsPerPage, questions.length)} of {questions.length}
            </div>

            {currentPage < totalPages - 1 ? (
              <Button
                type="button"
                onClick={goToNextPage}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Assessment
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}