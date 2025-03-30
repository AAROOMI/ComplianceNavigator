import { users, assessments, policies, vulnerabilities, type User, type InsertUser, type Assessment, type InsertAssessment, type Policy, type InsertPolicy, type Vulnerability, type InsertVulnerability } from "@shared/schema";
import { db } from "./db";
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAssessments(userId: number): Promise<Assessment[]> {
    return db.select().from(assessments).where(eq(assessments.userId, userId));
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [created] = await db.insert(assessments).values(assessment).returning();
    return created;
  }

  async getPolicies(userId: number): Promise<Policy[]> {
    return db.select().from(policies).where(eq(policies.userId, userId));
  }

  async createPolicy(policy: InsertPolicy): Promise<Policy> {
    const [created] = await db.insert(policies).values(policy).returning();
    return created;
  }

  async getVulnerabilities(userId: number, assessmentId?: number): Promise<Vulnerability[]> {
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
    const [created] = await db.insert(vulnerabilities).values(vulnerability).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();