import { Link, useLocation } from "react-router-dom";

export default function Nav() {
    const { pathname } = useLocation();
    const tab = (to: string, label: string) => (
        <Link
            to={to}
            className={`px-3 py-2 rounded-xl ${pathname === to ? "bg-black text-white" : "bg-gray-200"}`}
        >
            {label}
        </Link>
    );

    return (
        <nav className="w-full flex items-center justify-between py-4">
            <div className="font-bold">Journaling Companion</div>
            <div className="flex gap-2">{tab("/write", "Write")}{tab("/insights", "Insights")}</div>
        </nav>
    );
}
