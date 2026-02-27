// src/services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai"; // <--- Correct Import
import { PRODUCTS } from "../constants";

// Fix TypeScript errors by telling it "specifications" can be anything
interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  specifications?: any; 
  [key: string]: any;
}

// PASTE YOUR API KEY HERE
const API_KEY = "YOUR_PASTED_API_KEY_HERE"; 

// Initialize the correct class
const genAI = new GoogleGenerativeAI(API_KEY);

export interface RecommendationResult {
  productId: string;
  matchScore: number;
  rationale: string;
}

export const getProductRecommendations = async (userQuery: string): Promise<RecommendationResult[]> => {
  // Safety check for missing key
  if (!API_KEY || API_KEY.includes("YOUR_PASTED")) {
    console.warn("Gemini API Key missing. Using Mock Data.");
    return mockRecommendations(userQuery);
  }

  // Prepare data for AI (converting arrays to string so AI can read them)
  const productContext = (PRODUCTS as unknown as Product[]).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    specs: p.specifications ? JSON.stringify(p.specifications) : (p.description || ""), 
  }));

  const prompt = `
    You are an expert sales engineer for Durable Fastener Pvt. Ltd.
    User Query: "${userQuery}"
    
    Based on the following product catalog, identify the top 3 most relevant products.
    Catalog: ${JSON.stringify(productContext)}
    
    Return a strictly valid JSON array (no markdown) where each object has:
    - productId (string): matching the catalog ID
    - matchScore (number): 0-100 confidence
    - rationale (string): 1 sentence explaining why this fits the query.
  `;

  try {
    // Use the correct model setup for this library
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" } 
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text(); 

    if (!text) return [];
    
    // Clean up response
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as RecommendationResult[];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return mockRecommendations(userQuery);
  }
};

const mockRecommendations = (query: string): RecommendationResult[] => {
  const lowerQ = query.toLowerCase();
  return (PRODUCTS as unknown as Product[])
    .filter(p => {
       const nameMatch = p.name.toLowerCase().includes(lowerQ);
       const descMatch = (p.description || "").toLowerCase().includes(lowerQ); 
       return nameMatch || descMatch;
    })
    .slice(0, 3)
    .map(p => ({
      productId: p.id,
      matchScore: 85,
      rationale: "Selected based on keyword matching (Offline Mode)."
    }));
};