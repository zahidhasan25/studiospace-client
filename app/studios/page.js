"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch, CATEGORIES } from "@/lib/api";
import StudioCard from "@/components/StudioCard";
import Skeleton, { Spinner } from "@/components/Skeleton";

function StudiosContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const query = params.toString();
    apiFetch(`/api/studios${query ? `?${query}` : ""}`)
      .then((data) => setStudios(Array.isArray(data) ? data : data.studios || []))
      .catch((err) => setError(err.message || "Could not load studios"))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="container section">
      <div className="section-head">
        <h2>Explore Studios</h2>
        <p>Filter by category or search by title and location to find your next creative space.</p>
      </div>
      <div className="filters">
        <input
          type="search"
          placeholder="Search studios or locations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search studios"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {loading ? <Skeleton count={6} /> : error ? (
        <div className="empty"><h3>Could not load studios</h3><p className="muted">{error}</p></div>
      ) : studios.length === 0 ? (
        <div className="empty">
          <h3>No studios match your search</h3>
          <p className="muted">Try a different keyword or category — or list a space of your own.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
            <button className="btn btn-outline" onClick={() => { setSearch(""); setCategory(""); }}>Clear Filters</button>
            <Link href="/add-studio" className="btn">Host Your Space</Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {studios.map((s) => <StudioCard key={s._id || s.id} studio={s} />)}
        </div>
      )}
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<div className="container section"><Spinner /></div>}>
      <StudiosContent />
    </Suspense>
  );
}
