
/**
 * AI Services for policy generation and compliance assistance
 */
import OpenAI from "openai";

// Initialize OpenAI if API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

/**
 * Generate a security policy using OpenAI
 */
export async function generatePolicyWithOpenAI(domain: string, subdomain: string): Promise<string> {
  if (!openai) {
    return generateSecurityPolicy(domain, subdomain);
  }

  const prompt = `Generate a comprehensive security policy for the domain "${domain}"${
    subdomain ? ` with focus on the subdomain "${subdomain}"` : ""
  }. The policy should align with NCA ECC (Essential Cybersecurity Controls) framework requirements.
  
  Structure the policy with the following sections:
  1. Overview and Purpose
  2. Scope and Applicability
  3. Specific Requirements and Controls
  4. Compliance and Enforcement
  5. Review and Updates`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert cybersecurity policy generator specializing in NCA ECC compliance. Generate clear, actionable policies that align with regulatory requirements and provide practical implementation steps."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Failed to generate policy content.";
  } catch (error) {
    console.error("Error generating policy:", error);
    throw new Error("Failed to generate policy using AI");
  }
}

/**
 * Service for generating AI-based security policies
 */
export async function generateSecurityPolicy(domain: string, subdomain: string): Promise<string> {
  // Sample implementation - would typically call an LLM API
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
 * Service for generating AI-based compliance responses
 */
export async function generateComplianceResponse(query: string): Promise<string> {
  // This would typically call an LLM API
  // For now, just return a generic response
  if (query.toLowerCase().includes("nca ecc")) {
    return `The NCA ECC (Essential Cybersecurity Controls) framework includes 5 domains:
    
1. Governance - Establishes leadership, policies, and risk management
2. Cybersecurity Defence - Focuses on technical controls like access management and encryption
3. Cybersecurity Resilience - Covers incident response and business continuity
4. Third Party Cloud Computing - Addresses cloud security and vendor management
5. Industrial Control Systems - Specialized controls for operational technology

Would you like specific information about any of these domains?`;
  }
  
  if (query.toLowerCase().includes("policy")) {
    return `For effective security policies, you should:
    
1. Align with NCA ECC requirements and other applicable regulations
2. Customize policies for your specific organization and environment
3. Ensure policies are clear, comprehensive, and actionable
4. Establish regular review and update procedures
5. Implement training and awareness programs

I can help you draft policies for specific domains if you'd like.`;
  }
  
  return `Here's information about your query on "${query}":
  
Based on NCA ECC requirements, this area requires proper documentation, 
regular assessments, and specific controls to be implemented. 

Would you like me to help you develop a compliance plan for this topic?`;
}
