import { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema, insertPolicySchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/assessments/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const assessments = await storage.getAssessments(userId);
    res.json(assessments);
  });

  app.post("/api/assessments", async (req, res) => {
    const assessment = insertAssessmentSchema.parse(req.body);
    const created = await storage.createAssessment(assessment);
    res.json(created);
  });

  app.get("/api/policies/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const policies = await storage.getPolicies(userId);
    res.json(policies);
  });

  app.post("/api/policies", async (req, res) => {
    const policy = insertPolicySchema.parse(req.body);
    const created = await storage.createPolicy(policy);
    res.json(created);
  });

  const httpServer = createServer(app);
  return httpServer;
}
