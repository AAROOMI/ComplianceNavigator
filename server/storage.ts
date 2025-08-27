import { 
  users, assessments, policies, vulnerabilities, riskManagementPlans, riskRegister,
  roles, userSessions, userActivities, userWorkspaces, permissions, usersManagement,
  type User, type InsertUser,
  type Role, type InsertRole,
  type UserSession, type InsertUserSession,
  type UserActivity, type InsertUserActivity,
  type UserWorkspace, type InsertUserWorkspace,
  type Permission, type InsertPermission,
  type Assessment, type InsertAssessment, 
  type Policy, type InsertPolicy, 
  type Vulnerability, type InsertVulnerability,
  type RiskManagementPlan, type InsertRiskManagementPlan,
  type RiskRegister, type InsertRiskRegister,
  type UsersManagement, type InsertUsersManagement
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User authentication
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User management with RBAC
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Role management
  getRoles(): Promise<Role[]>;
  getRole(id: number): Promise<Role | undefined>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: number, role: Partial<InsertRole>): Promise<Role | undefined>;
  deleteRole(id: number): Promise<boolean>;
  
  // Permission management
  getPermissions(): Promise<Permission[]>;
  getPermissionsByCategory(category: string): Promise<Permission[]>;
  createPermission(permission: InsertPermission): Promise<Permission>;
  
  // User sessions
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserSessions(userId: number): Promise<UserSession[]>;
  updateUserSession(id: number, session: Partial<InsertUserSession>): Promise<UserSession | undefined>;
  
  // User activities
  getUserActivities(userId?: number, limit?: number): Promise<UserActivity[]>;
  createUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  
  // User workspaces
  getUserWorkspaces(userId: number): Promise<UserWorkspace[]>;
  getDefaultWorkspace(userId: number): Promise<UserWorkspace | undefined>;
  createUserWorkspace(workspace: InsertUserWorkspace): Promise<UserWorkspace>;
  updateUserWorkspace(id: number, workspace: Partial<InsertUserWorkspace>): Promise<UserWorkspace | undefined>;
  deleteUserWorkspace(id: number): Promise<boolean>;

  // Users Management (for the existing UI)
  getUsersManagement(): Promise<UsersManagement[]>;
  getUserManagement(id: number): Promise<UsersManagement | undefined>;
  createUserManagement(userData: InsertUsersManagement): Promise<UsersManagement>;
  updateUserManagement(id: number, userData: Partial<InsertUsersManagement>): Promise<UsersManagement | undefined>;
  deleteUserManagement(id: number): Promise<boolean>;
  
  // Existing assessment methods
  getAssessments(userId: number): Promise<Assessment[]>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  
  // Existing policy methods
  getPolicies(userId: number): Promise<Policy[]>;
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  
  // Existing vulnerability methods
  getVulnerabilities(userId: number, assessmentId?: number): Promise<Vulnerability[]>;
  getVulnerabilityByDomain(userId: number, domain: string): Promise<Vulnerability[]>;
  createVulnerability(vulnerability: InsertVulnerability): Promise<Vulnerability>;
  
  // Existing risk management methods
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
  async getAllUsers(): Promise<User[]> {
    const db = await this.getDb();
    return await db.select().from(users);
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const db = await this.getDb();
    const [updated] = await db.update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async deleteUser(id: number): Promise<boolean> {
    const db = await this.getDb();
    await db.delete(users).where(eq(users.id, id));
    return true;
  }

  // Role Management
  async getRoles(): Promise<Role[]> {
    const db = await this.getDb();
    return await db.select().from(roles).where(eq(roles.isActive, true));
  }

  async getRole(id: number): Promise<Role | undefined> {
    const db = await this.getDb();
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }

  async createRole(role: InsertRole): Promise<Role> {
    const db = await this.getDb();
    const [created] = await db.insert(roles).values(role).returning();
    return created;
  }

  async updateRole(id: number, role: Partial<InsertRole>): Promise<Role | undefined> {
    const db = await this.getDb();
    const [updated] = await db.update(roles)
      .set({ ...role, updatedAt: new Date() })
      .where(eq(roles.id, id))
      .returning();
    return updated;
  }

  async deleteRole(id: number): Promise<boolean> {
    const db = await this.getDb();
    await db.update(roles)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(roles.id, id));
    return true;
  }

  // Permission Management
  async getPermissions(): Promise<Permission[]> {
    const db = await this.getDb();
    return await db.select().from(permissions);
  }

  async getPermissionsByCategory(category: string): Promise<Permission[]> {
    const db = await this.getDb();
    return await db.select().from(permissions).where(eq(permissions.category, category));
  }

  async createPermission(permission: InsertPermission): Promise<Permission> {
    const db = await this.getDb();
    const [created] = await db.insert(permissions).values(permission).returning();
    return created;
  }

  // User Sessions
  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const db = await this.getDb();
    const [created] = await db.insert(userSessions).values(session).returning();
    return created;
  }

  async getUserSessions(userId: number): Promise<UserSession[]> {
    const db = await this.getDb();
    return await db.select().from(userSessions).where(eq(userSessions.userId, userId));
  }

  async updateUserSession(id: number, session: Partial<InsertUserSession>): Promise<UserSession | undefined> {
    const db = await this.getDb();
    const [updated] = await db.update(userSessions)
      .set(session)
      .where(eq(userSessions.id, id))
      .returning();
    return updated;
  }

  // User Activities
  async getUserActivities(userId?: number, limit?: number): Promise<UserActivity[]> {
    const db = await this.getDb();
    let query = db.select().from(userActivities);
    
    if (userId) {
      query = query.where(eq(userActivities.userId, userId));
    }
    
    return await query.limit(limit || 100);
  }

  async createUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const db = await this.getDb();
    const [created] = await db.insert(userActivities).values(activity).returning();
    return created;
  }

  // User Workspaces
  async getUserWorkspaces(userId: number): Promise<UserWorkspace[]> {
    const db = await this.getDb();
    return await db.select().from(userWorkspaces).where(eq(userWorkspaces.userId, userId));
  }

  async getDefaultWorkspace(userId: number): Promise<UserWorkspace | undefined> {
    const db = await this.getDb();
    const [workspace] = await db.select()
      .from(userWorkspaces)
      .where(and(eq(userWorkspaces.userId, userId), eq(userWorkspaces.isDefault, true)));
    return workspace;
  }

  async createUserWorkspace(workspace: InsertUserWorkspace): Promise<UserWorkspace> {
    const db = await this.getDb();
    const [created] = await db.insert(userWorkspaces).values(workspace).returning();
    return created;
  }

  async updateUserWorkspace(id: number, workspace: Partial<InsertUserWorkspace>): Promise<UserWorkspace | undefined> {
    const db = await this.getDb();
    const [updated] = await db.update(userWorkspaces)
      .set({ ...workspace, updatedAt: new Date() })
      .where(eq(userWorkspaces.id, id))
      .returning();
    return updated;
  }

  async deleteUserWorkspace(id: number): Promise<boolean> {
    const db = await this.getDb();
    await db.delete(userWorkspaces).where(eq(userWorkspaces.id, id));
    return true;
  }

  // Users Management methods (for the existing UI) - Database implementation
  async getUsersManagement(): Promise<UsersManagement[]> {
    const db = await this.getDb();
    return await db.select().from(usersManagement);
  }

  async getUserManagement(id: number): Promise<UsersManagement | undefined> {
    const db = await this.getDb();
    const [user] = await db.select().from(usersManagement).where(eq(usersManagement.id, id));
    return user;
  }

  async createUserManagement(userData: InsertUsersManagement): Promise<UsersManagement> {
    const db = await this.getDb();
    const [created] = await db.insert(usersManagement).values(userData).returning();
    return created;
  }

  async updateUserManagement(id: number, userData: Partial<InsertUsersManagement>): Promise<UsersManagement | undefined> {
    const db = await this.getDb();
    const [updated] = await db.update(usersManagement)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(usersManagement.id, id))
      .returning();
    return updated;
  }

  async deleteUserManagement(id: number): Promise<boolean> {
    const db = await this.getDb();
    await db.delete(usersManagement).where(eq(usersManagement.id, id));
    return true;
  }

}

