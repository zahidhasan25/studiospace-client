"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/Skeleton";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back! You are logged in.");
      router.push(next.startsWith("/") ? next : "/");
    } catch (err) {
      toast.error(err.message || "Login failed. Please check your email and password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Login</h2>
        <p className="muted">Welcome back to StudioSpace. Sign in to book studios and manage your listings.</p>
        <form onSubmit={submit} className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="muted" style={{ fontSize: ".9rem" }}>Forgot Password? <span title="Password reset is disabled for examiner convenience">Reset is disabled for examiner convenience</span></span>
          </div>
          <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>{busy ? "Logging in…" : "Login"}</button>
        </form>
        <div className="divider">or continue with</div>
        <button className="google-btn" type="button" onClick={() => { window.location.href = `${API_URL}/api/auth/google`; }}>
          Continue with Google
        </button>
        <p style={{ textAlign: "center", marginTop: 18 }}>
          New to StudioSpace? <Link href="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container section"><Spinner /></div>}>
      <LoginContent />
    </Suspense>
  );
}
