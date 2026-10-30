"use client";

export default function ConfirmModal({ title, message, confirmLabel = "Delete", onCancel, onConfirm, busy }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>{title}</h3>
        <p className="muted">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel} disabled={busy}>Cancel</button>
          <button className="btn" style={{ background: "#dc2626" }} onClick={onConfirm} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