class InMemoryStorage implements IStorage {
  private users: User[] = [];
  private roles: Role[] = [];
  private permissions: Permission[] = [];
  private userSessions: UserSession[] = [];
  private userActivities: UserActivity[] = [];
  private userWorkspaces: UserWorkspace[] = [];
  private assessments: Assessment[] = [];
  private policies: Policy[] = [];
  private vulnerabilities: Vulnerability[] = [];
  private riskManagementPlans: RiskManagementPlan[] = [];
  private riskRegister: RiskRegister[] = [];

  private userIdSeq = 1;
  private roleIdSeq = 1;
  private permissionIdSeq = 1;
  private sessionIdSeq = 1;
  private activityIdSeq = 1;
  private workspaceIdSeq = 1;
  private assessmentIdSeq = 1;
  private policyIdSeq = 1;
  private vulnerabilityIdSeq = 1;
  private riskPlanIdSeq = 1;
  private riskRegisterIdSeq = 1;

  // User authentication
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

  // User management with RBAC
  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = { ...this.users[index], ...user };
    return this.users[index];
  }

  async deleteUser(id: number): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  // Role management
  async getRoles(): Promise<Role[]> {
    return this.roles;
  }

  async getRole(id: number): Promise<Role | undefined> {
    return this.roles.find(r => r.id === id);
  }

  async createRole(role: InsertRole): Promise<Role> {
    const created: Role = { id: this.roleIdSeq++, ...role } as Role;
    this.roles.push(created);
    return created;
  }

  async updateRole(id: number, role: Partial<InsertRole>): Promise<Role | undefined> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    this.roles[index] = { ...this.roles[index], ...role };
    return this.roles[index];
  }

  async deleteRole(id: number): Promise<boolean> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) return false;
    this.roles.splice(index, 1);
    return true;
  }

  // Permission management
  async getPermissions(): Promise<Permission[]> {
    return this.permissions;
  }

  async getPermissionsByCategory(category: string): Promise<Permission[]> {
    return this.permissions.filter(p => p.category === category);
  }

  async createPermission(permission: InsertPermission): Promise<Permission> {
    const created: Permission = { id: this.permissionIdSeq++, ...permission } as Permission;
    this.permissions.push(created);
    return created;
  }

  // User sessions
  async createUserSession(session: InsertUserSession): Promise<UserSession> {
    const created: UserSession = { id: this.sessionIdSeq++, ...session } as UserSession;
    this.userSessions.push(created);
    return created;
  }

  async getUserSessions(userId: number): Promise<UserSession[]> {
    return this.userSessions.filter(s => s.userId === userId);
  }

  async updateUserSession(id: number, session: Partial<InsertUserSession>): Promise<UserSession | undefined> {
    const index = this.userSessions.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    this.userSessions[index] = { ...this.userSessions[index], ...session };
    return this.userSessions[index];
  }

  // User activities
  async getUserActivities(userId?: number, limit?: number): Promise<UserActivity[]> {
    let activities = this.userActivities;
    if (userId) {
      activities = activities.filter(a => a.userId === userId);
    }
    return activities.slice(0, limit || 100);
  }

  async createUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const created: UserActivity = { id: this.activityIdSeq++, ...activity } as UserActivity;
    this.userActivities.push(created);
    return created;
  }

  // User workspaces
  async getUserWorkspaces(userId: number): Promise<UserWorkspace[]> {
    return this.userWorkspaces.filter(w => w.userId === userId);
  }

  async getDefaultWorkspace(userId: number): Promise<UserWorkspace | undefined> {
    return this.userWorkspaces.find(w => w.userId === userId && w.isDefault);
  }

  async createUserWorkspace(workspace: InsertUserWorkspace): Promise<UserWorkspace> {
    const created: UserWorkspace = { id: this.workspaceIdSeq++, ...workspace } as UserWorkspace;
    this.userWorkspaces.push(created);
    return created;
  }

  async updateUserWorkspace(id: number, workspace: Partial<InsertUserWorkspace>): Promise<UserWorkspace | undefined> {
    const index = this.userWorkspaces.findIndex(w => w.id === id);
    if (index === -1) return undefined;
    this.userWorkspaces[index] = { ...this.userWorkspaces[index], ...workspace };
    return this.userWorkspaces[index];
  }

  async deleteUserWorkspace(id: number): Promise<boolean> {
    const index = this.userWorkspaces.findIndex(w => w.id === id);
    if (index === -1) return false;
    this.userWorkspaces.splice(index, 1);
    return true;
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
      profileImageUrl: null,
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
      profileImageUrl: null,
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
      profileImageUrl: null,
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
      profileImageUrl: null,
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
      profileImageUrl: null,
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

  async updateUserManagement(id: number, updateData: Partial<InsertUsersManagement>): Promise<UsersManagement | undefined> {
    const index = this.usersManagementList.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    
    const updated = {
      ...this.usersManagementList[index],
      ...updateData,
      updatedAt: new Date()
    };
    this.usersManagementList[index] = updated;
    return updated;
  }

  async deleteUserManagement(id: number): Promise<boolean> {
    const initialLength = this.usersManagementList.length;
    this.usersManagementList = this.usersManagementList.filter(u => u.id !== id);
    return this.usersManagementList.length < initialLength;
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

  // ECC Project Management - InMemory implementation
  private eccProjectsList: EccProject[] = [
    {
      id: 1,
      organizationName: "Saudi Tech Solutions",
      organizationSize: "medium",
      organizationScope: "advanced",
      projectName: "ECC Compliance 2024",
      description: "Complete implementation of Essential Cybersecurity Controls for our organization",
      cisoUserId: 1, // Sarah Chen
      status: "gap-assessment",
      currentStep: 2,
      overallComplianceScore: 34,
      createdAt: new Date("2024-01-15T10:00:00Z"),
      updatedAt: new Date("2024-01-20T14:30:00Z")
    }
  ];
  private eccGapAssessmentsList: EccGapAssessment[] = [];
  private eccRiskAssessmentsList: EccRiskAssessment[] = [];
  private eccRoadmapTasksList: EccRoadmapTask[] = [];
  private eccTrainingModulesList: EccTrainingModule[] = [];
  private eccUserTrainingList: EccUserTraining[] = [];
  
  private eccProjectIdSeq = 2;
  private eccGapAssessmentIdSeq = 1;
  private eccRiskAssessmentIdSeq = 1;
  private eccRoadmapTaskIdSeq = 1;
  private eccTrainingModuleIdSeq = 1;
  private eccUserTrainingIdSeq = 1;

  async getEccProjects(cisoUserId: number): Promise<EccProject[]> {
    return this.eccProjectsList.filter(p => p.cisoUserId === cisoUserId);
  }

  async getEccProject(id: number): Promise<EccProject | undefined> {
    return this.eccProjectsList.find(p => p.id === id);
  }

  async createEccProject(project: InsertEccProject): Promise<EccProject> {
    const created: EccProject = {
      id: this.eccProjectIdSeq++,
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    } as EccProject;
    this.eccProjectsList.push(created);
    return created;
  }

  async updateEccProject(id: number, project: Partial<InsertEccProject>): Promise<EccProject | undefined> {
    const index = this.eccProjectsList.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    const updated = {
      ...this.eccProjectsList[index],
      ...project,
      updatedAt: new Date()
    };
    this.eccProjectsList[index] = updated;
    return updated;
  }

  async deleteEccProject(id: number): Promise<boolean> {
    const before = this.eccProjectsList.length;
    this.eccProjectsList = this.eccProjectsList.filter(p => p.id !== id);
    return this.eccProjectsList.length < before;
  }

  // ECC Gap Assessment - InMemory implementation
  async getEccGapAssessments(projectId: number): Promise<EccGapAssessment[]> {
    return this.eccGapAssessmentsList.filter(a => a.projectId === projectId);
  }

  async createEccGapAssessment(assessment: InsertEccGapAssessment): Promise<EccGapAssessment> {
    const created: EccGapAssessment = {
      id: this.eccGapAssessmentIdSeq++,
      ...assessment,
      assessedAt: new Date()
    } as EccGapAssessment;
    this.eccGapAssessmentsList.push(created);
    return created;
  }

  async updateEccGapAssessment(id: number, assessment: Partial<InsertEccGapAssessment>): Promise<EccGapAssessment | undefined> {
    const index = this.eccGapAssessmentsList.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    const updated = { ...this.eccGapAssessmentsList[index], ...assessment };
    this.eccGapAssessmentsList[index] = updated;
    return updated;
  }

  // ECC Risk Assessment - InMemory implementation
  async getEccRiskAssessments(projectId: number, gapAssessmentId?: number): Promise<EccRiskAssessment[]> {
    let filtered = this.eccRiskAssessmentsList.filter(a => a.projectId === projectId);
    if (gapAssessmentId) {
      filtered = filtered.filter(a => a.gapAssessmentId === gapAssessmentId);
    }
    return filtered;
  }

  async createEccRiskAssessment(assessment: InsertEccRiskAssessment): Promise<EccRiskAssessment> {
    const created: EccRiskAssessment = {
      id: this.eccRiskAssessmentIdSeq++,
      ...assessment,
      assessedAt: new Date()
    } as EccRiskAssessment;
    this.eccRiskAssessmentsList.push(created);
    return created;
  }

  async updateEccRiskAssessment(id: number, assessment: Partial<InsertEccRiskAssessment>): Promise<EccRiskAssessment | undefined> {
    const index = this.eccRiskAssessmentsList.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    const updated = { ...this.eccRiskAssessmentsList[index], ...assessment };
    this.eccRiskAssessmentsList[index] = updated;
    return updated;
  }

  // ECC Roadmap Tasks - InMemory implementation
  async getEccRoadmapTasks(projectId: number, status?: string): Promise<EccRoadmapTask[]> {
    let filtered = this.eccRoadmapTasksList.filter(t => t.projectId === projectId);
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }
    return filtered;
  }

  async createEccRoadmapTask(task: InsertEccRoadmapTask): Promise<EccRoadmapTask> {
    const created: EccRoadmapTask = {
      id: this.eccRoadmapTaskIdSeq++,
      ...task,
      createdAt: new Date(),
      updatedAt: new Date()
    } as EccRoadmapTask;
    this.eccRoadmapTasksList.push(created);
    return created;
  }

  async updateEccRoadmapTask(id: number, task: Partial<InsertEccRoadmapTask>): Promise<EccRoadmapTask | undefined> {
    const index = this.eccRoadmapTasksList.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    const updated = {
      ...this.eccRoadmapTasksList[index],
      ...task,
      updatedAt: new Date()
    };
    this.eccRoadmapTasksList[index] = updated;
    return updated;
  }

  async deleteEccRoadmapTask(id: number): Promise<boolean> {
    const before = this.eccRoadmapTasksList.length;
    this.eccRoadmapTasksList = this.eccRoadmapTasksList.filter(t => t.id !== id);
    return this.eccRoadmapTasksList.length < before;
  }

  // ECC Training - InMemory implementation
  async getEccTrainingModules(isActive?: boolean): Promise<EccTrainingModule[]> {
    if (isActive !== undefined) {
      return this.eccTrainingModulesList.filter(m => m.isActive === isActive);
    }
    return this.eccTrainingModulesList;
  }

  async createEccTrainingModule(module: InsertEccTrainingModule): Promise<EccTrainingModule> {
    const created: EccTrainingModule = {
      id: this.eccTrainingModuleIdSeq++,
      ...module,
      createdAt: new Date()
    } as EccTrainingModule;
    this.eccTrainingModulesList.push(created);
    return created;
  }

  async getEccUserTraining(projectId: number, userId: number): Promise<EccUserTraining[]> {
    return this.eccUserTrainingList.filter(t => t.projectId === projectId && t.userId === userId);
  }

  async createEccUserTraining(training: InsertEccUserTraining): Promise<EccUserTraining> {
    const created: EccUserTraining = {
      id: this.eccUserTrainingIdSeq++,
      ...training,
      startedAt: training.status !== 'not-started' ? new Date() : null,
      completedAt: training.status === 'completed' ? new Date() : null,
      lastAccessedAt: new Date()
    } as EccUserTraining;
    this.eccUserTrainingList.push(created);
    return created;
  }

  async updateEccUserTraining(id: number, training: Partial<InsertEccUserTraining>): Promise<EccUserTraining | undefined> {
    const index = this.eccUserTrainingList.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    const updated = {
      ...this.eccUserTrainingList[index],
      ...training,
      lastAccessedAt: new Date()
    };
    if (training.status === 'completed' && !updated.completedAt) {
      updated.completedAt = new Date();
    }
    this.eccUserTrainingList[index] = updated;
    return updated;
  }
}

export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new InMemoryStorage();