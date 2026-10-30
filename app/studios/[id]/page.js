"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import BookingModal from "@/components/BookingModal";
import { Spinner } from "@/components/Skeleton";

export default function StudioDetailsPage({ params }) {
  const id = params.id;
  const { user } = useAuth();
  const router = useRouter();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    apiFetch(`/api/studios/${id}`)
      .then((data) => setStudio(data.studio || data))
      .catch((err) => setError(err.message || "Studio not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container section"><Spinner /></div>;
  if (error || !studio) {
    return (
      <div className="container section">
        <div className="empty">
          <h3>Studio not found</h3>
          <p className="muted">{error || "This listing may have been removed."}</p>
          <Link href="/studios" className="btn" style={{ marginTop: 12 }}>Browse Studios</Link>
        </div>
      </div>
    );
  }

  const images = studio.images?.length ? studio.images : [studio.image].filter(Boolean);
  const reviews = [
    { name: "Maya Rahman", text: `The light in ${studio.title} was beautiful all afternoon, and the host had everything ready before we arrived. We finished our shoot ahead of schedule.` },
    { name: "Arif Chowdhury", text: "Clean, quiet and exactly as described. The equipment list was accurate and check-in took less than five minutes." },
    { name: "Sara Kim", text: "A comfortable, professional space that made our whole team feel welcome. I would happily book this studio again." },
  ];

  return (
    <div className="container section">
      <Link href="/studios" className="muted">← Back to Explore Studios</Link>
      <div className="detail-grid" style={{ marginTop: 18 }}>
        <div>
          {images.length > 1 ? (
            <Swiper modules={[Pagination]} pagination={{ clickable: true }}>
              {images.map((img, i) => (
                <SwiperSlide key={i}><img src={img} alt={`${studio.title} view ${i + 1}`} className="detail-img" /></SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img src={images[0]} alt={studio.title} className="detail-img" />
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <span className="badge">{studio.category}</span>
            <span className="rating">★ {studio.rating ?? 4.8} ({studio.reviewsCount ?? reviews.length} reviews)</span>
            <span className="badge">📍 {studio.location}</span>
          </div>
          <h1 style={{ marginTop: 18 }}>{studio.title}</h1>
          <p>{studio.overview}</p>
          <div className="spec-grid">
            <div className="spec"><b>Hourly Rate</b>${studio.hourlyRate} / hr</div>
            <div className="spec"><b>Security Deposit</b>${studio.deposit ?? 0}</div>
            <div className="spec"><b>Max Capacity</b>{studio.capacity} people</div>
            <div className="spec"><b>Location</b>{studio.location}</div>
          </div>
          <h3>Amenities</h3>
          <div>
            {(studio.amenities || []).length ? studio.amenities.map((a) => <span key={a} className="tag">✓ {a}</span>) : <p className="muted">Amenities will be confirmed by the host before your booking.</p>}
          </div>
          <h3 style={{ marginTop: 28 }}>Host</h3>
          <div style={{ display: "flex", gap: 14, alignItems: "center", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
            {studio.ownerPhoto ? <img src={studio.ownerPhoto} alt={studio.ownerName} className="avatar-lg" /> : <span className="avatar-lg">{(studio.ownerName || "H")[0]}</span>}
            <div>
              <b>{studio.ownerName || "Studio Host"}</b>
              <div className="muted">{studio.ownerEmail}</div>
            </div>
          </div>
          <h3 style={{ marginTop: 28 }}>Creator Reviews</h3>
          {reviews.map((r) => (
            <div className="review" key={r.name}>
              <b>{r.name}</b> <span className="muted">· ★★★★★</span>
              <p style={{ margin: "6px 0 0" }}>{r.text}</p>
            </div>
          ))}
        </div>
        <aside className="book-card">
          <div className="price" style={{ fontSize: "1.6rem", fontWeight: 900 }}>${studio.hourlyRate} <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--muted)" }}>/ hr</span></div>
          <p className="muted">Deposit: ${studio.deposit ?? 0} · Capacity: {studio.capacity} people</p>
          <button
            className="btn"
            style={{ width: "100%" }}
            onClick={() => {
              if (!user) {
                toast.error("Please login to book a studio");
                router.push(`/login?next=${encodeURIComponent(`/studios/${id}`)}`);
                return;
              }
              setShowBooking(true);
            }}
          >
            Book Workspace Now
          </button>
          {user && (
            <Link href="/my-bookings" className="btn btn-outline" style={{ width: "100%", marginTop: 10 }}>View My Bookings</Link>
          )}
          <p className="muted" style={{ fontSize: ".9rem", marginBottom: 0 }}>
            Transparent hourly pricing. Your booking starts as Pending and is confirmed by the host.
          </p>
        </aside>
      </div>
      {showBooking && (
        <BookingModal studio={studio} onClose={() => setShowBooking(false)} onBooked={() => router.push("/my-bookings")} />
      )}
    </div>
  );
}
