"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch, studioIdOf, studioOf } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import StudioCard from "@/components/StudioCard";
import Skeleton from "@/components/Skeleton";

function Content() {
  const { refreshWishlist } = useAuth();
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/api/wishlist");
        const items = Array.isArray(data) ? data : data.wishlist || data.items || [];
        const resolved = [];
        for (const item of items) {
          const studio = studioOf(item);
          if (studio.title) {
            resolved.push(studio);
          } else {
            try {
              const full = await apiFetch(`/api/studios/${studioIdOf(item)}`);
              resolved.push(full.studio || full);
            } catch {
              // Skip wishlist entries whose studio no longer exists.
            }
          }
        }
        setStudios(resolved);
      } catch (err) {
        toast.error(err.message || "Could not load wishlist");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container section">
      <div className="section-head">
        <h2>My Wishlist</h2>
        <p>Studios you saved for a future shoot.</p>
      </div>
      {loading ? <Skeleton count={3} /> : studios.length === 0 ? (
        <div className="empty">
          <h3>No saved studios yet</h3>
          <p className="muted">Tap the heart on any studio card to save it here.</p>
          <Link href="/studios" className="btn" style={{ marginTop: 12 }}>Explore Studios</Link>
        </div>
      ) : (
        <div className="grid">
          {studios.map((s) => <StudioCard key={s._id || s.id} studio={s} />)}
        </div>
      )}
      <p className="muted" style={{ marginTop: 16 }}>
        Removing a studio from your wishlist is done with the heart button on its card.
      </p>
      <button className="btn btn-outline btn-sm" onClick={refreshWishlist}>Refresh Wishlist</button>
    </div>
  );
}

export default function WishlistPage() {
  return <PrivateRoute><Content /></PrivateRoute>;
}
