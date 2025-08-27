import { Express } from "express";
import { createServer } from "http";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { 
  insertAssessmentSchema, 
  insertPolicySchema, 
  insertVulnerabilitySchema, 
  insertRiskManagementPlanSchema,
  insertRiskRegisterSchema,
  insertUsersManagementSchema,
  insertAchievementBadgeSchema,
  insertPolicyFeedbackSchema,
  insertPolicyCollaborationSchema,
  insertEccProjectSchema,
  insertEccGapAssessmentSchema,
  insertEccRiskAssessmentSchema,
  insertEccRoadmapTaskSchema,
  insertEccTrainingModuleSchema,
  insertEccUserTrainingSchema
} from "@shared/schema";
import { generateSecurityPolicy, generateComplianceResponse } from "./services/ai";
import { seedRiskRegister } from "./risk-register-seed";
import { ObjectStorageService } from "./objectStorage";
import { multilingualService } from "./services/multilingual";

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
      const { message, language = 'en' } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Generate response using AI with language support
      const response = await generateComplianceResponse(message);
      
      res.json({ 
        message: response,
        timestamp: new Date().toISOString(),
        language: language
      });
    } catch (error) {
      console.error("Error in AI assistant:", error);
      res.status(500).json({ message: "Failed to process your request" });
    }
  });

  // Multilingual API endpoints for Sarah's voice capabilities
  app.post("/api/sarah/detect-language", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const language = await multilingualService.detectLanguage(text);
      res.json({ language });
    } catch (error) {
      console.error("Error detecting language:", error);
      res.status(500).json({ message: "Failed to detect language" });
    }
  });

  app.post("/api/sarah/translate", async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      if (!text || !targetLanguage) {
        return res.status(400).json({ message: "Text and target language are required" });
      }

      const translatedText = await multilingualService.translateText(text, targetLanguage);
      res.json({ translatedText });
    } catch (error) {
      console.error("Error translating text:", error);
      res.status(500).json({ message: "Failed to translate text" });
    }
  });

  app.post("/api/sarah/speak", async (req, res) => {
    try {
      const { text, language = 'en', voiceId } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const audioBuffer = await multilingualService.generateSpeech(text, language, voiceId);
      
      if (!audioBuffer) {
        return res.status(500).json({ message: "Failed to generate speech" });
      }

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      });
      
      res.send(audioBuffer);
    } catch (error) {
      console.error("Error generating speech:", error);
      res.status(500).json({ message: "Failed to generate speech" });
    }
  });

  app.post("/api/sarah/respond", async (req, res) => {
    try {
      const { message, language = 'en', context = '' } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await multilingualService.generateResponse(message, language, context);
      res.json({ 
        response,
        language,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error generating multilingual response:", error);
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  app.get("/api/sarah/languages", async (req, res) => {
    try {
      const languages = multilingualService.getAvailableLanguages();
      res.json({ languages });
    } catch (error) {
      console.error("Error fetching languages:", error);
      res.status(500).json({ message: "Failed to fetch languages" });
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

  // Risk Management Plan API endpoints
  app.get("/api/risk-management-plans/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const vulnerabilityId = req.query.vulnerabilityId 
        ? parseInt(req.query.vulnerabilityId.toString()) 
        : undefined;
      
      const plans = await storage.getRiskManagementPlans(userId, vulnerabilityId);
      res.json(plans);
    } catch (error) {
      console.error("Error fetching risk management plans:", error);
      res.status(500).json({ message: "Failed to fetch risk management plans" });
    }
  });

  app.get("/api/risk-management-plans/plan/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getRiskManagementPlanById(id);
      
      if (!plan) {
        return res.status(404).json({ message: "Risk management plan not found" });
      }
      
      res.json(plan);
    } catch (error) {
      console.error("Error fetching risk management plan:", error);
      res.status(500).json({ message: "Failed to fetch risk management plan" });
    }
  });

  app.post("/api/risk-management-plans", async (req, res) => {
    try {
      // Ensure timestamps are set
      const planData = {
        ...req.body,
        createdAt: req.body.createdAt || new Date().toISOString(),
        updatedAt: req.body.updatedAt || new Date().toISOString()
      };
      
      const plan = insertRiskManagementPlanSchema.parse(planData);
      const created = await storage.createRiskManagementPlan(plan);
      res.json(created);
    } catch (error) {
      console.error("Error creating risk management plan:", error);
      res.status(500).json({ message: "Failed to create risk management plan" });
    }
  });

  app.patch("/api/risk-management-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Add updated timestamp
      const updateData = {
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      
      const updated = await storage.updateRiskManagementPlan(id, updateData);
      
      if (!updated) {
        return res.status(404).json({ message: "Risk management plan not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating risk management plan:", error);
      res.status(500).json({ message: "Failed to update risk management plan" });
    }
  });

  app.delete("/api/risk-management-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteRiskManagementPlan(id);
      
      if (!result) {
        return res.status(404).json({ message: "Risk management plan not found or could not be deleted" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting risk management plan:", error);
      res.status(500).json({ message: "Failed to delete risk management plan" });
    }
  });

  // Risk Register seed endpoint
  app.post("/api/risk-register/seed", async (req, res) => {
    try {
      await seedRiskRegister();
      res.json({ success: true, message: "Risk register seeded successfully" });
    } catch (error) {
      console.error("Error seeding risk register:", error);
      res.status(500).json({ message: "Failed to seed risk register" });
    }
  });

  // Risk Register API endpoints
  app.get("/api/risk-register", async (req, res) => {
    try {
      const category = req.query.category?.toString();
      const riskLevel = req.query.riskLevel?.toString();
      const entries = await storage.getRiskRegister(category, riskLevel);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching risk register:", error);
      res.status(500).json({ message: "Failed to fetch risk register" });
    }
  });

  app.get("/api/risk-register/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entry = await storage.getRiskRegisterById(id);
      
      if (!entry) {
        return res.status(404).json({ message: "Risk register entry not found" });
      }
      
      res.json(entry);
    } catch (error) {
      console.error("Error fetching risk register entry:", error);
      res.status(500).json({ message: "Failed to fetch risk register entry" });
    }
  });

  app.post("/api/risk-register", async (req, res) => {
    try {
      const entry = insertRiskRegisterSchema.parse(req.body);
      const created = await storage.createRiskRegisterEntry(entry);
      res.json(created);
    } catch (error) {
      console.error("Error creating risk register entry:", error);
      res.status(500).json({ message: "Failed to create risk register entry" });
    }
  });

  app.patch("/api/risk-register/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateRiskRegisterEntry(id, req.body);
      
      if (!updated) {
        return res.status(404).json({ message: "Risk register entry not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating risk register entry:", error);
      res.status(500).json({ message: "Failed to update risk register entry" });
    }
  });

  app.delete("/api/risk-register/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteRiskRegisterEntry(id);
      
      if (!result) {
        return res.status(404).json({ message: "Risk register entry not found or could not be deleted" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting risk register entry:", error);
      res.status(500).json({ message: "Failed to delete risk register entry" });
    }
  });

  // User Management API endpoints
  app.get("/api/users-management", async (req, res) => {
    try {
      const users = await storage.getUsersManagement();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users-management/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUserManagement(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users-management", async (req, res) => {
    try {
      const userData = insertUsersManagementSchema.parse(req.body);
      const created = await storage.createUserManagement(userData);
      res.json(created);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users-management/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updated = await storage.updateUserManagement(id, updateData);
      res.json(updated);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users-management/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUserManagement(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Achievement Badges API endpoints
  app.get("/api/achievement-badges", async (req, res) => {
    try {
      const badges = await storage.getAchievementBadges();
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  app.post("/api/achievement-badges", async (req, res) => {
    try {
      const badgeData = insertAchievementBadgeSchema.parse(req.body);
      const created = await storage.createAchievementBadge(badgeData);
      res.json(created);
    } catch (error) {
      console.error("Error creating badge:", error);
      res.status(500).json({ message: "Failed to create badge" });
    }
  });

  app.get("/api/user-achievements/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.post("/api/award-badge", async (req, res) => {
    try {
      const { userId, badgeId } = req.body;
      const achievement = await storage.awardBadge(userId, badgeId);
      res.json(achievement);
    } catch (error) {
      console.error("Error awarding badge:", error);
      res.status(500).json({ message: "Failed to award badge" });
    }
  });

  // ECC Project Management API endpoints
  app.get("/api/ecc-projects/:cisoUserId", async (req, res) => {
    try {
      const cisoUserId = parseInt(req.params.cisoUserId);
      const projects = await storage.getEccProjects(cisoUserId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching ECC projects:", error);
      res.status(500).json({ message: "Failed to fetch ECC projects" });
    }
  });

  app.get("/api/ecc-projects/project/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getEccProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "ECC project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching ECC project:", error);
      res.status(500).json({ message: "Failed to fetch ECC project" });
    }
  });

  app.post("/api/ecc-projects", async (req, res) => {
    try {
      const project = insertEccProjectSchema.parse(req.body);
      const created = await storage.createEccProject(project);
      res.json(created);
    } catch (error) {
      console.error("Error creating ECC project:", error);
      res.status(500).json({ message: "Failed to create ECC project" });
    }
  });

  app.put("/api/ecc-projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateEccProject(id, req.body);
      
      if (!updated) {
        return res.status(404).json({ message: "ECC project not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating ECC project:", error);
      res.status(500).json({ message: "Failed to update ECC project" });
    }
  });

  app.delete("/api/ecc-projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteEccProject(id);
      
      if (!result) {
        return res.status(404).json({ message: "ECC project not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting ECC project:", error);
      res.status(500).json({ message: "Failed to delete ECC project" });
    }
  });

  // ECC Gap Assessment API endpoints
  app.get("/api/ecc-gap-assessments/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const assessments = await storage.getEccGapAssessments(projectId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching ECC gap assessments:", error);
      res.status(500).json({ message: "Failed to fetch ECC gap assessments" });
    }
  });

  app.post("/api/ecc-gap-assessments", async (req, res) => {
    try {
      const assessment = insertEccGapAssessmentSchema.parse(req.body);
      const created = await storage.createEccGapAssessment(assessment);
      res.json(created);
    } catch (error) {
      console.error("Error creating ECC gap assessment:", error);
      res.status(500).json({ message: "Failed to create ECC gap assessment" });
    }
  });

  app.put("/api/ecc-gap-assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateEccGapAssessment(id, req.body);
      
      if (!updated) {
        return res.status(404).json({ message: "ECC gap assessment not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating ECC gap assessment:", error);
      res.status(500).json({ message: "Failed to update ECC gap assessment" });
    }
  });

  // ECC Risk Assessment API endpoints
  app.get("/api/ecc-risk-assessments/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const gapAssessmentId = req.query.gapAssessmentId ? parseInt(req.query.gapAssessmentId.toString()) : undefined;
      const assessments = await storage.getEccRiskAssessments(projectId, gapAssessmentId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching ECC risk assessments:", error);
      res.status(500).json({ message: "Failed to fetch ECC risk assessments" });
    }
  });

  app.post("/api/ecc-risk-assessments", async (req, res) => {
    try {
      const assessment = insertEccRiskAssessmentSchema.parse(req.body);
      const created = await storage.createEccRiskAssessment(assessment);
      res.json(created);
    } catch (error) {
      console.error("Error creating ECC risk assessment:", error);
      res.status(500).json({ message: "Failed to create ECC risk assessment" });
    }
  });

  app.put("/api/ecc-risk-assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateEccRiskAssessment(id, req.body);
      
      if (!updated) {
        return res.status(404).json({ message: "ECC risk assessment not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating ECC risk assessment:", error);
      res.status(500).json({ message: "Failed to update ECC risk assessment" });
    }
  });

  // ECC Roadmap Tasks API endpoints
  app.get("/api/ecc-roadmap-tasks/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const status = req.query.status?.toString();
      const tasks = await storage.getEccRoadmapTasks(projectId, status);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching ECC roadmap tasks:", error);
      res.status(500).json({ message: "Failed to fetch ECC roadmap tasks" });
    }
  });

  app.post("/api/ecc-roadmap-tasks", async (req, res) => {
    try {
      const task = insertEccRoadmapTaskSchema.parse(req.body);
      const created = await storage.createEccRoadmapTask(task);
      res.json(created);
    } catch (error) {
      console.error("Error creating ECC roadmap task:", error);
      res.status(500).json({ message: "Failed to create ECC roadmap task" });
    }
  });

  app.put("/api/ecc-roadmap-tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateEccRoadmapTask(id, req.body);
      
      if (!updated) {
        return res.status(404).json({ message: "ECC roadmap task not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating ECC roadmap task:", error);
      res.status(500).json({ message: "Failed to update ECC roadmap task" });
    }
  });

  app.delete("/api/ecc-roadmap-tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteEccRoadmapTask(id);
      
      if (!result) {
        return res.status(404).json({ message: "ECC roadmap task not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting ECC roadmap task:", error);
      res.status(500).json({ message: "Failed to delete ECC roadmap task" });
    }
  });

  // ECC Training API endpoints
  app.get("/api/ecc-training-modules", async (req, res) => {
    try {
      const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
      const modules = await storage.getEccTrainingModules(isActive);
      res.json(modules);
    } catch (error) {
      console.error("Error fetching ECC training modules:", error);
      res.status(500).json({ message: "Failed to fetch ECC training modules" });
    }
  });

  app.post("/api/ecc-training-modules", async (req, res) => {
    try {
      const module = insertEccTrainingModuleSchema.parse(req.body);
      const created = await storage.createEccTrainingModule(module);
      res.json(created);
    } catch (error) {
      console.error("Error creating ECC training module:", error);
      res.status(500).json({ message: "Failed to create ECC training module" });
    }
  });

  app.get("/api/ecc-user-training/:projectId/:userId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const userId = parseInt(req.params.userId);
      const training = await storage.getEccUserTraining(projectId, userId);
      res.json(training);
    } catch (error) {
      console.error("Error fetching ECC user training:", error);
      res.status(500).json({ message: "Failed to fetch ECC user training" });
    }
  });

  app.post("/api/ecc-user-training", async (req, res) => {
    try {
      const training = insertEccUserTrainingSchema.parse(req.body);
      const created = await storage.createEccUserTraining(training);
      res.json(created);
    } catch (error) {
      console.error("Error creating ECC user training:", error);
      res.status(500).json({ message: "Failed to create ECC user training" });
    }
  });

  app.put("/api/ecc-user-training/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.updateEccUserTraining(id, req.body);
      
      if (!updated) {
        return res.status(404).json({ message: "ECC user training not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating ECC user training:", error);
      res.status(500).json({ message: "Failed to update ECC user training" });
    }
  });

  // Users Management API endpoints
  app.get("/api/users-management", async (req, res) => {
    try {
      const users = await storage.getUsersManagement();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users-management/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUserManagement(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users-management", async (req, res) => {
    try {
      const userData = insertUsersManagementSchema.parse(req.body);
      const created = await storage.createUserManagement(userData);
      res.json(created);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users-management/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userData = req.body;
      const updated = await storage.updateUserManagement(id, userData);
      
      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users-management/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteUserManagement(id);
      
      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // User Roles API endpoints
  app.get("/api/roles", async (req, res) => {
    try {
      const roles = await storage.getRoles();
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.post("/api/roles", async (req, res) => {
    try {
      const roleData = req.body;
      const created = await storage.createRole(roleData);
      res.json(created);
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ message: "Failed to create role" });
    }
  });

  // User Activities API endpoints
  app.get("/api/user-activities", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId.toString()) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit.toString()) : undefined;
      const activities = await storage.getUserActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching user activities:", error);
      res.status(500).json({ message: "Failed to fetch user activities" });
    }
  });

  app.post("/api/user-activities", async (req, res) => {
    try {
      const activityData = req.body;
      const created = await storage.createUserActivity(activityData);
      res.json(created);
    } catch (error) {
      console.error("Error creating user activity:", error);
      res.status(500).json({ message: "Failed to create user activity" });
    }
  });

  // User Workspaces API endpoints
  app.get("/api/user-workspaces/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const workspaces = await storage.getUserWorkspaces(userId);
      res.json(workspaces);
    } catch (error) {
      console.error("Error fetching user workspaces:", error);
      res.status(500).json({ message: "Failed to fetch user workspaces" });
    }
  });

  app.post("/api/user-workspaces", async (req, res) => {
    try {
      const workspaceData = req.body;
      const created = await storage.createUserWorkspace(workspaceData);
      res.json(created);
    } catch (error) {
      console.error("Error creating user workspace:", error);
      res.status(500).json({ message: "Failed to create user workspace" });
    }
  });

  // Object Storage routes for file uploads
  app.post("/api/upload/policy", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.post("/api/upload/logo", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting logo upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.post("/api/upload/complete", async (req, res) => {
    try {
      const { fileName, fileType, fileUrl, category = 'document' } = req.body;
      
      // Store file metadata in storage
      const fileData = {
        fileName,
        fileType,
        fileUrl,
        category,
        uploadedAt: new Date().toISOString()
      };
      
      // Here you would normally save to database
      res.json({ 
        success: true, 
        fileId: randomUUID(),
        ...fileData 
      });
    } catch (error) {
      console.error("Error completing upload:", error);
      res.status(500).json({ error: "Failed to complete upload" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}