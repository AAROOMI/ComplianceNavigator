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
      // First, ensure a default content if none provided
      const policyData = {
        ...req.body,
        content: req.body.content || "Default policy content - will be replaced"
      };
      
      const policy = insertPolicySchema.parse(policyData);

      // Generate AI policy content if needed
      if (policy.content === "Default policy content - will be replaced") {
        try {
          policy.content = await generateSecurityPolicy(policy.domain, policy.subdomain || "");
        } catch (genError) {
          console.error("Error generating policy:", genError);
          policy.content = `Policy for ${policy.domain} - AI generation failed`;
        }
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