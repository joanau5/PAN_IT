export type Entry = {
    id: string;
    createdAt: string; // ISO
    text: string;
    sentiment: number; // 1..5
    emotions: string[]; // up to 3
    topics: string[];   // up to 3
    summary: string;    // <= 20 words
};
