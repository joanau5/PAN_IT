import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Write from "./pages/Write";
import Insights from "./pages/Insights";

export default function App() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/write" replace />} />
        <Route path="/write" element={<Write />} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </div>
  );
}
