"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import ConfirmModal from "@/components/ConfirmModal";
import Skeleton from "@/components/Skeleton";

function Content() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/my-listings");
      setStudios(Array.isArray(data) ? data : data.studios || data.listings || []);
    } catch (err) {
      toast.error(err.message || "Could not load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await apiFetch(`/api/studios/${toDelete._id}`, { method: "DELETE" });
      toast.success("Studio deleted successfully");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message || "Could not delete studio");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container section">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div className="section-head" style={{ marginBottom: 0 }}>
          <h2>My Studio Listings</h2>
          <p>Manage the spaces you have listed on StudioSpace.</p>
        </div>
        <Link href="/add-studio" className="btn">Add New Studio</Link>
      </div>
      {loading ? <Skeleton count={3} /> : studios.length === 0 ? (
        <div className="empty" style={{ marginTop: 24 }}>
          <h3>You have no listings yet</h3>
          <p className="muted">List your first studio and start welcoming creators to your space.</p>
          <Link href="/add-studio" className="btn" style={{ marginTop: 12 }}>Add New Studio</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
          {studios.map((s) => (
            <div className="listing-card" key={s._id}>
              <img src={s.image || s.images?.[0]} alt={s.title} />
              <div style={{ flex: 1, minWidth: 220 }}>
                <b>{s.title}</b>
                <div className="muted">{s.category} · {s.location}</div>
                <div><b>${s.hourlyRate}</b> / hr · ★ {s.rating ?? 4.8}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link href={`/studios/${s._id}`} className="btn btn-outline btn-sm">View</Link>
                <Link href={`/studios/edit/${s._id}`} className="btn btn-sm">Update</Link>
                <button className="btn btn-sm" style={{ background: "#dc2626" }} onClick={() => setToDelete(s)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {toDelete && (
        <ConfirmModal
          title="Delete this studio?"
          message={`"${toDelete.title}" will be permanently removed from StudioSpace. This action cannot be undone.`}
          confirmLabel="Delete Studio"
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
          busy={busy}
        />
      )}
    </div>
  );
}

export default function MyListingsPage() {
  return <PrivateRoute><Content /></PrivateRoute>;
}
