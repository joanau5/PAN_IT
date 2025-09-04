import { useMemo, useState } from "react";
import { loadEntries, saveEntry, clearEntries } from "../storage";
import type { Entry } from "../types";
import { SAMPLE_ENTRIES } from "../sampleEntries";


import { Line } from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import TagChips from "../components/TagChips";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function Insights() {
    const [version, setVersion] = useState(0); // refresh after seeding/clearing
    const entries = loadEntries();

    const { labels, points, emotionFreq, topicFreq, avgMood } = useMemo(() => {
        const sorted = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        const labels = sorted.map(e => new Date(e.createdAt).toLocaleDateString());
        const points = sorted.map(e => e.sentiment);

        const count = (arr: string[]) =>
            arr.reduce<Record<string, number>>((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});
        const emotionFreq = count(sorted.flatMap(e => e.emotions));
        const topicFreq = count(sorted.flatMap(e => e.topics));

        const avgMood = points.length
            ? Math.round((points.reduce((a, b) => a + b, 0) / points.length) * 10) / 10
            : 0;

        return { labels, points, emotionFreq, topicFreq, avgMood };
    }, [entries, version]);

    const top = (freq: Record<string, number>) =>
        Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([k]) => k).slice(0, 6);

    const chartData = {
        labels,
        datasets: [{ label: "Mood (1–5)", data: points }], // no explicit colors
    };

    function seedSample() {
        SAMPLE_ENTRIES.forEach(s =>
            saveEntry({ id: crypto.randomUUID(), ...s })
        );
        setVersion(v => v + 1);
    }

    function clearAll() {
        clearEntries();
        setVersion(v => v + 1);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Insights</h2>
                <div className="flex items-center gap-3 text-sm">
                    <button onClick={seedSample} className="underline">Load sample data</button>
                    <button onClick={clearAll} className="underline">Clear</button>
                </div>
            </div>

            {/* Tiny stat row */}
            <div className="text-sm text-gray-600">
                Avg mood: <span className="font-medium">{entries.length ? avgMood : "—"}</span> •
                Entries: <span className="font-medium">{entries.length}</span>
            </div>

            {entries.length === 0 ? (
                <div className="p-4 border rounded-2xl bg-gray-50">
                    No entries yet. Try <button onClick={seedSample} className="underline">Load sample data</button> or add one on <span className="font-medium">Write</span>.
                </div>
            ) : (
                <>
                    <div className="p-4 border rounded-2xl">
                        <Line data={chartData} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TagChips title="Top Emotions" items={top(emotionFreq)} />
                        <TagChips title="Top Topics" items={top(topicFreq)} />
                    </div>
                </>
            )}

            <p className="text-xs text-gray-500">Private & local-first. Supportive companion — not medical advice.</p>
        </div>
    );
}
