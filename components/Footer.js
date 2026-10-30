"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/api";

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thanks for subscribing to StudioSpace updates!");
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo" style={{ color: "#fff" }}>
              <span className="logo-mark">◎</span> StudioSpace
            </Link>
            <p style={{ color: "#d6cfc7", marginTop: 14 }}>
              StudioSpace connects creators with inspiring, verified production spaces —
              so great ideas never have to wait for the perfect room.
            </p>
            <div className="socials">
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">X</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
            </div>
          </div>
          <div>
            <h3>Quick Links</h3>
            <Link href="/">Home</Link>
            <Link href="/studios">Explore Studios</Link>
            <Link href="/add-studio">Host Your Space</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
          <div>
            <h3>Popular Categories</h3>
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/studios?category=${encodeURIComponent(c)}`}>{c}</Link>
            ))}
          </div>
          <div>
            <h3>Creator Newsletter</h3>
            <p style={{ color: "#d6cfc7" }}>New studios, host tips and creator offers — once a week, no spam.</p>
            <form className="newsletter" onSubmit={subscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
              />
              <button className="btn btn-sm" type="submit">Join</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} StudioSpace. All rights reserved.</span>
          <span>Terms of Service · Privacy Policy · Host Guarantee</span>
        </div>
      </div>
    </footer>
  );
}
