import { users, assessments, policies, type User, type InsertUser, type Assessment, type InsertAssessment, type Policy, type InsertPolicy } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAssessments(userId: number): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getPolicies(userId: number): Promise<Policy[]>;
  createPolicy(policy: InsertPolicy): Promise<Policy>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, Assessment>;
  private policies: Map<number, Policy>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.policies = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAssessments(userId: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(
      (assessment) => assessment.userId === userId,
    );
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentId++;
    const assessment: Assessment = { ...insertAssessment, id };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getPolicies(userId: number): Promise<Policy[]> {
    return Array.from(this.policies.values()).filter(
      (policy) => policy.userId === userId,
    );
  }

  async createPolicy(insertPolicy: InsertPolicy): Promise<Policy> {
    const id = this.currentId++;
    const policy: Policy = { ...insertPolicy, id };
    this.policies.set(id, policy);
    return policy;
  }
}

export const storage = new MemStorage();
