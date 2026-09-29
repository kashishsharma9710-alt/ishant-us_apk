import { Message, AppSettings, Memory } from "../types";

export interface SendMessageOptions {
  messages: Message[];
  settings: AppSettings;
  memories?: Memory[];
}

export async function sendChatMessage({
  messages,
  settings,
  memories = [],
}: SendMessageOptions): Promise<{ text: string; modelUsed?: string }> {
  const payload = {
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    tone: settings.aiTone,
    language: settings.language,
    model: settings.aiModel || "gemini-3.1-flash-lite",
    memories: memories.slice(-5).map((m) => `${m.title}: ${m.note}`),
  };

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.text) {
      return { text: data.text, modelUsed: data.modelUsed || "Gemini Flash Lite" };
    }
    throw new Error("No response received from Ishant");
  } catch (error: any) {
    console.warn("API request failed, generating client fallback:", error);
    // Intelligent local fallback maintaining Ishant's warm companion persona
    return {
      text: generateClientCompanionFallback(messages, settings.language),
      modelUsed: "local-companion",
    };
  }
}

function generateClientCompanionFallback(messages: Message[], lang: string): string {
  const lastMsg = messages[messages.length - 1]?.content.toLowerCase() || "";

  if (lastMsg.includes("favourite") || lastMsg.includes("pasand") || lastMsg.includes("food")) {
    return "Arey Srishti, mujhe aapki har pasand acche se yaad hai! Chole Bhature, Momos, Green colour, Boys Over Flowers aur Tulips. Batao, aaj inme se kuch lene ka man kar raha hai?";
  }

  if (lastMsg.includes("hello") || lastMsg.includes("hi") || lastMsg.includes("hey") || lastMsg.includes("kaisa") || lastMsg.includes("kaisi")) {
    return "Haan Srishti! Sab badhiya. Aap batao, aaj ka din kaisa chal raha hai?";
  }

  if (lastMsg.includes("khel") || lastMsg.includes("hide and seek")) {
    return "Hide and Seek! Sach me bachpan ki wo innocent yaadein... kabhi kabhi lagta hai thoda sa waisa playful ban jana chahiye sab tension bhool ke.";
  }

  if (lastMsg.includes("song") || lastMsg.includes("gaana") || lastMsg.includes("music")) {
    return "Love Me Like You Do sunne ka man hai kya? Thoda sa volume badha ke eyes close karo aur bas relax ho jao 🎶";
  }

  if (lastMsg.includes("tired") || lastMsg.includes("stress") || lastMsg.includes("thak") || lastMsg.includes("pareshan")) {
    return "Arey, kya hua? Thoda deep breath lo aur relax karo. Jo bhi cheez pareshan kar rahi hai, use ek side rakho abhi ke liye. Ek sip paani piyo aur batao mujhe, kya chal raha hai dimaag me? Main yahin hoon.";
  }

  return "Haan Srishti, bolo na. Main bilkul dhyan se sun raha hoon. Kya baat chal rahi hai aapke man me?";
}
