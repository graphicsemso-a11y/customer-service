
import { GoogleGenAI } from "@google/genai";
import { Inquiry } from "../types";

export const generateDailyReport = async (inquiries: Inquiry[], date: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const dataSummary = inquiries.map(iq => ({
    name: iq.name,
    phone: iq.phoneNumber,
    category: iq.category,
    details: iq.inquiryDetails,
    count: iq.count
  }));

  const prompt = `
    Analyze the following customer inquiries received on ${date} for our service center.
    The categories are CPD (Carnet de Passages en Douane), IDP (International Driving Permit), Motorsport, TIR (Transports Internationaux Routiers), and General inquiries.
    
    Data:
    ${JSON.stringify(dataSummary, null, 2)}

    Please provide:
    1. A professional executive summary of the day's activity.
    2. Specific trends or high-volume areas noticed (if any).
    3. Sentiment analysis of the inquiries.
    4. Strategic recommendations for the team to handle tomorrow's load or improve service quality.
    
    Keep the report professional, insightful, and concise. Use markdown for formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "No report generated.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Failed to generate AI report. Please check your API configuration or network.";
  }
};
