import type { Entry } from "./types";

const KEY = "journal.entries";

export const loadEntries = (): Entry[] => {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
        return [];
    }
};

export const saveEntry = (e: Entry) => {
    const all = loadEntries();
    localStorage.setItem(KEY, JSON.stringify([e, ...all]));
};

export const clearEntries = () => localStorage.removeItem(KEY);
