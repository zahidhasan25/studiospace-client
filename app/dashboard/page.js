"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import { Spinner } from "@/components/Skeleton";

function Content() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ listings: 0, bookings: 0, wishlist: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      apiFetch("/api/my-listings"),
      apiFetch("/api/bookings"),
      apiFetch("/api/wishlist"),
    ]).then(([listings, bookings, wishlist]) => {
      const countOf = (r) => {
        if (r.status !== "fulfilled") return 0;
        const v = r.value;
        return Array.isArray(v) ? v.length : (v.studios?.length ?? v.bookings?.length ?? v.wishlist?.length ?? v.items?.length ?? 0);
      };
      setCounts({ listings: countOf(listings), bookings: countOf(bookings), wishlist: countOf(wishlist) });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="container section"><Spinner /></div>;

  return (
    <div className="container section">
      <h2>Welcome back, {user?.name || "Creator"} 👋</h2>
      <p className="muted">Here is a quick view of your StudioSpace activity.</p>
      <div className="stat-grid" style={{ marginTop: 24 }}>
        <div className="stat"><b>{counts.listings}</b><span className="muted">My Studio Listings</span><div style={{ marginTop: 12 }}><Link href="/my-listings" className="btn btn-sm">Manage Listings</Link></div></div>
        <div className="stat"><b>{counts.bookings}</b><span className="muted">My Bookings</span><div style={{ marginTop: 12 }}><Link href="/my-bookings" className="btn btn-sm">View Bookings</Link></div></div>
        <div className="stat"><b>{counts.wishlist}</b><span className="muted">Saved Studios</span><div style={{ marginTop: 12 }}><Link href="/wishlist" className="btn btn-sm">View Wishlist</Link></div></div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
        <Link href="/add-studio" className="btn">Add New Studio</Link>
        <Link href="/studios" className="btn btn-outline">Explore Studios</Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <PrivateRoute><Content /></PrivateRoute>;
}
