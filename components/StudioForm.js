"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AMENITIES, CATEGORIES } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function StudioForm({ initial, onSubmit, submitLabel, busy }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: initial?.title || "",
    category: initial?.category || CATEGORIES[0],
    hourlyRate: initial?.hourlyRate ?? "",
    deposit: initial?.deposit ?? "",
    capacity: initial?.capacity ?? "",
    location: initial?.location || "",
    image: initial?.image || initial?.images?.[0] || "",
    overview: initial?.overview || "",
    amenities: initial?.amenities || [],
  });
  const [uploading, setUploading] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleAmenity = (name) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(name)
        ? f.amenities.filter((a) => a !== name)
        : [...f.amenities, name],
    }));

  const uploadImage = async (file) => {
    const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
    if (!key) {
      toast.error("Image upload needs NEXT_PUBLIC_IMGBB_KEY. Paste an image URL instead.");
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message || "Image upload failed");
      set("image", data.data.url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.location.trim() || !form.image.trim()) {
      toast.error("Title, location and an image URL are required");
      return;
    }
    onSubmit({
      ...form,
      hourlyRate: Number(form.hourlyRate),
      deposit: Number(form.deposit || 0),
      capacity: Number(form.capacity || 1),
    });
  };

  return (
    <form onSubmit={submit} className="form-grid">
      <div className="field full">
        <label htmlFor="sf-title">Title</label>
        <input id="sf-title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Sunlit Photo Studio with Cyc Wall" required />
      </div>
      <div className="field">
        <label htmlFor="sf-category">Category</label>
        <select id="sf-category" value={form.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="sf-rate">Hourly Rate ($)</label>
        <input id="sf-rate" type="number" min="1" value={form.hourlyRate} onChange={(e) => set("hourlyRate", e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="sf-deposit">Security Deposit ($)</label>
        <input id="sf-deposit" type="number" min="0" value={form.deposit} onChange={(e) => set("deposit", e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="sf-capacity">Max Capacity</label>
        <input id="sf-capacity" type="number" min="1" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} required />
      </div>
      <div className="field full">
        <label htmlFor="sf-location">Location / Address</label>
        <input id="sf-location" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Green Avenue, Dhaka" required />
      </div>
      <div className="field full">
        <label htmlFor="sf-image">Image URL</label>
        <input id="sf-image" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" required />
      </div>
      <div className="field full">
        <label htmlFor="sf-upload">Or upload an image (imgbb)</label>
        <input id="sf-upload" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
        {uploading && <span className="muted">Uploading image…</span>}
        {form.image && <img src={form.image} alt="Studio preview" style={{ height: 160, objectFit: "cover", borderRadius: 12, marginTop: 8 }} />}
      </div>
      <div className="field full">
        <span style={{ fontWeight: 700, fontSize: ".92rem" }}>Amenities</span>
        <div className="check-grid">
          {AMENITIES.map((a) => (
            <label key={a}>
              <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} /> {a}
            </label>
          ))}
        </div>
      </div>
      <div className="field full">
        <label htmlFor="sf-overview">Detailed Overview</label>
        <textarea id="sf-overview" rows={5} value={form.overview} onChange={(e) => set("overview", e.target.value)} placeholder="Describe the space, light, equipment and what creators can make here." required />
      </div>
      <div className="field">
        <label>Host Name (read-only)</label>
        <input value={initial?.ownerName || user?.name || ""} readOnly />
      </div>
      <div className="field">
        <label>Host Email (read-only)</label>
        <input value={initial?.ownerEmail || user?.email || ""} readOnly />
      </div>
      <div className="field full">
        <button className="btn" type="submit" disabled={busy || uploading} style={{ width: "100%" }}>
          {busy ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
