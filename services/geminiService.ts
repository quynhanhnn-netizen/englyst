import { GoogleGenAI, Type } from "@google/genai";
import { ArticleAnalysisResult, PodcastCorrectionResult, FiveW1H } from "../types";

// Initialize Gemini Client
// NOTE: Ideally, you should proxy this through a backend for production apps to hide the API KEY.
// For this frontend-only demo, we use the env variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes an article text to provide a summary and extract C1/C2 vocabulary.
 */
export const analyzeArticle = async (text: string): Promise<ArticleAnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert English tutor for a C1-level student. 
    Analyze the following English text.
    
    1. Write a concise summary of the core content (keep it engaging).
    2. Extract 5-8 advanced (C1/C2) vocabulary words or idioms found in the text.
    3. For each word, provide:
       - The Part of Speech (e.g., Noun, Verb, Adjective, Phrasal Verb).
       - A simple English definition.
       - The example sentence from the text (or a generated one if context is weak).
    
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: `TEXT TO ANALYZE:\n${text}\n\n${prompt}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyVocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                partOfSpeech: { type: Type.STRING }, // Include POS
                definition: { type: Type.STRING },
                example: { type: Type.STRING },
              }
            }
          }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as ArticleAnalysisResult;
  }
  throw new Error("Failed to analyze article");
};

/**
 * Reviews the user's 5W1H summary of a podcast/video.
 */
export const reviewPodcastSummary = async (topicOrTitle: string, userInputs: FiveW1H): Promise<PodcastCorrectionResult> => {
  const model = "gemini-3-flash-preview";

  const userDraft = `
    Who: ${userInputs.who}
    What: ${userInputs.what}
    Where: ${userInputs.where}
    When: ${userInputs.when}
    Why: ${userInputs.why}
    How: ${userInputs.how}
  `;

  const prompt = `
    You are an English tutor correcting a student's summary of a podcast/video about: "${topicOrTitle}".
    The student used the 5W1H method.

    1. Re-write the student's input into a cohesive, grammatically correct paragraph (C1 level).
    2. List specific grammar or vocabulary mistakes the student made.
    3. specific feedback on whether they covered the 5W1H aspects logically (based on the topic provided, infer what a good summary would look like).
    4. Give a score from 1-100 based on clarity and grammar.

    Return JSON.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: `STUDENT INPUT:\n${userDraft}\n\n${prompt}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctedText: { type: Type.STRING },
          grammarFeedback: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          contentFeedback: { type: Type.STRING },
          overallScore: { type: Type.NUMBER }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as PodcastCorrectionResult;
  }
  throw new Error("Failed to review podcast");
};