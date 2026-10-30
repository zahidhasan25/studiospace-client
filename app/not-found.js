import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container section" style={{ textAlign: "center" }}>
      <div style={{ fontSize: "4rem" }}>◎ 🎬</div>
      <h1>404 — This studio is not on the set</h1>
      <p className="muted">
        The page you are looking for has moved, closed for the day, or was never booked.
        Let us take you back to a space that is ready for your next shoot.
      </p>
      <Link href="/" className="btn" style={{ marginTop: 16 }}>
        Return to Home
      </Link>
    </div>
  );
}
