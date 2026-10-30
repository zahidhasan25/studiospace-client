"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function hoursBetween(start, end) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

export default function BookingModal({ studio, onClose, onBooked }) {
  const { user } = useAuth();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [busy, setBusy] = useState(false);

  const hours = useMemo(() => hoursBetween(startTime, endTime), [startTime, endTime]);
  const total = hours > 0 ? hours * Number(studio.hourlyRate || 0) : 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to book a studio");
      return;
    }
    if (!date) {
      toast.error("Please choose a booking date");
      return;
    }
    if (hours <= 0) {
      toast.error("End time must be after start time");
      return;
    }
    setBusy(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime,
          endTime,
          hours,
        }),
      });
      toast.success("Booking request saved! Your slot is Pending.");
      onBooked?.();
      onClose();
    } catch (err) {
      toast.error(err.message || "Booking failed. Please try another time.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>Book Workspace Now</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          {studio.title} · ${studio.hourlyRate} / hr · {studio.location}
        </p>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="book-date">Date</label>
              <input id="book-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="book-start">Start Time</label>
              <input id="book-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="book-end">End Time</label>
              <input id="book-end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
            <div className="field">
              <label>Hours (auto)</label>
              <input value={hours > 0 ? hours : ""} readOnly placeholder="Select start and end time" />
            </div>
            <div className="field">
              <label>Estimated Total</label>
              <input value={`$${total}`} readOnly />
            </div>
          </div>
          {hours <= 0 && (
            <p className="field-error">End time must be after start time.</p>
          )}
          <p className="muted" style={{ fontSize: ".9rem" }}>
            Booking as {user?.name || user?.email}. Your reservation will start as Pending and the host will confirm it.
          </p>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={busy}>Cancel</button>
            <button type="submit" className="btn" disabled={busy || hours <= 0}>
              {busy ? "Booking…" : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
