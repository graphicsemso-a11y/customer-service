
import { GoogleGenAI } from "@google/genai";
import { Inquiry } from "../types";

export const generateReport = async (inquiries: Inquiry[], period: string, type: 'Daily' | 'Monthly'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const dataSummary = inquiries.map(iq => ({
    name: iq.name,
    phone: iq.phoneNumber,
    category: iq.category,
    details: iq.inquiryDetails,
    count: iq.count,
    date: iq.date
  }));

  const prompt = `
    Analyze the following customer inquiries for the ${type} period: ${period}.
    Our organization is ATCUAE (Automobile & Touring Club UAE).
    Categories: CPD (Carnet de Passages en Douane), IDP (International Driving Permit), Motorsport, TIR (Transports Internationaux Routiers), and General.
    
    Data Context:
    ${JSON.stringify(dataSummary, null, 2)}

    Please provide a ${type} Strategic Analysis:
    1. Executive Summary: High-level overview of activity for this ${type.toLowerCase()} period.
    2. Trend Recognition: Identify patterns, recurring issues, or high-volume categories.
    3. Operational Sentiment: What is the general tone of customer needs?
    4. Strategic Recommendations: Actionable steps for management to improve efficiency or service quality for the ${type === 'Daily' ? 'upcoming days' : 'next month'}.
    
    Format: Use professional corporate language. Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "No analysis could be synthesized from the current data set.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "The Intelligence Engine encountered an error. Please verify data integrity or API availability.";
  }
};
