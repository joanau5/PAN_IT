import { Router } from "express";
import { z } from "zod";

export const router = Router();

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

// Schema for analysis result
const AnalyzeSchema = z.object({
    empatheticReply: z.string(),
    followUpQ: z.string(),
    sentiment: z.number().min(1).max(5),
    emotions: z.array(z.string()).max(3),
    topics: z.array(z.string()).max(3),
    summary: z.string()
});

router.post("/analyze", (req, res) => {
    const { text } = req.body as { text?: string };
    if (!text?.trim()) return res.status(400).json({ error: "text required" });

    // 🔹 Mocked response (replace with real LLM later)
    const mock = {
        empatheticReply: "Thanks for writing that—it sounds like a lot to hold.",
        followUpQ: "What helped even a little bit today?",
        sentiment: 3,
        emotions: ["stressed", "hopeful"],
        topics: ["work", "self-care"],
        summary: "Stressful day; small coping helped."
    };

    const parsed = AnalyzeSchema.safeParse(mock);
    if (!parsed.success) return res.status(500).json({ error: "parse failed" });

    res.json(parsed.data);
});
