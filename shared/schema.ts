import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ncaEccDomains = [
  "Governance",
  "Cybersecurity Defence",
  "Cybersecurity Resilience",
  "Third Party Cloud Computing Cybersecurity",
  "Industrial Control System (ICS)"
] as const;

// NCA ECC detailed structure with controls
export const ncaEccStructure = {
  "Governance": {
    "Cybersecurity Strategy": [
      "ECC-1-1-1: Establish cybersecurity strategy",
      "ECC-1-1-2: Align with business objectives",
      "ECC-1-1-3: Regular strategy review"
    ],
    "Cybersecurity Policy": [
      "ECC-1-2-1: Document security policies",
      "ECC-1-2-2: Policy review and updates",
      "ECC-1-2-3: Policy communication"
    ],
    "Cybersecurity Roles and Responsibilities": [
      "ECC-1-3-1: Define security roles",
      "ECC-1-3-2: Assign responsibilities",
      "ECC-1-3-3: Document RACI matrix"
    ],
    "Asset Management": [
      "ECC-1-4-1: Asset inventory",
      "ECC-1-4-2: Asset classification",
      "ECC-1-4-3: Asset handling procedures"
    ],
    "Risk Management": [
      "ECC-1-5-1: Risk assessment methodology",
      "ECC-1-5-2: Regular risk assessments",
      "ECC-1-5-3: Risk treatment plans"
    ]
  },
  "Cybersecurity Defence": {
    "Access Control": [
      "ECC-2-1-1: Access control policy",
      "ECC-2-1-2: User access management",
      "ECC-2-1-3: Privileged access management"
    ],
    "Cryptography": [
      "ECC-2-2-1: Encryption standards",
      "ECC-2-2-2: Key management",
      "ECC-2-2-3: Cryptographic controls"
    ],
    "Email Security": [
      "ECC-2-3-1: Email protection measures",
      "ECC-2-3-2: Spam filtering",
      "ECC-2-3-3: Email encryption"
    ],
    "Network Security": [
      "ECC-2-4-1: Network segmentation",
      "ECC-2-4-2: Firewall management",
      "ECC-2-4-3: Network monitoring"
    ],
    "System Security": [
      "ECC-2-5-1: System hardening",
      "ECC-2-5-2: Patch management",
      "ECC-2-5-3: Endpoint protection"
    ]
  },
  "Cybersecurity Resilience": {
    "Business Continuity": [
      "ECC-3-1-1: BC planning",
      "ECC-3-1-2: BC testing",
      "ECC-3-1-3: Recovery procedures"
    ],
    "Disaster Recovery": [
      "ECC-3-2-1: DR strategy",
      "ECC-3-2-2: DR testing",
      "ECC-3-2-3: Backup procedures"
    ],
    "Incident Management": [
      "ECC-3-3-1: Incident response plan",
      "ECC-3-3-2: Incident detection",
      "ECC-3-3-3: Incident reporting"
    ],
    "Vulnerability Management": [
      "ECC-3-4-1: Vulnerability assessment",
      "ECC-3-4-2: Vulnerability remediation",
      "ECC-3-4-3: Security testing"
    ],
    "Threat Intelligence": [
      "ECC-3-5-1: Threat monitoring",
      "ECC-3-5-2: Threat analysis",
      "ECC-3-5-3: Intelligence sharing"
    ]
  },
  "Third Party Cloud Computing Cybersecurity": {
    "Cloud Service Provider Selection": [
      "ECC-4-1-1: Provider assessment",
      "ECC-4-1-2: Security requirements",
      "ECC-4-1-3: Compliance verification"
    ],
    "Data Protection in Cloud": [
      "ECC-4-2-1: Data classification",
      "ECC-4-2-2: Data encryption",
      "ECC-4-2-3: Data backup"
    ],
    "Cloud Security Configuration": [
      "ECC-4-3-1: Security settings",
      "ECC-4-3-2: Configuration management",
      "ECC-4-3-3: Change control"
    ],
    "Cloud Access Management": [
      "ECC-4-4-1: Identity management",
      "ECC-4-4-2: Access control",
      "ECC-4-4-3: Privilege management"
    ],
    "Cloud Monitoring": [
      "ECC-4-5-1: Performance monitoring",
      "ECC-4-5-2: Security monitoring",
      "ECC-4-5-3: Incident detection"
    ]
  },
  "Industrial Control System (ICS)": {
    "ICS Security Policy": [
      "ECC-5-1-1: ICS-specific policies",
      "ECC-5-1-2: Security procedures",
      "ECC-5-1-3: Policy compliance"
    ],
    "ICS Network Segmentation": [
      "ECC-5-2-1: Network zones",
      "ECC-5-2-2: Traffic control",
      "ECC-5-2-3: Remote access"
    ],
    "ICS Access Control": [
      "ECC-5-3-1: Access management",
      "ECC-5-3-2: Authentication",
      "ECC-5-3-3: Authorization"
    ],
    "ICS Incident Response": [
      "ECC-5-4-1: Response planning",
      "ECC-5-4-2: Incident handling",
      "ECC-5-4-3: Recovery procedures"
    ],
    "ICS Business Continuity": [
      "ECC-5-5-1: Continuity planning",
      "ECC-5-5-2: Backup systems",
      "ECC-5-5-3: Recovery testing"
    ]
  }
} as const;

