"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_URL, apiFetch } from "@/lib/api";

function validatePassword(password) {
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const error = validatePassword(password);
    setPasswordError(error);
    if (error) return;
    setBusy(true);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, photo, password }),
      });
      toast.success("Registration successful! Please login to continue.");
      router.push("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Register</h2>
        <p className="muted">Join StudioSpace to book creative spaces or list your own studio.</p>
        <form onSubmit={submit} className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="field">
            <label htmlFor="reg-name">Name</label>
            <input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="reg-email">Email</label>
            <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="reg-photo">Photo URL</label>
            <input id="reg-photo" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://…" />
          </div>
          <div className="field">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(validatePassword(e.target.value)); }}
              required
            />
            {passwordError && <span className="field-error">{passwordError}</span>}
            <span className="muted" style={{ fontSize: ".85rem" }}>At least 6 characters, with one uppercase and one lowercase letter.</span>
          </div>
          <button className="btn" type="submit" disabled={busy} style={{ width: "100%" }}>{busy ? "Creating account…" : "Register"}</button>
        </form>
        <div className="divider">or continue with</div>
        <button className="google-btn" type="button" onClick={() => { window.location.href = `${API_URL}/api/auth/google`; }}>
          Continue with Google
        </button>
        <p style={{ textAlign: "center", marginTop: 18 }}>
          Already have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
