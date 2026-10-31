"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import Skeleton from "@/components/Skeleton";

async function downloadInvoice(booking) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text("StudioSpace — Booking Invoice", 14, 20);
  doc.setFontSize(12);
  doc.text(`Studio: ${booking.studioTitle || "Studio booking"}`, 14, 36);
  doc.text(`Booked by: ${booking.userEmail || ""}`, 14, 46);
  doc.text(`Date: ${booking.date || ""}`, 14, 56);
  doc.text(`Time: ${booking.startTime || ""} - ${booking.endTime || ""} (${booking.hours || ""} hours)`, 14, 66);
  doc.text(`Total price: $${booking.totalPrice ?? ""}`, 14, 76);
  doc.text(`Status: ${booking.status || ""}`, 14, 86);
  doc.text("Thank you for booking with StudioSpace.", 14, 102);
  doc.save(`studiospace-invoice-${booking._id || "booking"}.pdf`);
  toast.success("Invoice downloaded");
}

function Content() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/bookings");
      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch (err) {
      toast.error(err.message || "Could not load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (booking, action) => {
    try {
      if (action === "cancel") {
        await apiFetch(`/api/bookings/${booking._id}/cancel`, { method: "PATCH" });
        toast.success("Booking cancelled");
      } else {
        await apiFetch(`/api/bookings/${booking._id}/confirm`, { method: "PATCH" });
        toast.success("Booking confirmed");
      }
      load();
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

  return (
    <div className="container section">
      <div className="section-head">
        <h2>My Bookings</h2>
        <p>Track your studio reservations and their current status.</p>
      </div>
      {loading ? <Skeleton count={3} /> : bookings.length === 0 ? (
        <div className="empty">
          <h3>No bookings yet</h3>
          <p className="muted">Find a space you love and book your first creative session.</p>
          <Link href="/studios" className="btn" style={{ marginTop: 12 }}>Explore Studios</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {bookings.map((b) => (
            <div className="booking-card" key={b._id}>
              {b.studioImage && <img src={b.studioImage} alt={b.studioTitle} />}
              <div style={{ flex: 1, minWidth: 220 }}>
                <b>{b.studioTitle}</b>
                <div className="muted">{b.date} · {b.startTime} – {b.endTime} · {b.hours} hour(s)</div>
                <div>Total: <b>${b.totalPrice ?? ""}</b></div>
                {b.canConfirm && b.userEmail && <div className="muted">Booked by: {b.userEmail}</div>}
              </div>
              <span className={`status status-${b.status}`}>{b.status}</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {b.status === "Pending" && b.canConfirm && (
                  <button className="btn btn-sm" onClick={() => act(b, "confirm")}>Confirm Booking</button>
                )}
                {b.status === "Pending" && b.canCancel !== false && (
                  <button className="btn btn-outline btn-sm" onClick={() => act(b, "cancel")}>Cancel Booking</button>
                )}
                {b.status === "Confirmed" && (
                  <button className="btn btn-sm" onClick={() => downloadInvoice(b)}>Download Invoice</button>
                )}
                {b.studioId && <Link href={`/studios/${b.studioId}`} className="btn btn-outline btn-sm">View Studio</Link>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return <PrivateRoute><Content /></PrivateRoute>;
}
