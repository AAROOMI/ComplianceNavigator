import { 
  users, assessments, policies, vulnerabilities, riskManagementPlans,
  type User, type InsertUser, 
  type Assessment, type InsertAssessment, 
  type Policy, type InsertPolicy, 
  type Vulnerability, type InsertVulnerability,
  type RiskManagementPlan, type InsertRiskManagementPlan
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
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new InMemoryStorage();