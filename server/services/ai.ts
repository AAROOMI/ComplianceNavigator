import OpenAI from "openai";
import { domains } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateSecurityPolicy(domain: string): Promise<string> {
  const prompt = `
Generate a comprehensive cybersecurity policy for the "${domain}" domain following NCA ECC (National Cybersecurity Authority Essential Cybersecurity Controls) framework requirements.

The policy should include:
1. Purpose and scope
2. Specific controls and requirements
3. Implementation guidelines
4. Compliance monitoring procedures
5. Roles and responsibilities

Format the response as a well-structured policy document. Focus on practical, actionable items that align with NCA ECC requirements.

Response should be detailed but concise, avoiding unnecessary technical jargon while maintaining professional language.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert cybersecurity policy generator specializing in NCA ECC compliance. Generate clear, actionable policies that align with regulatory requirements."
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
