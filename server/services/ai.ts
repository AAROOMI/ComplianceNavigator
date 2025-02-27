/**
 * AI Services for policy generation and compliance assistance
 */
import OpenAI from "openai";
import { ncaEccStructure } from "@shared/schema";

// Initialize OpenAI if API key is available
let openai: OpenAI | null = null;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "sk-mock-key-for-development"
  });
} catch (error) {
  console.warn("OpenAI initialization failed:", error);
}

/**
 * Service for generating compliance-related responses to user queries
 */
export async function generateComplianceResponse(userMessage: string): Promise<string> {
  // Check if we have real OpenAI integration
  if (openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-mock-key-for-development") {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a cybersecurity and compliance expert specializing in NCA ECC (National Cybersecurity Authority Essential Cybersecurity Controls) implementation. 
            Provide helpful guidance to users implementing these security controls. 
            Focus on practical advice, implementation steps, and best practices.
            Keep responses professional but approachable.
            If asked about non-cybersecurity topics, gently redirect to cybersecurity and compliance information.`
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error generating AI response:", error);
      return getSimulatedResponse(userMessage);
    }
  } else {
    // Fallback to simulated responses
    return getSimulatedResponse(userMessage);
  }
}

/**
 * Service for generating AI-based security policies
 */
export async function generateSecurityPolicy(domain: string, subdomain: string): Promise<string> {
  // Check if we have real OpenAI integration
  if (openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-mock-key-for-development") {
    try {
      const domainInfo = ncaEccStructure[domain as keyof typeof ncaEccStructure] || {};
      const subdomainControls = subdomain && domainInfo[subdomain as keyof typeof domainInfo];

      let controlsText = "";
      if (subdomainControls && Array.isArray(subdomainControls)) {
        controlsText = "Controls include: " + subdomainControls.join(", ");
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a cybersecurity policy expert specializing in NCA ECC (National Cybersecurity Authority Essential Cybersecurity Controls).
            Create a detailed security policy document for the specified domain and subdomain.
            Include sections on purpose, scope, responsibilities, requirements, compliance criteria, and review procedures.
            Format the output in Markdown.`
          },
          { 
            role: "user", 
            content: `Generate a comprehensive security policy for the ${domain} domain${subdomain ? ', specifically for ' + subdomain : ''}.
            ${controlsText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.choices[0].message.content || "Failed to generate policy content.";
    } catch (error) {
      console.error("Error generating policy:", error);
      // Fallback to simulated policy
      return getSimulatedPolicy(domain, subdomain);
    }
  } else {
    // Fallback to simulated policy
    return getSimulatedPolicy(domain, subdomain);
  }
}

/**
 * Generate a simulated policy when OpenAI is not available
 */
function getSimulatedPolicy(domain: string, subdomain: string): string {
  const subdomainText = subdomain ? ` - ${subdomain}` : '';

  return `# Security Policy for ${domain}${subdomainText}

## Overview
This security policy outlines the requirements and best practices for maintaining 
security within the ${domain} domain${subdomainText ? ' with focus on ' + subdomain : ''}.

## Requirements
1. All systems must be regularly updated with security patches
2. Access controls must follow principle of least privilege
3. Regular security assessments must be conducted
4. Incidents must be reported and handled according to established procedures

## Compliance
All personnel must adhere to these policies. Violations may result in 
disciplinary actions as outlined in the organization's code of conduct.

Generated: ${new Date().toISOString()}
`;
}

/**
 * Generate a simulated response when OpenAI is not available
 */
function getSimulatedResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("governance") || lowerMessage.includes("policy")) {
    return "Governance is a crucial element of cybersecurity frameworks. It involves establishing clear policies, roles, and responsibilities. For effective governance, consider implementing regular policy reviews, ensuring board-level oversight, and aligning security with business objectives. Would you like me to help you develop a governance framework for your organization?";
  }

  if (lowerMessage.includes("risk") || lowerMessage.includes("assessment")) {
    return "Risk assessment is the foundation of an effective cybersecurity program. The NCA ECC requires organizations to conduct regular risk assessments using a documented methodology. This should include identification of threats, vulnerabilities, impacts, and appropriate controls. Have you established a formal risk assessment process yet?";
  }

  if (lowerMessage.includes("cloud") || lowerMessage.includes("third party")) {
    return "When working with cloud service providers, the NCA ECC recommends implementing strong data protection measures, careful provider selection, and ongoing monitoring. It's important to establish clear security requirements in your contracts and verify compliance regularly. Are you currently working with cloud providers?";
  }

  if (lowerMessage.includes("ics") || lowerMessage.includes("industrial")) {
    return "Industrial Control Systems (ICS) require specialized security controls according to the NCA ECC. This includes proper network segmentation, access restrictions, and incident response planning specific to operational technology environments. What type of industrial systems are you working to protect?";
  }

  // Default response for any other query
  return "The NCA Essential Cybersecurity Controls (ECC) provide a comprehensive framework for implementing cybersecurity best practices. They cover domains including Governance, Cybersecurity Defence, Cybersecurity Resilience, Third Party Cloud Computing, and Industrial Control Systems. Would you like me to help you develop a compliance plan for this topic?";
}