"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function StudioCard({ studio }) {
  const { user, isWishlisted, toggleWishlist } = useAuth();
  const id = studio._id || studio.id;
  const saved = user ? isWishlisted(id) : false;

  const onHeart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to save studios to your wishlist");
      return;
    }
    try {
      const nowSaved = await toggleWishlist(id);
      toast.success(nowSaved ? "Saved to wishlist" : "Removed from wishlist");
    } catch (err) {
      toast.error(err.message || "Could not update wishlist");
    }
  };

  return (
    <article className="card">
      <div className="card-img-wrap">
        <Link href={`/studios/${id}`}>
          <img src={studio.image || studio.images?.[0] || "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80"} alt={studio.title} />
        </Link>
        <span className="badge">{studio.category}</span>
        <span className="rating">★ {studio.rating ?? 4.8}</span>
        <button className={`heart-btn ${saved ? "saved" : ""}`} onClick={onHeart} aria-label="Toggle wishlist">
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <div className="card-body">
        <h3>{studio.title}</h3>
        <p className="muted" style={{ margin: 0 }}>📍 {studio.location}</p>
        <div className="card-foot">
          <span className="price">${studio.hourlyRate} <span>/ hr</span></span>
          <Link href={`/studios/${id}`} className="btn btn-sm">View Details</Link>
        </div>
      </div>
    </article>
  );
}
