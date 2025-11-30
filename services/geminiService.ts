import { GoogleGenAI } from "@google/genai";
import { FormField } from "../types";

const SYSTEM_INSTRUCTION = `
You are a specialized Financial QA assistant. 
Your job is to generate realistic, valid JSON test data for financial API payloads based on a list of form fields provided.
- Ensure numbers are realistic (e.g., loan amounts, interest rates).
- Ensure dates are valid and logical.
- Return ONLY the JSON object. No markdown formatting.
`;

export const generateTestData = async (fields: FormField[]): Promise<any> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key missing");
    return {};
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const fieldDescriptions = fields.map(f => `${f.name} (${f.type}): ${f.label}`).join(', ');
    const prompt = `Generate a JSON object for a financial transaction with the following fields: [${fieldDescriptions}].`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (error) {
    console.error("Failed to generate test data with Gemini:", error);
  }
  return {};
};
