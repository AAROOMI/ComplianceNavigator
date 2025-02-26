import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const domains = [
  "Access Control",
  "Data Protection",
  "Network Security",
  "Incident Response",
  "Business Continuity"
] as const;

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

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  domain: text("domain").notNull(),
  content: text("content").notNull(),
  generatedAt: text("generated_at").notNull(),
});

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
  content: true,
  generatedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;
