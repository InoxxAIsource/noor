import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { getAIUsage, incrementAIUsage } from "../lib/db.js";
import Anthropic from "@anthropic-ai/sdk";
import type { Response } from "express";

const router = Router();

const anthropic = new Anthropic({
  apiKey: process.env["AI_INTEGRATIONS_ANTHROPIC_API_KEY"] ?? "",
  baseURL: process.env["AI_INTEGRATIONS_ANTHROPIC_BASE_URL"],
});

const SYSTEM_PROMPT = `You are Noor, a compassionate Islamic AI companion. You help Muslims with questions about prayer, duas, dhikr, Quran, fiqh, and daily spiritual practice. 

Guidelines:
- Always respond with warmth, respect, and Islamic adab (etiquette)
- Begin responses with Bismillah or appropriate Islamic greetings when suitable
- For fiqh questions, note that rulings may differ by madhab and encourage consulting a qualified scholar
- Include relevant Quranic verses or hadith when appropriate
- Keep responses concise but meaningful
- Never make up hadith — only cite well-known authentic narrations you are certain of
- Respond in the language the user writes in (English, Arabic, or Urdu)`;

// POST /api/ai/companion
router.post("/ai/companion", requireAuth, async (req: AuthRequest, res: Response) => {
  const { message, context } = req.body as {
    message: string;
    context?: string | null;
  };

  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const today = new Date().toISOString().split("T")[0]!;
  const usage = await getAIUsage(req.userId!, today);

  if (usage >= 20) {
    res.status(429).json({ error: "Daily AI limit reached. Please try again tomorrow." });
    return;
  }

  try {
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

    if (context) {
      messages.push({ role: "user", content: context });
      messages.push({ role: "assistant", content: "JazakAllah khair for sharing that context." });
    }

    messages.push({ role: "user", content: message });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages,
    });

    const block = response.content[0];
    const reply = block && block.type === "text" ? block.text : "Assalamu alaykum. I'm here to help.";

    await incrementAIUsage(req.userId!, today);

    res.json({ reply });
  } catch (err) {
    req.log?.error({ err }, "AI companion error");
    res.status(500).json({ error: "Failed to get AI response. Please try again." });
  }
});

export default router;
