type AnalyzeResponse = {
    empatheticReply: string;
    followUpQ: string;
    sentiment: number;
    emotions: string[];
    topics: string[];
    summary: string;
};

export async function getPrompt(): Promise<string> {
    const res = await fetch("/api/prompt");
    const data = await res.json();
    return data.prompt as string;
}

export async function analyzeText(text: string): Promise<AnalyzeResponse> {
    const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Analyze failed");
    return res.json();
}
