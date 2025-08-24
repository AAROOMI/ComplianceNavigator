import { storage } from "./storage";

// Common cybersecurity risks for pre-populating the risk register
export const commonCyberRisks = [
  {
    category: "Data Security",
    subcategory: "Data Breach",
    title: "Unauthorized Access to Sensitive Data",
    description: "Risk of unauthorized individuals gaining access to confidential customer data, financial records, or intellectual property through security vulnerabilities or insider threats.",
    riskLevel: "Critical",
    impact: "Severe financial losses, regulatory fines, reputational damage, loss of customer trust, legal liability, and potential business closure.",
    likelihood: "High",
    threats: ["External hackers", "Malicious insiders", "Accidental disclosure", "Third-party breaches"],
    vulnerabilities: ["Weak access controls", "Unencrypted data", "Insufficient monitoring", "Outdated security patches"],
    assets: ["Customer databases", "Financial records", "Intellectual property", "Personal information"],
    controls: ["Access control systems", "Data encryption", "Security monitoring", "Regular audits"],
    mitigationStrategies: ["Multi-factor authentication", "Data loss prevention", "Employee training", "Incident response plan"],
    complianceFrameworks: ["GDPR", "CCPA", "HIPAA", "PCI DSS", "ISO 27001"],
    tags: ["data-breach", "confidentiality", "privacy", "compliance"],
    isActive: true
  },
  {
    category: "Network Security",
    subcategory: "Malware",
    title: "Malware and Ransomware Attacks",
    description: "Risk of malicious software infiltrating systems, corrupting data, stealing information, or encrypting files for ransom demands.",
    riskLevel: "Critical",
    impact: "Business disruption, data loss, financial extortion, operational downtime, recovery costs, and potential permanent data loss.",
    likelihood: "High",
    threats: ["Ransomware groups", "Malware distributors", "Phishing campaigns", "Drive-by downloads"],
    vulnerabilities: ["Unpatched software", "Weak email security", "Insufficient endpoint protection", "User awareness gaps"],
    assets: ["Servers", "Workstations", "Network infrastructure", "Business applications", "Backup systems"],
    controls: ["Antivirus software", "Email filtering", "Network segmentation", "Backup systems"],
    mitigationStrategies: ["Regular patching", "Employee awareness training", "Endpoint detection and response", "Offline backups"],
    complianceFrameworks: ["NIST Cybersecurity Framework", "ISO 27001", "CIS Controls"],
    tags: ["malware", "ransomware", "endpoint-security", "business-continuity"],
    isActive: true
  },
  {
    category: "Access Control",
    subcategory: "Identity Management",
    title: "Privilege Escalation and Unauthorized Access",
    description: "Risk of users gaining unauthorized elevated privileges or accessing systems and data beyond their authorized scope.",
    riskLevel: "High",
    impact: "Unauthorized data access, system compromise, compliance violations, internal fraud, and potential for widespread security breaches.",
    likelihood: "Medium",
    threats: ["Privilege abuse", "Account compromise", "Social engineering", "Insider threats"],
    vulnerabilities: ["Excessive privileges", "Weak password policies", "Lack of access reviews", "Shared accounts"],
    assets: ["User accounts", "Administrative systems", "Sensitive databases", "Critical applications"],
    controls: ["Role-based access control", "Privileged access management", "Access reviews", "Account monitoring"],
    mitigationStrategies: ["Principle of least privilege", "Regular access audits", "Multi-factor authentication", "Just-in-time access"],
    complianceFrameworks: ["SOX", "ISO 27001", "NIST", "CIS Controls"],
    tags: ["access-control", "privilege-escalation", "identity-management", "insider-threat"],
    isActive: true
  },
  {
    category: "Cloud Security",
    subcategory: "Configuration",
    title: "Cloud Misconfiguration and Data Exposure",
    description: "Risk of improperly configured cloud services exposing sensitive data, creating unauthorized access points, or violating security policies.",
    riskLevel: "High",
    impact: "Data breaches, compliance violations, unexpected costs, service disruptions, and exposure of sensitive information to the public internet.",
    likelihood: "High",
    threats: ["Configuration errors", "Default settings", "Shared responsibility gaps", "Shadow IT"],
    vulnerabilities: ["Public storage buckets", "Open databases", "Weak IAM policies", "Unencrypted communications"],
    assets: ["Cloud storage", "Cloud databases", "Virtual machines", "Cloud applications", "API endpoints"],
    controls: ["Cloud security posture management", "Configuration scanning", "IAM policies", "Encryption"],
    mitigationStrategies: ["Security automation", "Regular configuration audits", "Cloud security training", "Governance policies"],
    complianceFrameworks: ["Cloud Security Alliance", "NIST", "ISO 27017", "FedRAMP"],
    tags: ["cloud-security", "misconfiguration", "data-exposure", "iam"],
    isActive: true
  },
  {
    category: "Physical Security",
    subcategory: "Facility Access",
    title: "Unauthorized Physical Access to IT Infrastructure",
    description: "Risk of unauthorized individuals gaining physical access to servers, network equipment, or workstations in office facilities or data centers.",
    riskLevel: "Medium",
    impact: "Data theft, system tampering, service disruption, industrial espionage, and potential for installing malicious hardware or software.",
    likelihood: "Low",
    threats: ["Unauthorized visitors", "Former employees", "Social engineering", "Tailgating"],
    vulnerabilities: ["Weak access controls", "Unmonitored areas", "Shared access codes", "Missing security cameras"],
    assets: ["Server rooms", "Network closets", "Workstations", "Storage devices", "Network equipment"],
    controls: ["Access card systems", "Security cameras", "Visitor management", "Security guards"],
    mitigationStrategies: ["Multi-factor facility access", "Regular access reviews", "Employee security training", "Physical security audits"],
    complianceFrameworks: ["ISO 27001", "SOC 2", "NIST"],
    tags: ["physical-security", "facility-access", "data-center", "surveillance"],
    isActive: true
  },
  {
    category: "Operational Security",
    subcategory: "Business Continuity",
    title: "System Outage and Service Disruption",
    description: "Risk of critical business systems becoming unavailable due to hardware failures, software issues, natural disasters, or cyber attacks.",
    riskLevel: "High",
    impact: "Revenue loss, customer dissatisfaction, operational disruption, SLA breaches, reputational damage, and potential regulatory penalties.",
    likelihood: "Medium",
    threats: ["Hardware failures", "Software bugs", "Cyber attacks", "Natural disasters", "Power outages"],
    vulnerabilities: ["Single points of failure", "Inadequate backups", "Poor disaster recovery planning", "Insufficient redundancy"],
    assets: ["Production systems", "Database servers", "Network infrastructure", "Applications", "Data centers"],
    controls: ["Redundant systems", "Backup and recovery", "Monitoring and alerting", "Disaster recovery plans"],
    mitigationStrategies: ["High availability architecture", "Regular backup testing", "Incident response procedures", "Service level monitoring"],
    complianceFrameworks: ["ISO 22301", "NIST", "ITIL", "COBIT"],
    tags: ["business-continuity", "disaster-recovery", "availability", "resilience"],
    isActive: true
  },
  {
    category: "Third Party Risk",
    subcategory: "Vendor Management",
    title: "Third-Party Security Breach and Data Exposure",
    description: "Risk of security incidents occurring through third-party vendors, suppliers, or service providers who have access to organizational data or systems.",
    riskLevel: "High",
    impact: "Data breaches, compliance violations, reputational damage, financial losses, and potential liability for third-party security failures.",
    likelihood: "Medium",
    threats: ["Vendor security breaches", "Supply chain attacks", "Inadequate vendor controls", "Data sharing risks"],
    vulnerabilities: ["Weak vendor assessments", "Insufficient monitoring", "Poor contract terms", "Limited visibility"],
    assets: ["Shared data", "Integrated systems", "Vendor platforms", "Supply chain", "Customer information"],
    controls: ["Vendor risk assessments", "Security requirements", "Contract terms", "Ongoing monitoring"],
    mitigationStrategies: ["Due diligence processes", "Security questionnaires", "Regular audits", "Incident response coordination"],
    complianceFrameworks: ["SOC 2", "ISO 27001", "NIST", "GDPR"],
    tags: ["third-party-risk", "vendor-management", "supply-chain", "due-diligence"],
    isActive: true
  },
  {
    category: "Compliance & Governance",
    subcategory: "Regulatory Compliance",
    title: "Regulatory Non-Compliance and Legal Violations",
    description: "Risk of failing to meet regulatory requirements for data protection, financial reporting, industry standards, or other applicable laws and regulations.",
    riskLevel: "Critical",
    impact: "Regulatory fines, legal penalties, business license revocation, reputational damage, increased scrutiny, and potential criminal liability.",
    likelihood: "Medium",
    threats: ["Regulatory changes", "Audit findings", "Compliance gaps", "Process failures"],
    vulnerabilities: ["Outdated policies", "Insufficient training", "Poor documentation", "Lack of monitoring"],
    assets: ["Compliance documentation", "Audit trails", "Policy frameworks", "Training records", "Monitoring systems"],
    controls: ["Compliance management systems", "Regular audits", "Policy updates", "Training programs"],
    mitigationStrategies: ["Continuous compliance monitoring", "Regular policy reviews", "Legal counsel consultation", "Compliance automation"],
    complianceFrameworks: ["GDPR", "HIPAA", "SOX", "PCI DSS", "CCPA", "PIPEDA"],
    tags: ["regulatory-compliance", "legal-risk", "audit", "governance"],
    isActive: true
  },
  {
    category: "Mobile Security",
    subcategory: "Device Management",
    title: "Mobile Device Security Compromise",
    description: "Risk of security breaches through compromised mobile devices accessing corporate networks, applications, or sensitive data.",
    riskLevel: "Medium",
    impact: "Data leakage, unauthorized access, malware propagation, compliance violations, and potential compromise of corporate networks.",
    likelihood: "Medium",
    threats: ["Lost devices", "Malicious apps", "Unsecured Wi-Fi", "Device theft", "Jailbroken devices"],
    vulnerabilities: ["Unmanaged devices", "Weak device policies", "Insufficient encryption", "Outdated mobile OS"],
    assets: ["Mobile devices", "Corporate apps", "Email data", "VPN access", "Cloud services"],
    controls: ["Mobile device management", "App whitelisting", "Device encryption", "Remote wipe capabilities"],
    mitigationStrategies: ["BYOD policies", "Mobile security training", "App vetting", "Conditional access"],
    complianceFrameworks: ["NIST", "ISO 27001", "ENISA"],
    tags: ["mobile-security", "byod", "device-management", "data-leakage"],
    isActive: true
  },
  {
    category: "Data Security",
    subcategory: "Data Loss",
    title: "Accidental Data Loss and Corruption",
    description: "Risk of unintentional data loss, deletion, or corruption due to human error, system failures, or inadequate backup procedures.",
    riskLevel: "High",
    impact: "Loss of critical business data, operational disruption, recovery costs, potential compliance violations, and customer impact.",
    likelihood: "Medium",
    threats: ["Human error", "System failures", "Corruption", "Accidental deletion", "Hardware failures"],
    vulnerabilities: ["Insufficient backups", "Lack of version control", "Poor data management", "Inadequate testing"],
    assets: ["Business databases", "Document repositories", "Email systems", "File servers", "Application data"],
    controls: ["Automated backups", "Version control", "Data recovery procedures", "Access controls"],
    mitigationStrategies: ["Regular backup testing", "Data retention policies", "Employee training", "Redundant storage"],
    complianceFrameworks: ["ISO 27001", "NIST", "COBIT"],
    tags: ["data-loss", "backup-recovery", "data-integrity", "human-error"],
    isActive: true
  }
];

export async function seedRiskRegister() {
  console.log("Seeding risk register with common cybersecurity risks...");
  
  try {
    for (const risk of commonCyberRisks) {
      await storage.createRiskRegisterEntry(risk);
      console.log(`Added risk: ${risk.title}`);
    }
    console.log(`Successfully seeded ${commonCyberRisks.length} risks to the register.`);
  } catch (error) {
    console.error("Error seeding risk register:", error);
  }
}