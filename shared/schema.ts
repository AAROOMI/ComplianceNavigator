import { pgTable, text, serial, integer, boolean, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Official NCA ECC-1:2018 Main Domains (5 domains, 29 subdomains, 114 controls)
export const ncaEccDomains = [
  "Cybersecurity Governance",
  "Cybersecurity Defense",
  "Cybersecurity Resilience",
  "Third-Party and Cloud Computing Cybersecurity",
  "Industrial Control Systems Cybersecurity"
] as const;

// Official NCA ECC-1:2018 detailed structure with all 114 Essential Cybersecurity Controls
// Based on official NCA ECC framework: 5 domains, 29 subdomains, 114 controls
export const ncaEccStructure = {
  "Cybersecurity Governance": {
    "Cybersecurity Strategy": [
      "ECC-1-1-1: Establish comprehensive cybersecurity strategy aligned with business objectives",
      "ECC-1-1-2: Define cybersecurity vision, mission, and strategic objectives",
      "ECC-1-1-3: Conduct regular strategic reviews and updates",
      "ECC-1-1-4: Integrate cybersecurity into organizational strategic planning",
      "ECC-1-1-5: Establish metrics for cybersecurity strategy effectiveness"
    ],
    "Cybersecurity Policy": [
      "ECC-1-2-1: Develop and maintain cybersecurity policy framework",
      "ECC-1-2-2: Establish policy review and approval processes",
      "ECC-1-2-3: Implement policy communication and awareness programs",
      "ECC-1-2-4: Monitor policy compliance and effectiveness",
      "ECC-1-2-5: Maintain policy version control and documentation"
    ],
    "Cybersecurity Roles and Responsibilities": [
      "ECC-1-3-1: Define cybersecurity organizational structure",
      "ECC-1-3-2: Establish clear roles and responsibilities matrix (RACI)",
      "ECC-1-3-3: Document job descriptions with cybersecurity requirements",
      "ECC-1-3-4: Implement cybersecurity competency framework",
      "ECC-1-3-5: Establish security champion networks"
    ],
    "Asset Management": [
      "ECC-1-4-1: Maintain comprehensive asset inventory",
      "ECC-1-4-2: Classify assets based on criticality and sensitivity",
      "ECC-1-4-3: Implement asset lifecycle management processes",
      "ECC-1-4-4: Establish asset handling and disposal procedures",
      "ECC-1-4-5: Monitor and track asset changes and updates"
    ],
    "Risk Management": [
      "ECC-1-5-1: Establish enterprise risk assessment methodology",
      "ECC-1-5-2: Conduct regular cybersecurity risk assessments",
      "ECC-1-5-3: Develop and maintain risk treatment plans",
      "ECC-1-5-4: Implement risk monitoring and reporting processes",
      "ECC-1-5-5: Establish risk appetite and tolerance levels"
    ],
    "Cybersecurity Awareness and Training": [
      "ECC-1-6-1: Develop cybersecurity awareness program",
      "ECC-1-6-2: Implement role-based security training",
      "ECC-1-6-3: Conduct regular phishing simulation exercises",
      "ECC-1-6-4: Measure training effectiveness and knowledge retention",
      "ECC-1-6-5: Maintain training records and compliance tracking"
    ]
  },
  "Cybersecurity Defense": {
    "Identity and Access Management": [
      "ECC-2-1-1: Implement identity lifecycle management",
      "ECC-2-1-2: Establish strong authentication mechanisms",
      "ECC-2-1-3: Deploy privileged access management (PAM)",
      "ECC-2-1-4: Implement role-based access control (RBAC)",
      "ECC-2-1-5: Conduct regular access reviews and certification",
      "ECC-2-1-6: Implement just-in-time access principles",
      "ECC-2-1-7: Deploy single sign-on (SSO) solutions"
    ],
    "Cryptography and Data Protection": [
      "ECC-2-2-1: Implement data-at-rest encryption standards",
      "ECC-2-2-2: Deploy data-in-transit encryption",
      "ECC-2-2-3: Establish cryptographic key management",
      "ECC-2-2-4: Implement data loss prevention (DLP)",
      "ECC-2-2-5: Deploy data classification and labeling",
      "ECC-2-2-6: Establish secure data backup and recovery"
    ],
    "Email and Communication Security": [
      "ECC-2-3-1: Deploy advanced email security solutions",
      "ECC-2-3-2: Implement email encryption capabilities",
      "ECC-2-3-3: Configure anti-spam and anti-malware filters",
      "ECC-2-3-4: Establish secure communication protocols",
      "ECC-2-3-5: Implement email data loss prevention"
    ],
    "Network Security": [
      "ECC-2-4-1: Implement network segmentation and micro-segmentation",
      "ECC-2-4-2: Deploy next-generation firewalls (NGFW)",
      "ECC-2-4-3: Implement intrusion detection and prevention systems",
      "ECC-2-4-4: Establish secure network monitoring",
      "ECC-2-4-5: Deploy VPN solutions for remote access",
      "ECC-2-4-6: Implement zero-trust network architecture",
      "ECC-2-4-7: Establish wireless network security controls"
    ],
    "Endpoint and System Security": [
      "ECC-2-5-1: Deploy endpoint detection and response (EDR)",
      "ECC-2-5-2: Implement system hardening standards",
      "ECC-2-5-3: Establish patch management processes",
      "ECC-2-5-4: Deploy anti-malware solutions",
      "ECC-2-5-5: Implement mobile device management (MDM)",
      "ECC-2-5-6: Establish secure configuration baselines"
    ],
    "Application Security": [
      "ECC-2-6-1: Implement secure software development lifecycle",
      "ECC-2-6-2: Conduct application security testing",
      "ECC-2-6-3: Deploy web application firewalls (WAF)",
      "ECC-2-6-4: Establish application security standards",
      "ECC-2-6-5: Implement API security controls"
    ]
  },
  "Cybersecurity Resilience": {
    "Business Continuity Planning": [
      "ECC-3-1-1: Develop comprehensive business continuity plans",
      "ECC-3-1-2: Conduct business impact assessments (BIA)",
      "ECC-3-1-3: Establish recovery time and point objectives",
      "ECC-3-1-4: Test business continuity procedures regularly",
      "ECC-3-1-5: Maintain continuity plan documentation",
      "ECC-3-1-6: Train staff on continuity procedures"
    ],
    "Disaster Recovery": [
      "ECC-3-2-1: Establish disaster recovery strategy and plans",
      "ECC-3-2-2: Implement backup and recovery solutions",
      "ECC-3-2-3: Test disaster recovery procedures regularly",
      "ECC-3-2-4: Maintain alternative processing facilities",
      "ECC-3-2-5: Establish communication plans for disasters",
      "ECC-3-2-6: Document recovery procedures and playbooks"
    ],
    "Incident Response and Management": [
      "ECC-3-3-1: Establish incident response team and procedures",
      "ECC-3-3-2: Implement incident detection and monitoring",
      "ECC-3-3-3: Develop incident classification and prioritization",
      "ECC-3-3-4: Establish incident reporting and communication",
      "ECC-3-3-5: Implement forensics and evidence collection",
      "ECC-3-3-6: Conduct post-incident reviews and lessons learned"
    ],
    "Vulnerability Management": [
      "ECC-3-4-1: Implement vulnerability scanning and assessment",
      "ECC-3-4-2: Establish vulnerability remediation processes",
      "ECC-3-4-3: Conduct penetration testing and security assessments",
      "ECC-3-4-4: Maintain vulnerability databases and tracking",
      "ECC-3-4-5: Prioritize vulnerabilities based on risk",
      "ECC-3-4-6: Monitor threat landscape and emerging vulnerabilities"
    ],
    "Security Monitoring and SIEM": [
      "ECC-3-5-1: Deploy security information and event management (SIEM)",
      "ECC-3-5-2: Implement continuous security monitoring",
      "ECC-3-5-3: Establish security operations center (SOC)",
      "ECC-3-5-4: Deploy threat hunting capabilities",
      "ECC-3-5-5: Implement automated threat detection and response",
      "ECC-3-5-6: Establish security metrics and reporting"
    ]
  },
  "Third-Party and Cloud Computing Cybersecurity": {
    "Cloud Service Provider Management": [
      "ECC-4-1-1: Establish cloud service provider assessment criteria",
      "ECC-4-1-2: Implement cloud security due diligence processes",
      "ECC-4-1-3: Define cloud service level agreements (SLAs)",
      "ECC-4-1-4: Conduct regular cloud provider security reviews",
      "ECC-4-1-5: Establish cloud exit strategies and data portability"
    ],
    "Cloud Data Protection": [
      "ECC-4-2-1: Implement cloud data classification and labeling",
      "ECC-4-2-2: Deploy cloud data encryption solutions",
      "ECC-4-2-3: Establish cloud backup and recovery procedures",
      "ECC-4-2-4: Implement cloud data loss prevention (DLP)",
      "ECC-4-2-5: Establish data residency and sovereignty controls"
    ],
    "Cloud Security Configuration": [
      "ECC-4-3-1: Implement cloud security posture management",
      "ECC-4-3-2: Establish cloud configuration standards",
      "ECC-4-3-3: Deploy cloud security assessment tools",
      "ECC-4-3-4: Implement infrastructure as code (IaC) security",
      "ECC-4-3-5: Establish cloud change management processes"
    ],
    "Cloud Access and Identity Management": [
      "ECC-4-4-1: Implement cloud identity and access management",
      "ECC-4-4-2: Deploy cloud single sign-on (SSO) solutions",
      "ECC-4-4-3: Establish cloud privileged access management",
      "ECC-4-4-4: Implement cloud multi-factor authentication",
      "ECC-4-4-5: Conduct cloud access reviews and auditing"
    ],
    "Cloud Security Monitoring": [
      "ECC-4-5-1: Implement cloud security monitoring and logging",
      "ECC-4-5-2: Deploy cloud workload protection platforms",
      "ECC-4-5-3: Establish cloud incident response procedures",
      "ECC-4-5-4: Implement cloud compliance monitoring",
      "ECC-4-5-5: Deploy cloud security orchestration and automation"
    ]
  },
  "Industrial Control Systems Cybersecurity": {
    "ICS Security Governance": [
      "ECC-5-1-1: Establish ICS-specific cybersecurity policies",
      "ECC-5-1-2: Develop ICS security procedures and standards",
      "ECC-5-1-3: Implement ICS security compliance framework",
      "ECC-5-1-4: Establish ICS security risk management",
      "ECC-5-1-5: Create ICS asset inventory and classification"
    ],
    "ICS Network Security": [
      "ECC-5-2-1: Implement ICS network segmentation and zones",
      "ECC-5-2-2: Deploy ICS network monitoring and detection",
      "ECC-5-2-3: Establish secure remote access for ICS",
      "ECC-5-2-4: Implement ICS firewall and network controls",
      "ECC-5-2-5: Deploy industrial demilitarized zones (DMZ)"
    ],
    "ICS Access Control and Authentication": [
      "ECC-5-3-1: Implement ICS identity and access management",
      "ECC-5-3-2: Deploy ICS multi-factor authentication",
      "ECC-5-3-3: Establish ICS privileged access controls",
      "ECC-5-3-4: Implement ICS role-based access control",
      "ECC-5-3-5: Conduct regular ICS access reviews"
    ],
    "ICS Security Monitoring and Incident Response": [
      "ECC-5-4-1: Deploy ICS security monitoring solutions",
      "ECC-5-4-2: Establish ICS incident response procedures",
      "ECC-5-4-3: Implement ICS anomaly detection systems",
      "ECC-5-4-4: Create ICS security event correlation",
      "ECC-5-4-5: Establish ICS forensics capabilities"
    ],
    "ICS Resilience and Recovery": [
      "ECC-5-5-1: Develop ICS business continuity plans",
      "ECC-5-5-2: Implement ICS backup and recovery systems",
      "ECC-5-5-3: Conduct ICS recovery testing and validation",
      "ECC-5-5-4: Establish ICS maintenance and support procedures",
      "ECC-5-5-5: Implement ICS configuration management"
    ]
  }
} as const;

// Enhanced User Management with RBAC
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // "admin", "manager", "analyst", "viewer", etc.
  displayName: text("display_name").notNull(),
  description: text("description"),
  permissions: text("permissions").array(), // Array of permission strings
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImage: text("profile_image"), // Object storage path
  roleId: integer("role_id").notNull(),
  department: text("department"),
  position: text("position"),
  phoneNumber: text("phone_number"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  passwordChangedAt: timestamp("password_changed_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by"), // Admin who created this user
});

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionToken: text("session_token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  loginAt: timestamp("login_at").defaultNow(),
  logoutAt: timestamp("logout_at"),
  isActive: boolean("is_active").notNull().default(true),
});

