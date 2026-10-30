"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout, theme, toggleTheme } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="logo">
          <span className="logo-mark">◎</span> StudioSpace
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/" className={isActive("/") ? "active" : ""}>Home</Link>
          <Link href="/studios" className={isActive("/studios") ? "active" : ""}>Explore Studios</Link>
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/#about">About Us</Link>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle light / dark theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {loading ? (
            <span className="muted">Loading…</span>
          ) : !user ? (
            <>
              <Link href="/login" className="btn btn-outline btn-sm hide-sm">Login</Link>
              <Link href="/register" className="btn btn-sm">Register</Link>
            </>
          ) : (
            <div className="dropdown-wrap" ref={ref}>
              <button className="avatar-btn" onClick={() => setOpen((v) => !v)} aria-haspopup="menu">
                {user.photo ? (
                  <img src={user.photo} alt={user.name || "Profile"} className="avatar" />
                ) : (
                  <span className="avatar">{(user.name || user.email || "U")[0].toUpperCase()}</span>
                )}
                <span className="hide-sm">{user.name || "My Account"}</span> ▾
              </button>
              {open && (
                <div className="dropdown">
                  <div className="drop-name">
                    <b>{user.name || "Creator"}</b>
                    <div className="muted" style={{ fontSize: ".85rem", wordBreak: "break-all" }}>{user.email}</div>
                  </div>
                  <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                  <Link href="/add-studio" onClick={() => setOpen(false)}>Add New Studio</Link>
                  <Link href="/my-listings" onClick={() => setOpen(false)}>My Studio Listings</Link>
                  <Link href="/my-bookings" onClick={() => setOpen(false)}>My Bookings</Link>
                  <Link href="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>
                  <button type="button" className="linklike" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
