import type { Entry } from "./types";

// Simple hardcoded entries for demoing Insights
export const SAMPLE_ENTRIES: Omit<Entry, "id">[] = [
    {
        createdAt: new Date(Date.now() - 4 * 864e5).toISOString(),
        text: "Deadline stress, gym helped",
        sentiment: 2,
        emotions: ["stressed"],
        topics: ["work", "self-care"],
        summary: "Stress; gym helped",
    },
    {
        createdAt: new Date(Date.now() - 3 * 864e5).toISOString(),
        text: "Walk with friend, felt hopeful",
        sentiment: 4,
        emotions: ["hopeful"],
        topics: ["friends"],
        summary: "Walk lifted mood",
    },
    {
        createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
        text: "Tired but cooked dinner",
        sentiment: 3,
        emotions: ["tired"],
        topics: ["family", "self-care"],
        summary: "Low energy; small win",
    },
    {
        createdAt: new Date(Date.now() - 1 * 864e5).toISOString(),
        text: "Great focus session",
        sentiment: 5,
        emotions: ["happy"],
        topics: ["work"],
        summary: "Flow state",
    },
];
