import { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema, insertPolicySchema } from "@shared/schema";
import { generateSecurityPolicy } from "./services/ai";

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
    try {
      const policy = insertPolicySchema.parse(req.body);

      // Generate AI policy content if not provided
      if (!policy.content) {
        policy.content = await generateSecurityPolicy(policy.domain, policy.subdomain);
      }

      const created = await storage.createPolicy(policy);
      res.json(created);
    } catch (error) {
      console.error("Error creating policy:", error);
      res.status(500).json({ message: "Failed to create policy" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}