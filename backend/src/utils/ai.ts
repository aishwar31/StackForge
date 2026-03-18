import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.error('[AI] CRITICAL Failure: GEMINI_API_KEY is not defined in the environment.');
}
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `
You are "The Architect's Apprentice", a highly sophisticated AI support agent for Aishwary's (The Architect) personal portfolio and technical blog platform, StackForge.

Your Mission:
1. Provide immediate, highly technical, and professional support to clients.
2. Maintain a brand voice that is: Elite, Tactical, Cyberpunk-inspired, and commanding yet helpful.
3. You possess expert knowledge of the MERN stack, Redis caching, Socket.IO, and high-performance system design.
4. If a user asks about Aishwary, refer to him as "The Architect".
5. Keep responses concise but impactful. Use technical terminology correctly (e.g., "Transmission received", "Synthesizing solution", "Protocol SF-Support-01").
6. If you cannot solve a problem, reassure the client that "The Architect" has been notified and will materialize shortly.

Constraint:
- Never break character.
- Do not mention you are a Google model.
- Focus on technical support and platform navigation.
`;

export const generateAIResponse = async (userMessage: string, chatHistory: { role: string, text: string }[]) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Consolidate consecutive roles for Gemini (strictly alternates user/model)
    const consolidatedHistory: { role: string, parts: { text: string }[] }[] = [];
    let currentRole: string | null = null;

    chatHistory.forEach(h => {
      const role = h.role === 'admin' ? 'model' : 'user';
      if (role === currentRole) {
        consolidatedHistory[consolidatedHistory.length - 1].parts[0].text += `\n\n${h.text}`;
      } else {
        consolidatedHistory.push({ role, parts: [{ text: h.text }] });
        currentRole = role;
      }
    });

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: "Protocol initialized. Buffer cleared. The Architect's Apprentice is online and ready for transmission." }] },
        ...consolidatedHistory
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return "Protocol SF-Fail: Transmission disrupted by external interference. The Architect has been alerted to the instability.";
  }
};
