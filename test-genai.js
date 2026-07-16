import { GoogleGenAI } from "@google/genai";
console.log("Creating GenAI...");
try {
  const ai = new GoogleGenAI({ apiKey: "" });
  console.log("Success");
} catch(e) {
  console.log("Failed:", e.message);
}
