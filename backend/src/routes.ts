import { Router } from "express";
import { z } from "zod";
import OpenAI from "openai";
import { analyzeLocal } from "./utils/localAnalyzer";

export const router = Router();

/** Toggle modes via env:
 *  USE_LOCAL_ONLY=true  -> heuristic only (no LLM calls)
 *  Otherwise: try Ollama (local LLM). If that fails, try OpenAI (if key present). Then fallback to heuristic.
 */
const USE_LOCAL_ONLY = process.env.USE_LOCAL_ONLY === "true";

// Only init OpenAI client if we might use it
const openaiClient =
    !USE_LOCAL_ONLY && process.env.OPENAI_API_KEY
        ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
        : null;

const PROMPTS = [
    "What emotion felt strongest today, and what sparked it?",
    "What are you proud of today?",
    "What drained your energy, and what restored it?",
    "If a friend lived your day, what advice would you give them?"
];

router.get("/prompt", (_req, res) => {
    const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    res.json({ prompt });
});

const AnalyzeSchema = z.object({
    empatheticReply: z.string(),
    followUpQ: z.string(),
    sentiment: z.number().min(1).max(5),
    emotions: z.array(z.string()).max(3),
    topics: z.array(z.string()).max(3),
    summary: z.string()
});

const SYSTEM_PROMPT = `
You are a private, empathetic journaling companion. Be supportive and non-clinical.
Return STRICT JSON ONLY with this shape:

{
 "empatheticReply": string,
 "followUpQ": string,
 "sentiment": number,   // 1..5 (1=very negative, 3=neutral, 5=very positive)
 "emotions": string[],  // <=3 from ["calm","happy","sad","anxious","angry","tired","hopeful","grateful","stressed","lonely"]
 "topics": string[],    // <=3 concise nouns (e.g., "work","family","self-care")
 "summary": string      // <= 20 words
}

Do not include any text outside JSON. No markdown/code fences. No medical/diagnostic statements.
`.trim();

/* -------------------- Ollama (Local LLM) -------------------- */
// Uses http://localhost:11434 (make sure `ollama serve` is running and you pulled `phi3:mini`)
async function analyzeWithOllama(text: string) {
    const body = {
        model: "phi3:mini",
        options: { temperature: 0.4 },
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: text }
        ],
        format: "json", // force JSON output
        stream: false
    };

    const r = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!r.ok) throw new Error(`ollama http ${r.status}`);
    const j = (await r.json()) as any;
    const content = j?.message?.content ?? "{}";
    return AnalyzeSchema.parse(JSON.parse(content));
}

/* -------------------- OpenAI (Cloud LLM, optional) -------------------- */
async function analyzeWithOpenAI(text: string) {
    if (!openaiClient) throw new Error("OpenAI client unavailable");
    const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: text }
        ],
        response_format: { type: "json_object" }
    });
    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    return AnalyzeSchema.parse(JSON.parse(raw));
}

router.post("/analyze", async (req, res) => {
    const { text } = req.body as { text?: string };
    if (!text?.trim()) return res.status(400).json({ error: "text required" });

    // Heuristic-only mode
    if (USE_LOCAL_ONLY) {
        return res.json(analyzeLocal(text));
    }

    // Try Ollama → then OpenAI → then heuristic
    try {
        const viaOllama = await analyzeWithOllama(text);
        return res.json(viaOllama);
    } catch (e1) {
        console.error("Ollama failed, trying OpenAI:", (e1 as Error)?.message);
        try {
            const viaOpenAI = await analyzeWithOpenAI(text);
            return res.json(viaOpenAI);
        } catch (e2) {
            console.error("OpenAI failed, falling back to heuristic:", (e2 as Error)?.message);
            return res.json(analyzeLocal(text));
        }
    }
});

/* -------------------- Health Route  -------------------- */
router.get("/_health", (_req, res) => {
    const mode = USE_LOCAL_ONLY
        ? "heuristic"
        : openaiClient
            ? "ollama→openai→heuristic"
            : "ollama→heuristic";
    res.json({
        ok: true,
        mode,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY
    });
});
