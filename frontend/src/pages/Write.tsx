import { useEffect, useState } from "react";
import { analyzeText, getPrompt } from "../api";
import { saveEntry } from "../storage";
import type { Entry } from "../types";

export default function Write() {
    const [prompt, setPrompt] = useState<string>("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [aiReply, setAiReply] = useState<string>("");
    const [followUp, setFollowUp] = useState<string>("");

    useEffect(() => {
        getPrompt().then(setPrompt).catch(() => setPrompt("What emotion felt strongest today, and what event do you believe sparked it?"));
    }, []);

    async function onSubmit() {
        if (!text.trim()) return;
        setLoading(true);
        try {
            const ai = await analyzeText(text);
            const entry: Entry = {
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                text,
                sentiment: ai.sentiment,
                emotions: ai.emotions,
                topics: ai.topics,
                summary: ai.summary,
            };
            saveEntry(entry);
            setAiReply(ai.empatheticReply);
            setFollowUp(ai.followUpQ);
            setText("");
        } catch (e) {
            setAiReply("Entry saved. Unfortunately something went wrong analyzing it. Will try again soon.");
            setFollowUp("");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4">
            <div className="rounded-2xl p-4 bg-blue-50 border">
                <div className="text-sm text-gray-600">Prompt of the day</div>
                <div className="font-medium">{prompt}</div>
            </div>

            <textarea
                className="w-full min-h-40 p-3 border rounded-2xl focus:outline-none focus:ring-2"
                placeholder="Write freely. I'll reflect with you shortly after."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <button
                onClick={onSubmit}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-60"
            >
                {loading ? "Saving & Reflecting..." : "Save & Reflect"}
            </button>

            {(aiReply || followUp) && (
                <div className="rounded-2xl p-4 bg-gray-50 border">
                    {aiReply && <p className="mb-2">{aiReply}</p>}
                    {followUp && <p className="text-sm text-gray-700">🧠 {followUp}</p>}
                </div>
            )}

            <p className="text-xs text-gray-500">Note: Local-first. Your entries stay in your browser by default.</p>
        </div>
    );
}
