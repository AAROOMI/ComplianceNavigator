import { 
  users, assessments, policies, vulnerabilities, riskManagementPlans, riskRegister,
  usersManagement, userSessions, achievementBadges, userAchievements, policyFeedback, policyCollaboration,
  type User, type InsertUser, 
  type Assessment, type InsertAssessment, 
  type Policy, type InsertPolicy, 
  type Vulnerability, type InsertVulnerability,
  type RiskManagementPlan, type InsertRiskManagementPlan,
  type RiskRegister, type InsertRiskRegister,
  type UsersManagement, type InsertUsersManagement,
  type UserSession, type InsertUserSession,
  type AchievementBadge, type InsertAchievementBadge,
  type UserAchievement, type InsertUserAchievement,
  type PolicyFeedback, type InsertPolicyFeedback,
  type PolicyCollaboration, type InsertPolicyCollaboration
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAssessments(userId: number): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getPolicies(userId: number): Promise<Policy[]>;
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  getVulnerabilities(userId: number, assessmentId?: number): Promise<Vulnerability[]>;
  getVulnerabilityByDomain(userId: number, domain: string): Promise<Vulnerability[]>;
  createVulnerability(vulnerability: InsertVulnerability): Promise<Vulnerability>;
  getRiskManagementPlans(userId: number, vulnerabilityId?: number): Promise<RiskManagementPlan[]>;
  getRiskManagementPlanById(id: number): Promise<RiskManagementPlan | undefined>;
  createRiskManagementPlan(plan: InsertRiskManagementPlan): Promise<RiskManagementPlan>;
  updateRiskManagementPlan(id: number, plan: Partial<InsertRiskManagementPlan>): Promise<RiskManagementPlan | undefined>;
  deleteRiskManagementPlan(id: number): Promise<boolean>;
  // Risk Register methods
  getRiskRegister(category?: string, riskLevel?: string): Promise<RiskRegister[]>;
  getRiskRegisterById(id: number): Promise<RiskRegister | undefined>;
  createRiskRegisterEntry(entry: InsertRiskRegister): Promise<RiskRegister>;
  updateRiskRegisterEntry(id: number, entry: Partial<InsertRiskRegister>): Promise<RiskRegister | undefined>;
  deleteRiskRegisterEntry(id: number): Promise<boolean>;
  
  // User Management
  getUsersManagement(): Promise<UsersManagement[]>;
  getUserManagement(id: number): Promise<UsersManagement | undefined>;
  getUserManagementByUsername(username: string): Promise<UsersManagement | undefined>;
  getUserManagementByEmail(email: string): Promise<UsersManagement | undefined>;
  createUserManagement(insertUser: InsertUsersManagement): Promise<UsersManagement>;
  updateUserManagement(id: number, updateData: Partial<InsertUsersManagement>): Promise<UsersManagement>;
  deleteUserManagement(id: number): Promise<void>;
  
  // Authentication
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSession(token: string): Promise<UserSession | undefined>;
  deleteUserSession(token: string): Promise<void>;
  deleteUserSessions(userId: number): Promise<void>;
  
  // Achievement Badges
  getAchievementBadges(): Promise<AchievementBadge[]>;
  createAchievementBadge(badge: InsertAchievementBadge): Promise<AchievementBadge>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  awardBadge(userId: number, badgeId: number): Promise<UserAchievement>;
  
  // Policy Feedback & Collaboration
  getPolicyFeedback(policyId: number): Promise<PolicyFeedback[]>;
  createPolicyFeedback(feedback: InsertPolicyFeedback): Promise<PolicyFeedback>;
  getPolicyCollaboration(policyId: number): Promise<PolicyCollaboration[]>;
  createPolicyCollaboration(collaboration: InsertPolicyCollaboration): Promise<PolicyCollaboration>;
}

class DatabaseStorage implements IStorage {
  private dbPromise: Promise<any>;

  constructor() {
    // Lazy-load the db module to avoid importing when DATABASE_URL is not set
    this.dbPromise = import("./db").then((m) => m.db);
  }

  private async getDb() {
    return this.dbPromise;
  }

