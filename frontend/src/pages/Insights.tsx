import { useMemo } from "react";
import { loadEntries, clearEntries } from "../storage";
import { Line } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip, Legend } from "chart.js";
import TagChips from "../components/TagChips";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function Insights() {
    const entries = loadEntries();

    const { labels, dataPoints, emotionFreq, topicFreq } = useMemo(() => {
        const sorted = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        const labels = sorted.map(e => new Date(e.createdAt).toLocaleDateString());
        const dataPoints = sorted.map(e => e.sentiment);

        const count = (arr: string[]) => arr.reduce<Record<string, number>>((m, k) => (m[k] = (m[k] || 0) + 1, m), {});
        const emotionFreq = count(sorted.flatMap(e => e.emotions));
        const topicFreq = count(sorted.flatMap(e => e.topics));

        return { labels, dataPoints, emotionFreq, topicFreq };
    }, [entries]);

    const top = (freq: Record<string, number>) =>
        Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([k]) => k).slice(0, 6);

    const chartData = {
        labels,
        datasets: [
            { label: "Mood (1-5)", data: dataPoints } // no color specified per chart rules
        ],
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Insights</h2>
                <button
                    onClick={() => { clearEntries(); location.reload(); }}
                    className="text-sm underline"
                >
                    Clear all past entries
                </button>
            </div>

            {entries.length === 0 ? (
                <div className="p-4 border rounded-2xl bg-gray-50">
                    No entries yet. Write your first entry on the <span className="font-medium">Write</span> page.
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
        </div>
    );
}
