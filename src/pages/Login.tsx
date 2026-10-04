import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("demo@shadowassistant.app");
  const [pw, setPw] = useState("ShadowDemo123!");
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "demo@shadowassistant.app" && pw === "ShadowDemo123!") { sessionStorage.setItem("sa-demo", "1"); nav("/dashboard"); }
    else setErr("Email or password doesn't match the demo account.");
  };
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-3" aria-labelledby="t">
        <Link to="/" className="muted">← Back to site</Link>
        <h1 id="t" className="font-display text-2xl">Sign in to the demo workspace</h1>
        <p className="muted">Demo account only. This is not production authentication.</p>
        <label className="block text-sm">Email<input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></label>
        <label className="block text-sm">Password<input className="input mt-1" value={pw} onChange={(e) => setPw(e.target.value)} type="password" /></label>
        {err && <p role="alert" className="text-sm text-red-400">{err}</p>}
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
    </main>
  );
}
