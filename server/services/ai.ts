import OpenAI from "openai";
import { ncaEccDomains } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateSecurityPolicy(domain: string, subdomain?: string): Promise<string> {
  const prompt = `
Generate a comprehensive cybersecurity policy for the "${domain}" domain${subdomain ? ` and "${subdomain}" subdomain` : ''} following NCA ECC (National Cybersecurity Authority Essential Cybersecurity Controls) framework requirements.

The policy should include:
1. Purpose and scope
2. Specific controls and requirements
3. Implementation guidelines
4. Compliance monitoring procedures
5. Roles and responsibilities
6. Risk assessment methodology
7. Implementation roadmap with:
   - Immediate actions (0-3 months)
   - Short-term goals (3-6 months)
   - Long-term objectives (6-12 months)
8. Success metrics and KPIs
9. Review and update procedures

Format the response as a well-structured policy document. Focus on practical, actionable items that align with NCA ECC requirements.

Response should be detailed but concise, avoiding unnecessary technical jargon while maintaining professional language.
`;

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

// This is a simple implementation - in a real app, this would connect to an LLM
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
