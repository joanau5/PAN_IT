export default function TagChips({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <div className="text-sm text-gray-600 mb-2">{title}</div>
            <div className="flex flex-wrap gap-2">
                {items.slice(0, 8).map((t) => (
                    <span key={t} className="px-2 py-1 rounded-full bg-gray-200 text-sm">{t}</span>
                ))}
            </div>
        </div>
    );
}