  async getUser(id: number): Promise<User | undefined> {
    const db = await this.getDb();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await this.getDb();
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await this.getDb();
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAssessments(userId: number): Promise<Assessment[]> {
    const db = await this.getDb();
    return db.select().from(assessments).where(eq(assessments.userId, userId));
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const db = await this.getDb();
    const [created] = await db.insert(assessments).values(assessment).returning();
    return created;
  }

  async getPolicies(userId: number): Promise<Policy[]> {
    const db = await this.getDb();
    return db.select().from(policies).where(eq(policies.userId, userId));
  }

  async createPolicy(policy: InsertPolicy): Promise<Policy> {
    const db = await this.getDb();
    const [created] = await db.insert(policies).values(policy).returning();
    return created;
  }

  async getVulnerabilities(userId: number, assessmentId?: number): Promise<Vulnerability[]> {
    const db = await this.getDb();
    if (assessmentId) {
      return db.select()
        .from(vulnerabilities)
        .where(
          and(
            eq(vulnerabilities.userId, userId),
            eq(vulnerabilities.assessmentId, assessmentId)
          )
        );
    }
    return db.select()
      .from(vulnerabilities)
      .where(eq(vulnerabilities.userId, userId));
  }

  async getVulnerabilityByDomain(userId: number, domain: string): Promise<Vulnerability[]> {
    const db = await this.getDb();
    return db.select()
      .from(vulnerabilities)
      .where(
        and(
          eq(vulnerabilities.userId, userId),
          eq(vulnerabilities.domain, domain)
        )
      );
  }

  async createVulnerability(vulnerability: InsertVulnerability): Promise<Vulnerability> {
    const db = await this.getDb();
    const [created] = await db.insert(vulnerabilities).values(vulnerability).returning();
    return created;
  }

  async getRiskManagementPlans(userId: number, vulnerabilityId?: number): Promise<RiskManagementPlan[]> {
    const db = await this.getDb();
    if (vulnerabilityId) {
      return db.select()
        .from(riskManagementPlans)
        .where(
          and(
            eq(riskManagementPlans.userId, userId),
            eq(riskManagementPlans.vulnerabilityId, vulnerabilityId)
          )
        );
    }
    return db.select()
      .from(riskManagementPlans)
      .where(eq(riskManagementPlans.userId, userId));
  }

  async getRiskManagementPlanById(id: number): Promise<RiskManagementPlan | undefined> {
    const db = await this.getDb();
    const [plan] = await db.select()
      .from(riskManagementPlans)
      .where(eq(riskManagementPlans.id, id));
    return plan;
  }

  async createRiskManagementPlan(plan: InsertRiskManagementPlan): Promise<RiskManagementPlan> {
    const db = await this.getDb();
    const [created] = await db.insert(riskManagementPlans).values(plan).returning();
    return created;
  }

  async updateRiskManagementPlan(id: number, plan: Partial<InsertRiskManagementPlan>): Promise<RiskManagementPlan | undefined> {
    const db = await this.getDb();
    const [updated] = await db.update(riskManagementPlans)
      .set(plan)
      .where(eq(riskManagementPlans.id, id))
      .returning();
    return updated;
  }

  async deleteRiskManagementPlan(id: number): Promise<boolean> {
    const db = await this.getDb();
    await db.delete(riskManagementPlans)
      .where(eq(riskManagementPlans.id, id));
    return true;
  }

  // Risk Register methods
  async getRiskRegister(category?: string, riskLevel?: string): Promise<RiskRegister[]> {
    const db = await this.getDb();
    let query = db.select().from(riskRegister).where(eq(riskRegister.isActive, true));
    
    if (category) {
      query = query.where(and(eq(riskRegister.isActive, true), eq(riskRegister.category, category)));
    }
    if (riskLevel) {
      const conditions = [eq(riskRegister.isActive, true)];
      if (category) conditions.push(eq(riskRegister.category, category));
      conditions.push(eq(riskRegister.riskLevel, riskLevel));
      query = db.select().from(riskRegister).where(and(...conditions));
    }
    
    return query;
  }

  async getRiskRegisterById(id: number): Promise<RiskRegister | undefined> {
    const db = await this.getDb();
    const [entry] = await db.select()
      .from(riskRegister)
      .where(eq(riskRegister.id, id));
    return entry;
  }

  async createRiskRegisterEntry(entry: InsertRiskRegister): Promise<RiskRegister> {
    const db = await this.getDb();
    const [created] = await db.insert(riskRegister).values(entry).returning();
    return created;
  }

  async updateRiskRegisterEntry(id: number, entry: Partial<InsertRiskRegister>): Promise<RiskRegister | undefined> {
    const db = await this.getDb();
    const [updated] = await db.update(riskRegister)
      .set({ ...entry, updatedAt: new Date() })
      .where(eq(riskRegister.id, id))
      .returning();
    return updated;
  }

  async deleteRiskRegisterEntry(id: number): Promise<boolean> {
    const db = await this.getDb();
    await db.delete(riskRegister)
      .where(eq(riskRegister.id, id));
    return true;
  }

  // User Management - Database implementation
  async getUsersManagement(): Promise<UsersManagement[]> {
    const db = await this.getDb();
    return await db.select().from(usersManagement);
  }

  async getUserManagement(id: number): Promise<UsersManagement | undefined> {
    const db = await this.getDb();
    const [user] = await db.select().from(usersManagement).where(eq(usersManagement.id, id));
    return user;
  }

  async createUserManagement(insertUser: InsertUsersManagement): Promise<UsersManagement> {
    const db = await this.getDb();
    const [user] = await db.insert(usersManagement).values(insertUser).returning();
    return user;
  }

  async updateUserManagement(id: number, updateData: Partial<InsertUsersManagement>): Promise<UsersManagement> {
    const db = await this.getDb();
    const [user] = await db.update(usersManagement)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(usersManagement.id, id))
      .returning();
    return user;
  }

