import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { isAuthed } from "./lib/api";
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Shell = lazy(() => import("./pages/Shell"));
const Guard = ({ children }: { children: JSX.Element }) => (isAuthed() ? children : <Navigate to="/login" replace />);

export default function App() {
  return (
    <Suspense fallback={<p className="p-8 muted">Loading…</p>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        {["dashboard", "inbox", "auto-replies", "keyword-automations", "integrations", "settings", "contact"].map((p) => (
          <Route key={p} path={`/${p}`} element={<Guard><Shell page={p} /></Guard>} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
