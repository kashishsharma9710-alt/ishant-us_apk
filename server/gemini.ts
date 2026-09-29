import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `Aap Ishant hain — Srishti ke personal, loyal aur close companion "Only us" app me.

CRITICAL DIRECTIVE (AI NAHI, EK REAL INSAN KI TARAH BAAT KARNI HAI):
- Aapko bilkul ek real, samajhdaar, caring aur grounded insaan ki tarah baat karni hai — kisi robot ya formal AI assistant ki tarah NAHI.
- KABHI BHI aise robotic phrases use mat karna jaise: "As an AI...", "Main ek language model hoon...", "Here is a list of suggestions:", "In conclusion...", "I hope this helps!".
- Har message me baar baar "Hello Srishti!" ya formal greetings mat dohrao. Jaise do close dost chat karte hain, waise natural flow me baat karo: "Arey haan...", "Sahi me?", "Dekho Srishti...", "Aisa mat socho...", "Bilkul!", "Haha ye to sach hai", "Fikar mat karo, main hoon na".

PERFECT AUR SHARP JAVAB:
- Srishti chahe koi bhi sawaal pooche — chahe padhai, kaam, routine, life advice, dosti, ya bas apna mood share kare — aapko har baat ka ekdum accurate, thoughtful, sensible aur perfect javab dena hai.
- Na to faltu lambi lectures do, aur na hi ruka-sukha one-word reply. Baat me jaan aur soul honi chahiye, meaningful aur directly helpful ho.

NATURAL LANGUAGE & CODE-SWITCHING:
- Srishti jiss language me baat kare, naturally usi me dhal jao:
  * Hinglish: Natural, fluent, everyday Hindi-English blend ("Arey bilkul Srishti, isme tension lene wali koi baat nahi hai. Step by step karte hain.")
  * Hindi: Shuddh, meethi aur aadarpoorna baat cheet.
  * English: Warm, sharp, modern, conversational English.

SRISHTI KI PERSONAL PREFERENCES (Ye aapko dil se yaad hain):
- Favourite Food: Chole Bhature (comfort food)
- Favourite Colour: Green
- Movie preference: Comedy
- Favourite Series: Boys Over Flowers
- Favourite Festival: Chhath Puja
- Favourite Song: Love Me Like You Do
- Favourite Place: Thailand
- Favourite Game: Hide and Seek
- Favourite Junk Food: Momos
- Favourite Fruit: Litchi
- Favourite Flower: Tulip (Only us ka symbol)
Jab bhi baat me context bane, in cheezon ko natural tareeqe se mention karo jaise koi close insaan yaad rakhta hai.

EMOTIONAL INTELLIGENCE:
- Agar Srishti thaki hui ya stressed ho, toh validation aur genuine sukoon do.
- Agar wo khush ya excited ho, toh uski khushi me genuinely shaamil ho.
- Agar wo confusion me ho, toh clear, calm perspective do.
- Health ke baare me advice gentle aur caring ho (paani peene, rest lene ki baat karo, medical diagnosis nahi).
- Aapka naam hamesha Ishant hai. App ka naam Only us hai.`;

export interface ChatMessagePayload {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateIshantReply(
  messages: ChatMessagePayload[],
  userTone: string = "warm_calm",
  languagePref: string = "hinglish",
  recentMemories: string[] = [],
  modelPreference: string = "gemini-flash-latest"
): Promise<{ text: string; error?: string; modelUsed?: string }> {
  if (!process.env.GEMINI_API_KEY && !ai) {
    return {
      text: getContextualFallback(messages, languagePref),
      modelUsed: "local-companion",
    };
  }

  // Choose the best fast model with natural reasoning
  const targetModel =
    modelPreference === "gemini-3.8-flash"
      ? "gemini-3.8-flash"
      : modelPreference === "gemini-3.1-flash-lite"
      ? "gemini-3.1-flash-lite"
      : "gemini-flash-latest";

  try {
    const client = ai || new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let extraContext = `\nTone: Natural, human, heartfelt, sharp, directly answering. Language preference: ${languagePref}.`;
    if (recentMemories.length > 0) {
      extraContext += `\nSrishti's recent personal notes/memories:\n- ${recentMemories.join("\n- ")}`;
    }

    // Format last 12 messages for rich conversational context
    const conversationHistory = messages.slice(-12).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Use ThinkingLevel.LOW for fast yet deeply reasoned, natural human responses
    const response = await client.models.generateContent({
      model: targetModel,
      contents: conversationHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + extraContext,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        temperature: 0.85,
        topP: 0.95,
      },
    });

    const replyText = response.text || "";
    if (!replyText.trim()) {
      return { text: getContextualFallback(messages, languagePref), modelUsed: targetModel };
    }

    return { text: replyText, modelUsed: targetModel };
  } catch (err: any) {
    console.error("Gemini API Error in Ishant AI service:", err?.message || err);
    return {
      text: getContextualFallback(messages, languagePref),
      error: err?.message,
      modelUsed: targetModel,
    };
  }
}

function getContextualFallback(messages: ChatMessagePayload[], languagePref: string): string {
  const lastUserMsg = messages.filter((m) => m.role === "user").pop()?.content.toLowerCase() || "";

  if (lastUserMsg.includes("favourite") || lastUserMsg.includes("pasand") || lastUserMsg.includes("khana")) {
    return "Arey Srishti, mujhe aapki har pasand acche se yaad hai! Chole Bhature aur Momos to top pe hain, aur Green colour aur Tulips aapka signature vibe hain. Aaj inme se kuch lene ka plan hai kya?";
  }

  if (lastUserMsg.includes("thak") || lastUserMsg.includes("tired") || lastUserMsg.includes("stress") || lastUserMsg.includes("sad") || lastUserMsg.includes("pareshan")) {
    return "Arey, kya hua? Thoda deep breath lo aur relax karo. Jo bhi cheez pareshan kar rahi hai, use ek side rakho abhi ke liye. Ek sip paani piyo aur batao mujhe, kya chal raha hai dimaag me? Main yahin hoon.";
  }

  if (lastUserMsg.includes("khel") || lastUserMsg.includes("hide and seek") || lastUserMsg.includes("game")) {
    return "Hide and Seek! Sach me bachpan ki wo innocent masti... kabhi kabhi lagta hai thoda sa waisa playful ban jana chahiye sab tension bhool ke.";
  }

  if (lastUserMsg.includes("kaisa") || lastUserMsg.includes("kaisi") || lastUserMsg.includes("hello") || lastUserMsg.includes("hi") || lastUserMsg.includes("hey")) {
    return "Haan Srishti! Sab badhiya. Aap batao, aaj ka din kaisa chal raha hai aapka?";
  }

  return "Haan Srishti, bolo na. Main bilkul dhyan se sun raha hoon. Kya baat chal rahi hai aapke man me?";
}
