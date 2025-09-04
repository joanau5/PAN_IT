// Simple, deterministic local analysis for demo
// No external calls which keeps privacy & reliability high.

export type LocalAnalysis = {
    empatheticReply: string;
    followUpQ: string;
    sentiment: number;     // 1..5
    emotions: string[];    // <=3
    topics: string[];      // <=3
    summary: string;       // <=120 chars
};

const EMOTION_WHITELIST = [
    "calm", "happy", "sad", "anxious", "angry", "tired",
    "hopeful", "grateful", "stressed", "lonely", "reflective"
];

// small word lists (tune freely)
const POS_WORDS = ["calm", "grateful", "hopeful", "happy", "proud", "relaxed", "content", "excited"];
const NEG_WORDS = ["stressed", "anxious", "angry", "sad", "tired", "overwhelmed", "lonely", "frustrated", "worried"];
const TOPIC_HINTS = [
    "work", "school", "family", "friends", "health", "self-care", "self care",
    "finance", "money", "study", "deadline", "meeting", "exercise", "sleep", "relationship"
];

// normalize helpers
const norm = (s: string) => s.toLowerCase();

// naive sentiment: base 3, +/- hits capped at 2 each side
function scoreSentiment(t: string) {
    const posHits = POS_WORDS.filter(w => t.includes(w)).length;
    const negHits = NEG_WORDS.filter(w => t.includes(w)).length;
    let score = 3 + Math.min(2, posHits) - Math.min(2, negHits);
    return Math.max(1, Math.min(5, score));
}

function pickEmotions(t: string, sentiment: number) {
    const found = [...NEG_WORDS, ...POS_WORDS]
        .filter(w => t.includes(w))
        .map(w => (w === "self care" ? "self-care" : w))
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .slice(0, 3);

    if (found.length) {
        return found
            .map(e => (EMOTION_WHITELIST.includes(e) ? e : null))
            .filter(Boolean) as string[];
    }

    // fallback based on sentiment
    if (sentiment <= 2) return ["stressed"];
    if (sentiment >= 4) return ["hopeful"];
    return ["reflective"];
}

function pickTopics(t: string) {
    const topics = TOPIC_HINTS
        .filter(k => t.includes(k))
        .map(k => (k === "self care" ? "self-care" : k))
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .slice(0, 3);
    return topics.length ? topics : ["journaling"];
}

function summarize(raw: string) {
    const oneLine = raw.replace(/\s+/g, " ").trim();
    const first = oneLine.split(/[.!?]/)[0] || oneLine;
    return first.slice(0, 120) || "Short reflection written.";
}

export function analyzeLocal(text: string): LocalAnalysis {
    const t = norm(text);
    const sentiment = scoreSentiment(t);
    const emotions = pickEmotions(t, sentiment);
    const topics = pickTopics(t);
    const summary = summarize(text);

    const empatheticReply =
        sentiment <= 2
            ? "Thanks for opening up. That sounds heavy, and it makes sense you feel this way. I'm glad you wrote it down."
            : sentiment >= 4
                ? "I can hear some bright spots today. It's great you noticed what helped and gave yourself credit."
                : "Thank you for sharing. It sounds like there were mixed moments—you showed up and that matters.";

    const followUpQ =
        topics.includes("self-care")
            ? "What small act of care could you repeat tomorrow?"
            : "What helped even a little today, and can you build on it tomorrow?";

    return { empatheticReply, followUpQ, sentiment, emotions, topics, summary };
}