// Keep existing table definitions
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  domain: text("domain").notNull(),
  score: integer("score").notNull(),
  completedAt: text("completed_at").notNull(),
});

export const vulnerabilities = pgTable("vulnerabilities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assessmentId: integer("assessment_id").notNull(),
  domain: text("domain").notNull(),
  subdomain: text("subdomain").notNull(),
  control: text("control").notNull(),
  status: text("status").notNull(), // "compliant", "partially-compliant", "non-compliant"
  impact: text("impact").notNull(), // "critical", "high", "medium", "low"
  risk: text("risk").notNull(), // calculated risk value
  description: text("description").notNull(),
  remediation: text("remediation").notNull(),
  timeline: text("timeline"), // remediation timeline
  createdAt: text("created_at").notNull(),
});

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  domain: text("domain").notNull(),
  subdomain: text("subdomain"),
  content: text("content").notNull(),
  generatedAt: text("generated_at").notNull(),
});

export const riskManagementPlans = pgTable("risk_management_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  vulnerabilityId: integer("vulnerability_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  riskLevel: text("risk_level").notNull(), // "critical", "high", "medium", "low"
  mitigationStrategy: text("mitigation_strategy").notNull(),
  responsibleParty: text("responsible_party").notNull(),
  targetDate: text("target_date").notNull(),
  budget: text("budget"),
  status: text("status").notNull(), // "pending", "in-progress", "completed", "deferred"
  progress: integer("progress").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// CISO Policies and Procedures Management
export const cisoPolicyCategories = [
  "Strategic Planning",
  "Governance & Compliance", 
  "Risk Management",
  "Security Operations",
  "Incident & Crisis Management",
  "Business Continuity",
  "Access & Identity Management",
  "Data Protection",
  "Network & Infrastructure",
  "Third-Party Management",
  "Training & Awareness",
  "IT Management & Operations",
  "IT Infrastructure & Architecture",
  "IT Service Management",
  "IT Project & Resource Management",
  "Technology Strategy & Innovation",
  "Software Development & Engineering",
  "Technology Operations & Performance",
  "Digital Transformation",
  "Technology Governance",
  "Infrastructure & Operations",
  "System Administration & Maintenance",
  "Security & Access Management", 
  "Asset & Inventory Management",
  "Project & Change Management"
] as const;

export const cisoPolicyTypes = [
  "Security Budget Proposal",
  "Business Continuity Plan", 
  "Data Classification Policy",
  "Compliance Audit Report",
  "Data Breach Notification Plan",
  "Network Security Policy",
  "Patch Management Policy",
  "Security Architecture Document",
  "Security Awareness Training Material",
  "Security Metrics Report",
  "Security Program Roadmap",
  "Third-Party Security Agreement",
  "Vendor Security Assessment Document",
  "Vulnerability Management Plan",
  "Access Control Policy",
  "Encryption Policy",
  "Information Security Policy",
  "Disaster Recovery Plan",
  "Incident Response Plan",
  "Network Architecture Plan",
  "IT Staffing Plan",
  "System Upgrade Proposal",
  "IT Budget Proposal",
  "IT Policy Document",
  "IT Compliance Audit Report",
  "IT Project Management Plan",
  "IT Vendor Evaluation Document",
  "Data Security Plan",
  "IT Risk Assessment Document",
  "IT Service Level Agreement",
  "IT Incident Response Plan",
  "IT Infrastructure Maintenance Plan",
  "IT Strategic Plan",
  "IT Vendor Management Policy",
  "IT Training Plan",
  "IT Training and Development Plan", 
  "Technology Budget",
  "System Architecture Document",
  "Software Development Lifecycle Plan",
  "Technology Evaluation Report",
  "IT Performance Metrics Report",
  "IT Asset Management Plan",
  "IT Performance Metrics and Reporting Document",
  "IT Service Management Plan",
  "IT Vendor Management Plan",
  "IT Project Management Framework Document",
  "IT Governance Framework Document",
  "IT Compliance Plan",
  "Product Development Plan",
  "Software Development Lifecycle (SDLC) Policy",
  "IT Change Management Plan",
  "Data Privacy Policy",
  "IT Compliance And Audit Plan",
  "CTO Security Policy",
  "IT Infrastructure Budget Document",
  "Backup And Recovery Plan Document",
  "Network Performance Report",
  "System Monitoring Report",
  "IT Project Plan",
  "System Configuration Document",
  "Vendor Management Policy",
  "Change Management Policy Document",
  "Software Inventory Document",
  "System Upgrade Plan", 
  "User Access Control Policy Document",
  "Network Diagram",
  "Server Maintenance Plan",
  "Hardware Inventory Document"
] as const;

export const cisoPolicies = pgTable("ciso_policies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  policyType: text("policy_type").notNull(), // from cisoPolicyTypes
  category: text("category").notNull(), // from cisoPolicyCategories
  title: text("title").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  version: text("version").notNull(),
  status: text("status").notNull(), // "draft", "review", "approved", "active", "archived"
  priority: text("priority").notNull(), // "low", "medium", "high", "critical"
  owner: text("owner").notNull(), // responsible person/department
  approvedBy: text("approved_by"),
  reviewDate: text("review_date"),
  expiryDate: text("expiry_date"),
  tags: text("tags").array(), // for searchability
  aiGenerated: boolean("ai_generated").notNull().default(false),
  templateUsed: text("template_used"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const cisoPolicyTemplates = pgTable("ciso_policy_templates", {
  id: serial("id").primaryKey(),
  policyType: text("policy_type").notNull(), // from cisoPolicyTypes
  category: text("category").notNull(), // from cisoPolicyCategories
  name: text("name").notNull(),
  description: text("description"),
  template: text("template").notNull(), // template content with placeholders
  sections: text("sections").array(), // ordered list of sections
  requiredFields: text("required_fields").array(), // fields that must be filled
  isActive: boolean("is_active").notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const cisoPolicyReviews = pgTable("ciso_policy_reviews", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id").notNull(),
  reviewerId: integer("reviewer_id").notNull(),
  status: text("status").notNull(), // "pending", "approved", "rejected", "changes-requested"
  comments: text("comments"),
  reviewedAt: text("reviewed_at").notNull(),
});

// Keep existing schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  userId: true,
  domain: true,
  score: true,
  completedAt: true,
});

export const insertPolicySchema = createInsertSchema(policies).pick({
  userId: true,
  domain: true,
  subdomain: true,
  content: true,
  generatedAt: true,
});

export const insertVulnerabilitySchema = createInsertSchema(vulnerabilities).pick({
  userId: true,
  assessmentId: true,
  domain: true,
  subdomain: true,
  control: true,
  status: true,
  impact: true,
  risk: true,
  description: true,
  remediation: true,
  timeline: true,
  createdAt: true,
});

export const insertRiskManagementPlanSchema = createInsertSchema(riskManagementPlans).pick({
  userId: true,
  vulnerabilityId: true,
  title: true,
  description: true,
  riskLevel: true,
  mitigationStrategy: true,
  responsibleParty: true,
  targetDate: true,
  budget: true,
  status: true,
  progress: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCisoPolicySchema = createInsertSchema(cisoPolicies).pick({
  userId: true,
  policyType: true,
  category: true,
  title: true,
  description: true,
  content: true,
  version: true,
  status: true,
  priority: true,
  owner: true,
  approvedBy: true,
  reviewDate: true,
  expiryDate: true,
  tags: true,
  aiGenerated: true,
  templateUsed: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCisoPolicyTemplateSchema = createInsertSchema(cisoPolicyTemplates).pick({
  policyType: true,
  category: true,
  name: true,
  description: true,
  template: true,
  sections: true,
  requiredFields: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCisoPolicyReviewSchema = createInsertSchema(cisoPolicyReviews).pick({
  policyId: true,
  reviewerId: true,
  status: true,
  comments: true,
  reviewedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;

export type Vulnerability = typeof vulnerabilities.$inferSelect;
export type InsertVulnerability = z.infer<typeof insertVulnerabilitySchema>;

export type RiskManagementPlan = typeof riskManagementPlans.$inferSelect;
export type InsertRiskManagementPlan = z.infer<typeof insertRiskManagementPlanSchema>;

export type CisoPolicy = typeof cisoPolicies.$inferSelect;
export type InsertCisoPolicy = z.infer<typeof insertCisoPolicySchema>;

export type CisoPolicyTemplate = typeof cisoPolicyTemplates.$inferSelect;
export type InsertCisoPolicyTemplate = z.infer<typeof insertCisoPolicyTemplateSchema>;

export type CisoPolicyReview = typeof cisoPolicyReviews.$inferSelect;
export type InsertCisoPolicyReview = z.infer<typeof insertCisoPolicyReviewSchema>;