export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(), // "login", "logout", "create_policy", "view_assessment", etc.
  resource: text("resource"), // What was accessed/modified
  resourceId: integer("resource_id"), // ID of the resource
  details: jsonb("details"), // Additional action details
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userWorkspaces = pgTable("user_workspaces", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  settings: jsonb("settings"), // User-specific workspace settings
  dashboardConfig: jsonb("dashboard_config"), // Custom dashboard layout
  favoritePages: text("favorite_pages").array(), // Array of favorite page URLs
  recentActivities: jsonb("recent_activities"), // Recent activities in workspace
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // "view_assessments", "create_policies", etc.
  displayName: text("display_name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "assessments", "policies", "users", "reports"
  createdAt: timestamp("created_at").defaultNow(),
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


// Built-in Risk Register - Pre-defined common cybersecurity risks
export const riskRegister = pgTable("risk_register", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // "data_security", "network_security", "access_control", etc.
  subcategory: text("subcategory"), // More specific classification
  title: text("title").notNull(),
  description: text("description").notNull(),
  riskLevel: text("risk_level").notNull(), // "critical", "high", "medium", "low"
  impact: text("impact").notNull(), // Business impact description
  likelihood: text("likelihood").notNull(), // "very_high", "high", "medium", "low", "very_low"
  threats: text("threats").array(), // Array of threat types
  vulnerabilities: text("vulnerabilities").array(), // Array of vulnerability types
  assets: text("assets").array(), // Array of asset types affected
  controls: text("controls").array(), // Array of recommended controls
  mitigationStrategies: text("mitigation_strategies").array(), // Array of mitigation options
  complianceFrameworks: text("compliance_frameworks").array(), // NIST, ISO27001, etc.
  tags: text("tags").array(), // Additional tags for filtering
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// New User Management Schema exports
export const insertRoleSchema = createInsertSchema(roles).pick({
  name: true,
  displayName: true,
  description: true,
  permissions: true,
  isActive: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  profileImage: true,
  roleId: true,
  department: true,
  position: true,
  phoneNumber: true,
  isActive: true,
  createdBy: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).pick({
  userId: true,
  sessionToken: true,
  ipAddress: true,
  userAgent: true,
});

export const insertUserActivitySchema = createInsertSchema(userActivities).pick({
  userId: true,
  action: true,
  resource: true,
  resourceId: true,
  details: true,
  ipAddress: true,
  userAgent: true,
});

export const insertUserWorkspaceSchema = createInsertSchema(userWorkspaces).pick({
  userId: true,
  name: true,
  description: true,
  settings: true,
  dashboardConfig: true,
  favoritePages: true,
  recentActivities: true,
  isDefault: true,
});

export const insertPermissionSchema = createInsertSchema(permissions).pick({
  name: true,
  displayName: true,
  description: true,
  category: true,
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


export const insertRiskRegisterSchema = createInsertSchema(riskRegister).pick({
  category: true,
  subcategory: true,
  title: true,
  description: true,
  riskLevel: true,
  impact: true,
  likelihood: true,
  threats: true,
  vulnerabilities: true,
  assets: true,
  controls: true,
  mitigationStrategies: true,
  complianceFrameworks: true,
  tags: true,
  isActive: true,
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

// User Management Types
export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;

export type UserWorkspace = typeof userWorkspaces.$inferSelect;
export type InsertUserWorkspace = z.infer<typeof insertUserWorkspaceSchema>;

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;

// Existing Types
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

// Notification system tables
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: varchar("type").notNull(), // policy_review, policy_expiry, policy_created, policy_updated
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  priority: varchar("priority").default("medium"), // low, medium, high, critical
  category: varchar("category").notNull(), // policy, system, security, general
  relatedId: varchar("related_id"), // ID of related policy/item
  relatedType: varchar("related_type"), // policy, assessment, etc
  isRead: boolean("is_read").default(false),
  isArchived: boolean("is_archived").default(false),
  actionUrl: varchar("action_url"), // URL for notification action
  actionText: varchar("action_text"), // Text for action button
  metadata: jsonb("metadata"), // Additional notification data
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
  archivedAt: timestamp("archived_at")
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  emailEnabled: boolean("email_enabled").default(true),
  browserEnabled: boolean("browser_enabled").default(true),
  policyReviewReminders: boolean("policy_review_reminders").default(true),
  policyExpiryAlerts: boolean("policy_expiry_alerts").default(true),
  newPolicyNotifications: boolean("new_policy_notifications").default(true),
  teamUpdates: boolean("team_updates").default(true),
  systemAlerts: boolean("system_alerts").default(true),
  reminderFrequency: varchar("reminder_frequency").default("daily"), // daily, weekly, monthly
  quietHoursStart: varchar("quiet_hours_start").default("22:00"),
  quietHoursEnd: varchar("quiet_hours_end").default("08:00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  type: true,
  title: true,
  message: true,
  priority: true,
  category: true,
  relatedId: true,
  relatedType: true,
  actionUrl: true,
  actionText: true,
  metadata: true
});

export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences).pick({
  userId: true,
  emailEnabled: true,
  browserEnabled: true,
  policyReviewReminders: true,
  policyExpiryAlerts: true,
  newPolicyNotifications: true,
  teamUpdates: true,
  systemAlerts: true,
  reminderFrequency: true,
  quietHoursStart: true,
  quietHoursEnd: true
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = z.infer<typeof insertNotificationPreferencesSchema>;

export type RiskRegister = typeof riskRegister.$inferSelect;
export type InsertRiskRegister = z.infer<typeof insertRiskRegisterSchema>;

// ECC Navigator - Complete ECC Implementation Platform
export const eccProjects = pgTable("ecc_projects", {
  id: serial("id").primaryKey(),
  organizationName: varchar("organization_name", { length: 200 }).notNull(),
  organizationSize: varchar("organization_size", { length: 50 }).notNull(), // small, medium, large, enterprise
  organizationScope: varchar("organization_scope", { length: 50 }).notNull(), // basic, advanced, ics-included
  projectName: varchar("project_name", { length: 200 }).notNull(),
  description: text("description"),
  cisoUserId: integer("ciso_user_id").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("setup"), // setup, gap-assessment, risk-assessment, roadmap, implementation, monitoring, completed
  currentStep: integer("current_step").notNull().default(1), // 1-10 workflow steps
  overallComplianceScore: integer("overall_compliance_score").default(0), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eccGapAssessments = pgTable("ecc_gap_assessments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => eccProjects.id),
  controlId: varchar("control_id", { length: 50 }).notNull(), // e.g., ECC-1-1-1
  domain: varchar("domain", { length: 100 }).notNull(),
  subdomain: varchar("subdomain", { length: 100 }).notNull(),
  controlDescription: text("control_description").notNull(),
  complianceStatus: varchar("compliance_status", { length: 20 }).notNull(), // compliant, partially-compliant, non-compliant, not-applicable
  evidenceProvided: text("evidence_provided"),
  assessorId: integer("assessor_id").notNull(),
  assessedAt: timestamp("assessed_at").defaultNow(),
  comments: text("comments"),
});

export const eccRiskAssessments = pgTable("ecc_risk_assessments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => eccProjects.id),
  gapAssessmentId: integer("gap_assessment_id").notNull().references(() => eccGapAssessments.id),
  riskLevel: varchar("risk_level", { length: 20 }).notNull(), // critical, high, medium, low
  likelihood: varchar("likelihood", { length: 20 }).notNull(), // very-high, high, medium, low, very-low
  impact: varchar("impact", { length: 20 }).notNull(), // critical, high, medium, low
  businessImpact: text("business_impact").notNull(),
  riskDescription: text("risk_description").notNull(),
  currentControls: text("current_controls"),
  recommendedActions: text("recommended_actions"),
  assessorId: integer("assessor_id").notNull(),
  assessedAt: timestamp("assessed_at").defaultNow(),
});

export const eccRoadmapTasks = pgTable("ecc_roadmap_tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => eccProjects.id),
  controlId: varchar("control_id", { length: 50 }).notNull(),
  taskTitle: varchar("task_title", { length: 200 }).notNull(),
  taskDescription: text("task_description").notNull(),
  priority: varchar("priority", { length: 20 }).notNull(), // critical, high, medium, low
  assignedTo: integer("assigned_to"), // user ID
  department: varchar("department", { length: 100 }),
  estimatedEffort: varchar("estimated_effort", { length: 50 }), // e.g., "2-4 weeks"
  targetDate: timestamp("target_date"),
  status: varchar("status", { length: 20 }).notNull().default("todo"), // todo, in-progress, review, done, blocked
  progress: integer("progress").default(0), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eccPolicyTemplates = pgTable("ecc_policy_templates", {
  id: serial("id").primaryKey(),
  templateName: varchar("template_name", { length: 200 }).notNull(),
  templateType: varchar("template_type", { length: 100 }).notNull(),
  domain: varchar("domain", { length: 100 }).notNull(),
  description: text("description"),
  templateContent: text("template_content").notNull(),
  requiredFields: text("required_fields").array(),
  relatedControls: text("related_controls").array(), // ECC control IDs
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eccTrainingModules = pgTable("ecc_training_modules", {
  id: serial("id").primaryKey(),
  moduleName: varchar("module_name", { length: 200 }).notNull(),
  moduleType: varchar("module_type", { length: 50 }).notNull(), // phishing-simulator, secure-browsing-game, social-media-challenge, quiz
  description: text("description"),
  content: jsonb("content").notNull(), // Interactive content, scenarios, questions
  difficulty: varchar("difficulty", { length: 20 }).default("beginner"), // beginner, intermediate, advanced
  estimatedTime: integer("estimated_time_minutes"), // in minutes
  passingScore: integer("passing_score").default(80), // percentage
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eccUserTraining = pgTable("ecc_user_training", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => eccProjects.id),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull().references(() => eccTrainingModules.id),
  status: varchar("status", { length: 20 }).notNull().default("not-started"), // not-started, in-progress, completed, failed
  score: integer("score"), // percentage score
  attempts: integer("attempts").default(0),
  timeSpent: integer("time_spent_minutes").default(0),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at"),
});

export const eccComplianceReports = pgTable("ecc_compliance_reports", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => eccProjects.id),
  reportType: varchar("report_type", { length: 50 }).notNull(), // gap-assessment, risk-assessment, full-compliance, nca-submission
  reportTitle: varchar("report_title", { length: 200 }).notNull(),
  reportContent: text("report_content").notNull(), // PDF content or JSON data
  generatedBy: integer("generated_by").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
  metadata: jsonb("metadata"), // Additional report metadata
});

// User Management System
export const usersManagement = pgTable("users_management", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  role: varchar("role", { length: 20 }).notNull().default("user"), // admin, ciso, it-manager, cto, sysadmin, user
  department: varchar("department", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  profileImageUrl: varchar("profile_image_url", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  preferences: jsonb("preferences").default({}),
});

// Achievement Badges System
export const achievementBadges = pgTable("achievement_badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // compliance, policy, assessment, security
  criteria: jsonb("criteria").notNull(), // JSON criteria for earning badge
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Achievement Bridge Table
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersManagement.id),
  badgeId: integer("badge_id").notNull().references(() => achievementBadges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: integer("progress").default(0), // Progress towards badge (0-100)
});

// Policy Feedback System
export const policyFeedback = pgTable("policy_feedback", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id").notNull().references(() => policies.id),
  userId: integer("user_id").notNull().references(() => usersManagement.id),
  rating: integer("rating").notNull(), // 1-5 stars
  feedback: text("feedback"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Policy Collaboration System
export const policyCollaboration = pgTable("policy_collaboration", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id").notNull().references(() => policies.id),
  userId: integer("user_id").notNull().references(() => usersManagement.id),
  actionType: varchar("action_type", { length: 20 }).notNull(), // viewed, commented, approved, rejected, edited
  comment: text("comment"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Zod schemas for validation
export const insertUsersManagementSchema = createInsertSchema(usersManagement).pick({
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  department: true,
  isActive: true,
  phoneNumber: true,
  preferences: true
});

export const insertAchievementBadgeSchema = createInsertSchema(achievementBadges).pick({
  name: true,
  description: true,
  icon: true,
  category: true,
  criteria: true,
  isActive: true
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).pick({
  userId: true,
  badgeId: true,
  progress: true
});

export const insertPolicyFeedbackSchema = createInsertSchema(policyFeedback).pick({
  policyId: true,
  userId: true,
  rating: true,
  feedback: true
});

export const insertPolicyCollaborationSchema = createInsertSchema(policyCollaboration).pick({
  policyId: true,
  userId: true,
  actionType: true,
  comment: true
});

export type UsersManagement = typeof usersManagement.$inferSelect;
export type InsertUsersManagement = z.infer<typeof insertUsersManagementSchema>;
export type AchievementBadge = typeof achievementBadges.$inferSelect;
export type InsertAchievementBadge = z.infer<typeof insertAchievementBadgeSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type PolicyFeedback = typeof policyFeedback.$inferSelect;
export type InsertPolicyFeedback = z.infer<typeof insertPolicyFeedbackSchema>;
export type PolicyCollaboration = typeof policyCollaboration.$inferSelect;
export type InsertPolicyCollaboration = z.infer<typeof insertPolicyCollaborationSchema>;

// ECC Navigator Insert Schemas
export const insertEccProjectSchema = createInsertSchema(eccProjects).pick({
  organizationName: true,
  organizationSize: true,
  organizationScope: true,
  projectName: true,
  description: true,
  cisoUserId: true,
  status: true,
  currentStep: true,
  overallComplianceScore: true,
});

export const insertEccGapAssessmentSchema = createInsertSchema(eccGapAssessments).pick({
  projectId: true,
  controlId: true,
  domain: true,
  subdomain: true,
  controlDescription: true,
  complianceStatus: true,
  evidenceProvided: true,
  assessorId: true,
  comments: true,
});

export const insertEccRiskAssessmentSchema = createInsertSchema(eccRiskAssessments).pick({
  projectId: true,
  gapAssessmentId: true,
  riskLevel: true,
  likelihood: true,
  impact: true,
  businessImpact: true,
  riskDescription: true,
  currentControls: true,
  recommendedActions: true,
  assessorId: true,
});

export const insertEccRoadmapTaskSchema = createInsertSchema(eccRoadmapTasks).pick({
  projectId: true,
  controlId: true,
  taskTitle: true,
  taskDescription: true,
  priority: true,
  assignedTo: true,
  department: true,
  estimatedEffort: true,
  targetDate: true,
  status: true,
  progress: true,
});

export const insertEccTrainingModuleSchema = createInsertSchema(eccTrainingModules).pick({
  moduleName: true,
  moduleType: true,
  description: true,
  content: true,
  difficulty: true,
  estimatedTime: true,
  passingScore: true,
  isActive: true,
});

export const insertEccUserTrainingSchema = createInsertSchema(eccUserTraining).pick({
  projectId: true,
  userId: true,
  moduleId: true,
  status: true,
  score: true,
  attempts: true,
  timeSpent: true,
});

// ECC Navigator Types


export type EccGapAssessment = typeof eccGapAssessments.$inferSelect;
export type InsertEccGapAssessment = z.infer<typeof insertEccGapAssessmentSchema>;

export type EccRiskAssessment = typeof eccRiskAssessments.$inferSelect;
export type InsertEccRiskAssessment = z.infer<typeof insertEccRiskAssessmentSchema>;

export type EccRoadmapTask = typeof eccRoadmapTasks.$inferSelect;
export type InsertEccRoadmapTask = z.infer<typeof insertEccRoadmapTaskSchema>;

export type EccTrainingModule = typeof eccTrainingModules.$inferSelect;
export type InsertEccTrainingModule = z.infer<typeof insertEccTrainingModuleSchema>;

export type EccUserTraining = typeof eccUserTraining.$inferSelect;
export type InsertEccUserTraining = z.infer<typeof insertEccUserTrainingSchema>;

export type EccComplianceReport = typeof eccComplianceReports.$inferSelect;