  async deleteUserManagement(id: number): Promise<void> {
    const db = await this.getDb();
    await db.delete(usersManagement).where(eq(usersManagement.id, id));
  }

  // Achievement Badges - Database implementation
  async getAchievementBadges(): Promise<AchievementBadge[]> {
    const db = await this.getDb();
    return await db.select().from(achievementBadges).where(eq(achievementBadges.isActive, true));
  }

  async createAchievementBadge(badge: InsertAchievementBadge): Promise<AchievementBadge> {
    const db = await this.getDb();
    const [created] = await db.insert(achievementBadges).values(badge).returning();
    return created;
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    const db = await this.getDb();
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  async awardBadge(userId: number, badgeId: number): Promise<UserAchievement> {
    const db = await this.getDb();
    const [achievement] = await db.insert(userAchievements)
      .values({ userId, badgeId, progress: 100 })
      .returning();
    return achievement;
  }

  // Policy Feedback & Collaboration - Database implementation
  async getPolicyFeedback(policyId: number): Promise<PolicyFeedback[]> {
    const db = await this.getDb();
    return await db.select().from(policyFeedback).where(eq(policyFeedback.policyId, policyId));
  }

  async createPolicyFeedback(feedback: InsertPolicyFeedback): Promise<PolicyFeedback> {
    const db = await this.getDb();
    const [created] = await db.insert(policyFeedback).values(feedback).returning();
    return created;
  }

  async getPolicyCollaboration(policyId: number): Promise<PolicyCollaboration[]> {
    const db = await this.getDb();
    return await db.select().from(policyCollaboration).where(eq(policyCollaboration.policyId, policyId));
  }

  async createPolicyCollaboration(collaboration: InsertPolicyCollaboration): Promise<PolicyCollaboration> {
    const db = await this.getDb();
    const [created] = await db.insert(policyCollaboration).values(collaboration).returning();
    return created;
  }

  // User Management Authentication - Database implementation
  async getUserManagementByUsername(username: string): Promise<UsersManagement | undefined> {
    const db = await this.getDb();
    const [user] = await db.select().from(usersManagement).where(eq(usersManagement.username, username));
    return user;
  }

  async getUserManagementByEmail(email: string): Promise<UsersManagement | undefined> {
    const db = await this.getDb();
    const [user] = await db.select().from(usersManagement).where(eq(usersManagement.email, email));
    return user;
  }

  // Authentication Sessions - Database implementation
  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const db = await this.getDb();
    const [created] = await db.insert(userSessions).values(session).returning();
    return created;
  }

