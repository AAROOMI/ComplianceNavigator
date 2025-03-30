import { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema, insertPolicySchema, insertVulnerabilitySchema } from "@shared/schema";
import { generateSecurityPolicy, generateComplianceResponse } from "./services/ai";

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

  // AI Assistant API endpoint
  app.post("/api/assistant/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Generate response using AI
      const response = await generateComplianceResponse(message);
      
      res.json({ 
        message: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error in AI assistant:", error);
      res.status(500).json({ message: "Failed to process your request" });
    }
  });

  // Vulnerability Assessment API endpoints
  app.get("/api/vulnerabilities/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const assessmentId = req.query.assessmentId ? parseInt(req.query.assessmentId.toString()) : undefined;
      const vulnerabilities = await storage.getVulnerabilities(userId, assessmentId);
      res.json(vulnerabilities);
    } catch (error) {
      console.error("Error fetching vulnerabilities:", error);
      res.status(500).json({ message: "Failed to fetch vulnerabilities" });
    }
  });

  app.get("/api/vulnerabilities/:userId/domain/:domain", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const domain = req.params.domain;
      const vulnerabilities = await storage.getVulnerabilityByDomain(userId, domain);
      res.json(vulnerabilities);
    } catch (error) {
      console.error("Error fetching domain vulnerabilities:", error);
      res.status(500).json({ message: "Failed to fetch domain vulnerabilities" });
    }
  });

  app.post("/api/vulnerabilities", async (req, res) => {
    try {
      // Ensure created date is set
      const vulnerabilityData = {
        ...req.body,
        createdAt: req.body.createdAt || new Date().toISOString()
      };
      
      const vulnerability = insertVulnerabilitySchema.parse(vulnerabilityData);
      const created = await storage.createVulnerability(vulnerability);
      res.json(created);
    } catch (error) {
      console.error("Error creating vulnerability:", error);
      res.status(500).json({ message: "Failed to create vulnerability" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}