"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { apiFetch, CATEGORIES } from "@/lib/api";
import StudioCard from "@/components/StudioCard";
import Skeleton from "@/components/Skeleton";

const HERO = [
  {
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1800&q=80",
    title: "Create in spaces built for your best work",
    text: "Book photography studios, film stages and podcast rooms by the hour — from verified hosts, with clear pricing and no surprises.",
  },
  {
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=80",
    title: "Sound stages, lights and cameras — ready when you are",
    text: "From cinema sound stages to intimate music suites, find a production-ready space and start creating the same day.",
  },
  {
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1800&q=80",
    title: "Podcast, record and share your story",
    text: "Quiet, treated rooms with professional microphones, mixers and comfortable seating for hosts and guests.",
  },
  {
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1800&q=80",
    title: "Workshops where ideas take shape",
    text: "Bright art workshops and maker spaces for classes, shoots, exhibitions and hands-on creative sessions.",
  },
];

const CATEGORY_META = {
  "Photo Studio": { emoji: "📷", blurb: "Cyc walls, daylight and pro lighting" },
  "Film Stage": { emoji: "🎬", blurb: "Sound stages and cinema-ready sets" },
  "Podcast Lounge": { emoji: "🎙️", blurb: "Quiet rooms and broadcast mics" },
  "Music Suite": { emoji: "🎵", blurb: "Treated rooms and recording gear" },
  Workshop: { emoji: "🎨", blurb: "Bright spaces for making and teaching" },
};

const STEPS = [
  { title: "Discover Spaces", text: "Search by category, location and budget, then compare real photos, amenities and host details." },
  { title: "Select Shoot Hours", text: "Pick your date and the exact hours you need — pay only for the time you actually use." },
  { title: "Book Instantly", text: "Send a booking request in seconds. The host confirms your slot and you get a clear receipt." },
  { title: "Create & Produce", text: "Arrive, set up and make something great — with host support on hand if you need it." },
];

const GUARANTEES = [
  { emoji: "🛡️", title: "Liability Protection", text: "Eligible bookings are covered by host liability protection for peace of mind on set." },
  { emoji: "✅", title: "Verified Profiles", text: "Hosts and listings are checked so you know who you are booking with before you arrive." },
  { emoji: "🎛️", title: "Equipment Safety", text: "Studios list their gear clearly, and hosts keep equipment maintained and ready to use." },
  { emoji: "💬", title: "24/7 Host Support", text: "Questions before, during or after a shoot? Support and host help are available around the clock." },
];

export default function HomePage() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    apiFetch("/api/studios?limit=6")
      .then((data) => setStudios(Array.isArray(data) ? data : data.studios || []))
      .catch((err) => setLoadError(err.message || "Could not load studios"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="hero">
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000 }} pagination={{ clickable: true }} loop>
            {HERO.map((slide) => (
              <SwiperSlide key={slide.title}>
                <div className="hero-slide">
                  <img src={slide.image} alt={slide.title} />
                  <div className="hero-content">
                    <h1>{slide.title}</h1>
                    <p>{slide.text}</p>
                    <div className="hero-actions">
                      <Link href="/studios" className="btn">Explore Studios</Link>
                      <Link href="/add-studio" className="btn btn-light">Host Your Space</Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="section-head">
          <h2>Featured Studios</h2>
          <p>Top-rated and newest spaces from creators in the community — updated live from the StudioSpace catalogue.</p>
        </div>
        {loading ? <Skeleton count={6} /> : loadError ? (
          <div className="empty">
            <h3>Studios are on their way</h3>
            <p className="muted">{loadError}. Please make sure the StudioSpace server is running, then try again.</p>
            <Link href="/studios" className="btn" style={{ marginTop: 12 }}>Explore Studios</Link>
          </div>
        ) : studios.length === 0 ? (
          <div className="empty">
            <h3>No featured studios yet</h3>
            <p className="muted">Be the first to list a creative space for other creators to discover.</p>
            <Link href="/add-studio" className="btn" style={{ marginTop: 12 }}>Host Your Space</Link>
          </div>
        ) : (
          <div className="grid">
            {studios.slice(0, 6).map((s) => <StudioCard key={s._id || s.id} studio={s} />)}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Browse by Studio Categories</h2>
          <p>Choose a kind of space and jump straight to matching listings.</p>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/studios?category=${encodeURIComponent(c)}`} className="cat-card">
              <div className="emoji">{CATEGORY_META[c]?.emoji}</div>
              <h3 style={{ margin: "10px 0 4px" }}>{c === "Photo Studio" ? "Photo Studios" : c === "Film Stage" ? "Sound Stages" : c === "Podcast Lounge" ? "Podcast Rooms" : c === "Music Suite" ? "Music Suites" : "Art Workshops"}</h3>
              <p className="muted" style={{ margin: 0 }}>{CATEGORY_META[c]?.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="section-head">
          <h2>How Booking Works</h2>
          <p>Four simple steps from finding a space to finishing your production.</p>
        </div>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step" key={s.title}>
              <div className="step-num">{i + 1}</div>
              <h3>{s.title}</h3>
              <p className="muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="about">
        <div className="guarantee">
          <h2 style={{ color: "#fff" }}>Host Guarantee &amp; Creator Support</h2>
          <p style={{ color: "#d6cfc7" }}>
            StudioSpace is built for creators on both sides of a booking. Hosts share spaces they are proud of,
            and guests book with clear terms, verified hosts and help when it matters.
          </p>
          <div className="guarantee-grid">
            {GUARANTEES.map((g) => (
              <div key={g.title}>
                <div style={{ fontSize: "1.8rem" }}>{g.emoji}</div>
                <h3 style={{ color: "#fff", margin: "10px 0 6px" }}>{g.title}</h3>
                <p style={{ color: "#d6cfc7", margin: 0 }}>{g.text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, background: "rgba(255,255,255,.08)", borderRadius: 16, padding: 22 }}>
            <h3 style={{ color: "#fff" }}>About StudioSpace</h3>
            <p style={{ color: "#d6cfc7", margin: 0 }}>
              StudioSpace is a peer-to-peer marketplace for creative workspaces. Photographers, filmmakers,
              podcasters, musicians and artists can discover production-ready rooms, while studio owners earn
              from spaces that would otherwise sit empty. Every listing shows honest pricing, real amenities
              and the host behind the space.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