  async getUserSession(token: string): Promise<UserSession | undefined> {
    const db = await this.getDb();
    const [session] = await db.select().from(userSessions).where(eq(userSessions.token, token));
    return session;
  }

  async deleteUserSession(token: string): Promise<void> {
    const db = await this.getDb();
    await db.delete(userSessions).where(eq(userSessions.token, token));
  }

  async deleteUserSessions(userId: number): Promise<void> {
    const db = await this.getDb();
    await db.delete(userSessions).where(eq(userSessions.userId, userId));
  }
}

class InMemoryStorage implements IStorage {
  private users: User[] = [];
  private assessments: Assessment[] = [];
  private policies: Policy[] = [];
  private vulnerabilities: Vulnerability[] = [];
  private riskManagementPlans: RiskManagementPlan[] = [];

  private userIdSeq = 1;
  private assessmentIdSeq = 1;
  private policyIdSeq = 1;
  private vulnerabilityIdSeq = 1;
  private riskPlanIdSeq = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { id: this.userIdSeq++, ...insertUser } as User;
    this.users.push(user);
    return user;
  }

  async getAssessments(userId: number): Promise<Assessment[]> {
    return this.assessments.filter(a => a.userId === userId);
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const created: Assessment = { id: this.assessmentIdSeq++, ...assessment } as Assessment;
    this.assessments.push(created);
    return created;
  }

  async getPolicies(userId: number): Promise<Policy[]> {
    return this.policies.filter(p => p.userId === userId);
  }

  async createPolicy(policy: InsertPolicy): Promise<Policy> {
    const created: Policy = { id: this.policyIdSeq++, ...policy } as Policy;
    this.policies.push(created);
    return created;
  }

  async getVulnerabilities(userId: number, assessmentId?: number): Promise<Vulnerability[]> {
    return this.vulnerabilities.filter(v => v.userId === userId && (assessmentId ? v.assessmentId === assessmentId : true));
  }

  async getVulnerabilityByDomain(userId: number, domain: string): Promise<Vulnerability[]> {
    return this.vulnerabilities.filter(v => v.userId === userId && v.domain === domain);
  }

  async createVulnerability(vulnerability: InsertVulnerability): Promise<Vulnerability> {
    const created: Vulnerability = { id: this.vulnerabilityIdSeq++, ...vulnerability } as Vulnerability;
    this.vulnerabilities.push(created);
    return created;
  }

  async getRiskManagementPlans(userId: number, vulnerabilityId?: number): Promise<RiskManagementPlan[]> {
    return this.riskManagementPlans.filter(r => r.userId === userId && (vulnerabilityId ? r.vulnerabilityId === vulnerabilityId : true));
  }

  async getRiskManagementPlanById(id: number): Promise<RiskManagementPlan | undefined> {
    return this.riskManagementPlans.find(r => r.id === id);
  }

  async createRiskManagementPlan(plan: InsertRiskManagementPlan): Promise<RiskManagementPlan> {
    const created: RiskManagementPlan = { id: this.riskPlanIdSeq++, ...plan } as RiskManagementPlan;
    this.riskManagementPlans.push(created);
    return created;
  }

  async updateRiskManagementPlan(id: number, plan: Partial<InsertRiskManagementPlan>): Promise<RiskManagementPlan | undefined> {
    const index = this.riskManagementPlans.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    const updated = { ...this.riskManagementPlans[index], ...plan } as RiskManagementPlan;
    this.riskManagementPlans[index] = updated;
    return updated;
  }

  async deleteRiskManagementPlan(id: number): Promise<boolean> {
    const before = this.riskManagementPlans.length;
    this.riskManagementPlans = this.riskManagementPlans.filter(r => r.id !== id);
    return this.riskManagementPlans.length < before;
  }

  // Risk Register methods
  private riskRegisterEntries: RiskRegister[] = [];
  private riskRegisterIdSeq = 1;

  async getRiskRegister(category?: string, riskLevel?: string): Promise<RiskRegister[]> {
    let filtered = this.riskRegisterEntries.filter(r => r.isActive);
    
    if (category) {
      filtered = filtered.filter(r => r.category === category);
    }
    if (riskLevel) {
      filtered = filtered.filter(r => r.riskLevel === riskLevel);
    }
    
    return filtered;
  }

  async getRiskRegisterById(id: number): Promise<RiskRegister | undefined> {
    return this.riskRegisterEntries.find(r => r.id === id);
  }

  async createRiskRegisterEntry(entry: InsertRiskRegister): Promise<RiskRegister> {
    const created: RiskRegister = { 
      id: this.riskRegisterIdSeq++, 
      ...entry,
      createdAt: new Date(),
      updatedAt: new Date()
    } as RiskRegister;
    this.riskRegisterEntries.push(created);
    return created;
  }

  async updateRiskRegisterEntry(id: number, entry: Partial<InsertRiskRegister>): Promise<RiskRegister | undefined> {
    const index = this.riskRegisterEntries.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    const updated = { 
      ...this.riskRegisterEntries[index], 
      ...entry,
      updatedAt: new Date()
    } as RiskRegister;
    this.riskRegisterEntries[index] = updated;
    return updated;
  }

  async deleteRiskRegisterEntry(id: number): Promise<boolean> {
    const before = this.riskRegisterEntries.length;
    this.riskRegisterEntries = this.riskRegisterEntries.filter(r => r.id !== id);
    return this.riskRegisterEntries.length < before;
  }

  // User Management - InMemory implementation with sample data
  private usersManagementList: UsersManagement[] = [
    {
      id: 1,
      username: "sarah.chen",
      email: "sarah.chen@metaworks.com",
      firstName: "Sarah",
      lastName: "Chen",
      role: "ciso",
      department: "Security",
      isActive: true,
      phoneNumber: "+1-555-0123",
      preferences: { theme: "dark", notifications: true },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      lastLogin: new Date('2025-01-24T10:30:00')
    },
    {
      id: 2,
      username: "mike.thompson",
      email: "mike.thompson@metaworks.com",
      firstName: "Mike",
      lastName: "Thompson",
      role: "it_manager",
      department: "IT Operations",
      isActive: true,
      phoneNumber: "+1-555-0124",
      preferences: { theme: "light", notifications: false },
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      lastLogin: new Date('2025-01-24T09:15:00')
    },
    {
      id: 3,
      username: "alexandra.rodriguez",
      email: "alexandra.rodriguez@metaworks.com",
      firstName: "Alexandra",
      lastName: "Rodriguez",
      role: "cto",
      department: "Engineering",
      isActive: true,
      phoneNumber: "+1-555-0125",
      preferences: { theme: "dark", notifications: true },
      createdAt: new Date('2023-11-10'),
      updatedAt: new Date('2023-11-10'),
      lastLogin: new Date('2025-01-24T11:45:00')
    },
    {
      id: 4,
      username: "david.kim",
      email: "david.kim@metaworks.com",
      firstName: "David",
      lastName: "Kim",
      role: "system_admin",
      department: "Infrastructure",
      isActive: true,
      phoneNumber: "+1-555-0126",
      preferences: { theme: "light", notifications: true },
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-05'),
      lastLogin: new Date('2025-01-24T08:20:00')
    },
    {
      id: 5,
      username: "emma.watson",
      email: "emma.watson@metaworks.com",
      firstName: "Emma",
      lastName: "Watson",
      role: "user",
      department: "Compliance",
      isActive: false,
      phoneNumber: "+1-555-0127",
      preferences: { theme: "dark", notifications: false },
      createdAt: new Date('2024-04-12'),
      updatedAt: new Date('2024-04-12'),
      lastLogin: new Date('2025-01-20T16:30:00')
    }
  ];
  private userMgmtIdSeq = 6;

  async getUsersManagement(): Promise<UsersManagement[]> {
    return this.usersManagementList;
  }

  async getUserManagement(id: number): Promise<UsersManagement | undefined> {
    return this.usersManagementList.find(u => u.id === id);
  }

  async createUserManagement(insertUser: InsertUsersManagement): Promise<UsersManagement> {
    const created: UsersManagement = {
      id: this.userMgmtIdSeq++,
      ...insertUser,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    } as UsersManagement;
    this.usersManagementList.push(created);
    return created;
  }

  async updateUserManagement(id: number, updateData: Partial<InsertUsersManagement>): Promise<UsersManagement> {
    const index = this.usersManagementList.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    
    const updated = {
      ...this.usersManagementList[index],
      ...updateData,
      updatedAt: new Date()
    };
    this.usersManagementList[index] = updated;
    return updated;
  }

  async deleteUserManagement(id: number): Promise<void> {
    this.usersManagementList = this.usersManagementList.filter(u => u.id !== id);
  }

  // Achievement Badges - InMemory implementation
  private achievementBadgesList: AchievementBadge[] = [];
  private userAchievementsList: UserAchievement[] = [];
  private badgeIdSeq = 1;
  private userAchievementIdSeq = 1;

  async getAchievementBadges(): Promise<AchievementBadge[]> {
    return this.achievementBadgesList.filter(b => b.isActive);
  }

  async createAchievementBadge(badge: InsertAchievementBadge): Promise<AchievementBadge> {
    const created: AchievementBadge = {
      id: this.badgeIdSeq++,
      ...badge,
      createdAt: new Date()
    } as AchievementBadge;
    this.achievementBadgesList.push(created);
    return created;
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return this.userAchievementsList.filter(ua => ua.userId === userId);
  }

  async awardBadge(userId: number, badgeId: number): Promise<UserAchievement> {
    const created: UserAchievement = {
      id: this.userAchievementIdSeq++,
      userId,
      badgeId,
      progress: 100,
      earnedAt: new Date()
    } as UserAchievement;
    this.userAchievementsList.push(created);
    return created;
  }

  // Policy Feedback & Collaboration - InMemory implementation  
  private policyFeedbackList: PolicyFeedback[] = [];
  private policyCollaborationList: PolicyCollaboration[] = [];
  private feedbackIdSeq = 1;
  private collaborationIdSeq = 1;

  async getPolicyFeedback(policyId: number): Promise<PolicyFeedback[]> {
    return this.policyFeedbackList.filter(f => f.policyId === policyId);
  }

  async createPolicyFeedback(feedback: InsertPolicyFeedback): Promise<PolicyFeedback> {
    const created: PolicyFeedback = {
      id: this.feedbackIdSeq++,
      ...feedback,
      createdAt: new Date()
    } as PolicyFeedback;
    this.policyFeedbackList.push(created);
    return created;
  }

  async getPolicyCollaboration(policyId: number): Promise<PolicyCollaboration[]> {
    return this.policyCollaborationList.filter(c => c.policyId === policyId);
  }

  async createPolicyCollaboration(collaboration: InsertPolicyCollaboration): Promise<PolicyCollaboration> {
    const created: PolicyCollaboration = {
      id: this.collaborationIdSeq++,
      ...collaboration,
      timestamp: new Date()
    } as PolicyCollaboration;
    this.policyCollaborationList.push(created);
    return created;
  }

  // User Management Authentication - InMemory implementation
  async getUserManagementByUsername(username: string): Promise<UsersManagement | undefined> {
    return this.usersManagementList.find(u => u.username === username);
  }

  async getUserManagementByEmail(email: string): Promise<UsersManagement | undefined> {
    return this.usersManagementList.find(u => u.email === email);
  }

  // Authentication Sessions - InMemory implementation  
  private userSessionsList: UserSession[] = [];
  private sessionIdSeq = 1;

  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const created: UserSession = {
      id: this.sessionIdSeq++,
      ...session,
      createdAt: new Date()
    } as UserSession;
    this.userSessionsList.push(created);
    return created;
  }

  async getUserSession(token: string): Promise<UserSession | undefined> {
    return this.userSessionsList.find(s => s.token === token);
  }

  async deleteUserSession(token: string): Promise<void> {
    const index = this.userSessionsList.findIndex(s => s.token === token);
    if (index !== -1) {
      this.userSessionsList.splice(index, 1);
    }
  }

  async deleteUserSessions(userId: number): Promise<void> {
    this.userSessionsList = this.userSessionsList.filter(s => s.userId !== userId);
  }
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new InMemoryStorage();