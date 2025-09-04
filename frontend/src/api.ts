const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// quick debug 
console.log("API BASE =>", BASE);

export async function getPrompt(): Promise<string> {
    const r = await fetch(`${BASE}/prompt`);
    if (!r.ok) throw new Error("prompt failed");
    const j = await r.json();
    return j.prompt as string;
}

export async function analyzeText(text: string) {
    const r = await fetch(`${BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (!r.ok) throw new Error("analyze failed");
    return r.json();
}
